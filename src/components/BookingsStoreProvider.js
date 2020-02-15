import React, { useState, useEffect, createContext } from "react"
import useAxiosFetch from '../actions/useAxiosFetch'
import useAxiosCRUD from '../actions/useAxiosCRUD'
import { normaliseArtists, normaliseServices } from '../utils/dataFormatter'
import { bookings_url, user_url, access_token, artists_url, services_url } from '../config/dataLinks'
import { getEvents } from '../utils/dataFormatter'
import axios from 'axios'
import moment from 'moment'


/*
 * Booking store provider handles all async requests to services, artists, bookings and clients APIs.
 * Each booking requires information from all above 4 APIs. The extracted info from all 4 APIs is 
 * stored in events. Events are used in "Manage bookings" (BookingCards) and "Booking calendar".
 * 
 * services and artists APIs are requested during app initialisation and stored in local states. There
 * won't be further requests during the life of the app. If backend updates services and artists, the app 
 * wouldn't know about it. To get new services and artists, the app must be closed and reopen.
 * 
 * bookings and clients APIs are requested by demand. Bookings are loaded by the search filter or adding 
 * new bookings. All relevant clients in the loaded bookings will be requested to complete the corresponding
 * booking events.
 * 
 * The dependency diagram for events is shown below:
 * services, artists            \
 *                               -> events
 * bookings          -> clients / 
 * 
 * Since services and artists data won't change during the life of the app, whenever bookings data is 
 * updated, a new client list is generated and then fetched. bookings or clients data updates will refresh 
 * events.
 * 
 */

const BookingsStoreContext = createContext()

const initFilter = (fromDate, toDate) => {
  return `${bookings_url}?from_date=${moment(fromDate).format("YYYY-MM-DD")}&to_date=${moment(toDate).format("YYYY-MM-DD")}`
}

const BookingsStoreProvider = ({children, storeCtrl, bookingFilter}) => {
  const {servicesActive, artistsActive, requestMethod, data, callMe, bookingTrigger} = storeCtrl
  const {fromDate, toDate} = bookingFilter
  const artistId = bookingFilter.artist ? bookingFilter.artist.id : null
  const clientId = bookingFilter.client ? bookingFilter.client.id : null
  const [bookingUrl, setBookingUrl] = useState(initFilter(fromDate, toDate))
  const [services, setServices] = useState({})
  const [servicesFetched, setServicesFetched] = useState(false)
  const [artists, setArtists] = useState({})
  const [artistsFetched, setArtistsFetched] = useState(false)
  const [events, setEvents] = useState([])
  const [eventsFetched, setEventsFetched] = useState(false)
  const [clientList, setClientList] = useState([])
  const [clientsFetchTrigger, setClientsFetchTrigger] = useState(false)
  const [clients, setClients] = useState({})

  const servicesData = useAxiosFetch(services_url, [], servicesActive)

  useEffect(() => {
    if (servicesData.data.length !== 0) {
      //change array to object for easy access
      setServices(normaliseServices(servicesData.data))
      setServicesFetched(true)
    }
  }, [servicesData.data])

    //update booking filter
  useEffect(() => {
    let newFilter = `${bookings_url}?from_date=${moment(fromDate).format("YYYY-MM-DD")}&to_date=${moment(toDate).format("YYYY-MM-DD")}`
    
    if (artistId)
      newFilter = `${newFilter}&artist_id=${artistId.toString()}`

    if (clientId)
      newFilter = `${newFilter}&client_id=${clientId.toString()}`

    setBookingUrl(newFilter)
  }, [fromDate, toDate, artistId, clientId])

  const artistsData = useAxiosFetch(artists_url, [], artistsActive)

  useEffect(() => {
    if (artistsData.data.length !== 0) {
      //change array to object for easy access
      setArtists(normaliseArtists(artistsData.data))
      setArtistsFetched(true)
    }
  }, [artistsData.data])

  let bookingsData = useAxiosCRUD(bookingUrl, {}, requestMethod, data, callMe, bookingTrigger)

  const getClientListFromBookings = bookings => {
    let list = []
    for (let key in bookings) {
      let client_id = bookings[key].client_id
      if (!list.includes(client_id))
        list.push(client_id)
    }

    return list
  }

  //update client list whenever new bookings are loaded
  useEffect(() => {
    if (bookingsData.data.length !== 0) {
      setClientList(getClientListFromBookings(bookingsData.data))
    }
  }, [bookingsData.data])

  //fetch new clients whenever the client list is updated
  useEffect(() => {
    if (clientList.length > 0) {
      setClients({})
      Promise.allSettled(clientList.map(id => {
        const config = {
          method: 'get',
          headers: { 'Authorization': access_token },
          url: `${user_url}/${id}`
        }
        return axios(config)
      }))
      .then((results) => {
        let temp = {}
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            let client = result.value.data
            let id = client.id
            temp[id.toString()] = {
              id,
              name: client.name,
              phone: client.meta.billing_phone[0]
            }
          }
        })
        setClients(temp)
        setClientsFetchTrigger(!clientsFetchTrigger)
      })
    }
  }, [clientList])

  //regenerate events whenever clients or bookings data are updated
  useEffect(() => {
    if (artistsFetched && servicesFetched && Object.keys(clients).length > 0) {
      setEvents(getEvents(bookingsData.data, artists, clients, services.items))
      setEventsFetched(true)
    }
  }, [clientsFetchTrigger, bookingsData.data])

  return (
    <BookingsStoreContext.Provider value={{services, servicesFetched, events, eventsFetched, artists, artistsFetched, bookingsData}}>
      {children}
    </BookingsStoreContext.Provider>
  )
}

export { BookingsStoreContext, BookingsStoreProvider }