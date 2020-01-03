import React, { useState, useEffect, createContext } from "react"
import useAxiosFetch from '../actions/useAxiosFetch'
import useAxiosCRUD from '../actions/useAxiosCRUD'
import { normaliseArtists, normaliseServices } from '../utils/dataFormatter'
import { bookings_url, user_url, access_token, artists_url, services_url } from '../config/dataLinks'
import { getEvents } from '../utils/dataFormatter'
import axios from 'axios'
import moment from 'moment'

const BookingsStoreContext = createContext()

const initFilter = (fromDate, toDate) => {
  return new String (bookings_url + '?from_date=' + moment(fromDate).format("YYYY-MM-DD") + '&to_date=' + moment(toDate).format("YYYY-MM-DD"))
}

const BookingsStoreProvider = ({children, storeCtrl, bookingFilter}) => {
  const {servicesActive, artistsActive, bookingsActive, requestMethod, data, callMe, bookingTrigger} = storeCtrl
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

  let servicesData = useAxiosFetch(services_url, [], servicesActive)

  useEffect(() => {
    if (servicesData.data.length !== 0) {
      setServices(normaliseServices(servicesData.data))
      setServicesFetched(true)
    }
  }, [servicesData.isLoading, servicesData.data])

  let artistsData = useAxiosFetch(artists_url, [], artistsActive)

  //update booking filter
  useEffect(() => {
    let newFilter = new String(bookings_url + '?from_date=' + moment(fromDate).format("YYYY-MM-DD"))

    newFilter = newFilter + '&to_date=' + moment(toDate).format("YYYY-MM-DD")
    
    if (artistId)
      newFilter = newFilter + '&artist_id=' + artistId.toString()

    if (clientId)
    newFilter = newFilter + '&client_id=' + clientId.toString()

    setBookingUrl(newFilter)
  }, [fromDate, toDate, artistId, clientId])

  useEffect(() => {
    if (artistsData.data.length !== 0) {
      setArtists(normaliseArtists(artistsData.data))
      setArtistsFetched(true)
    }
  }, [artistsData.isLoading, artistsData.data])

  let bookingsData = useAxiosCRUD(bookingUrl, {}, bookingsActive, requestMethod, data, callMe, bookingTrigger)

  const getClientListFromBookings = bookings => {
    let list = []
    for (let key in bookings) {
      let client_id = bookings[key].client_id
      if (!list.includes(client_id))
        list.push(client_id)
    }

    return list
  }

  useEffect(() => {
    if (bookingsData.data.length !== 0) {
      setClientList(getClientListFromBookings(bookingsData.data))
    }
  }, [bookingsData.isLoading, bookingsData.data])

  useEffect(() => {
    if (clientList.length > 0) {
      
      Promise.allSettled(clientList.map(id => {
        const config = {
          method: 'get',
          headers: { 'Authorization': access_token },
          url: user_url + '/' + id
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

  useEffect(() => {
    if (artistsFetched && servicesFetched) {
      setEvents(getEvents(bookingsData.data, artists, clients, services.items))
      setEventsFetched(true)
    }
  }, [clientsFetchTrigger, clients])

  return (
    <BookingsStoreContext.Provider value={{services, servicesFetched, events, eventsFetched, artists, artistsFetched, bookingsData}}>
      {children}
    </BookingsStoreContext.Provider>
  )
}

export { BookingsStoreContext, BookingsStoreProvider }