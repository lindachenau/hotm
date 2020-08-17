import React, { useState, useEffect, createContext } from "react"
import useAxiosFetch from '../actions/useAxiosFetch'
import useAxiosCRUD from '../actions/useAxiosCRUD'
import { normaliseArtists, normaliseServices, normaliseCorpCards, normaliseAdminTasks, getEvents, getAdminBookings } from '../utils/dataFormatter'
import { bookings_url, admin_bookings_url, user_url, access_token, artists_url, services_url, corporate_cards_url, admin_tasks_url } from '../config/dataLinks'
import axios from 'axios'
import moment from 'moment'
import { BOOKING_TYPE } from "../actions/bookingCreator"


/*
 * Booking store provider handles all async requests to services, artists, bookings and clients APIs.
 * Each booking requires information from all above 4 APIs. The extracted info from all 4 APIs is 
 * stored in events. Events are used in "Manage bookings" (BookingCards) and "Booking calendar".
 * 
 * services and artists APIs are requested during app initialisation and stored in local states. There
 * won't be further requests during the life of the app. If backend updates services and artists, the app 
 * wouldn't know about it. To work around the problem, a timer is set to revalidate services and artists every hour
 * in the background. If the app is closed and open again, services and artists will be requested from server again.
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

const BookingsStoreProvider = ({children, storeCtrl, bookingFilter, fetchArtists, fetchServices, fetchCorpCards, fetchAdminTasks, isArtist}) => {
  const {servicesTrigger, artistsTrigger, corpCardsTrigger, adminTasksTrigger, requestMethod, data, callMe, bookingTrigger, bookingTypeName} = storeCtrl
  const {fromDate, toDate, bookingType} = bookingFilter
  const artistId = bookingFilter.artist ? bookingFilter.artist.id : null
  const clientId = bookingFilter.client ? bookingFilter.client.id : null
  const corporateId = bookingFilter.corporate ? bookingFilter.corporate : null
  const [bookingUrl, setBookingUrl] = useState(initFilter(fromDate, toDate))
  const [services, setServices] = useState({})
  const [servicesFetched, setServicesFetched] = useState(false)
  const [artists, setArtists] = useState({})
  const [artistsFetched, setArtistsFetched] = useState(false)
  const [events, setEvents] = useState([])
  const [eventsFetched, setEventsFetched] = useState(false)
  const [adminBookings, setAdminBookings] = useState([])
  const [adminBookingsFetched, setAdminBookingsFetched] = useState(false)
  const [clientList, setClientList] = useState([])
  const [clientsFetchTrigger, setClientsFetchTrigger] = useState(false)
  const [clients, setClients] = useState({})
  const [corpCardsObj, setCorpCardsObj] = useState({})
  const [corpCards, setCorpCards] = useState([])
  const [adminTasks, setAdminTasks] = useState([])

  //Fetch services and artists every 60 minutes in case the data in the backend has changed
  useEffect(() => {
    const handle = setInterval(() => {
      fetchArtists()
      fetchServices()
    }, 3600000)

    return () => {clearInterval(handle)}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const servicesData = useAxiosFetch(services_url, [], servicesTrigger)

  useEffect(() => {
    if (servicesData.data.length !== 0) {
      //change array to object for easy access
      setServices(normaliseServices(servicesData.data))
      setServicesFetched(true)
    }
  }, [servicesData.data])

  //Fetch corporate cards and admin tasks every 60 minutes in case the data in the backend has changed
  useEffect(() => {
    const handle = setInterval(() => {
      fetchCorpCards()
      fetchAdminTasks()
    }, 3600000)

    return () => {clearInterval(handle)}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArtist])

  const corpCardsData = useAxiosFetch(corporate_cards_url, [], corpCardsTrigger)

  useEffect(() => {
    if (corpCardsData.data.length !== 0) {
      setCorpCardsObj(normaliseCorpCards(corpCardsData.data))
    }
  }, [corpCardsData.data])

  useEffect(() => {
    setCorpCards(Object.values(corpCardsObj))
  }, [corpCardsObj])

  const adminTasksData = useAxiosFetch(admin_tasks_url, [], adminTasksTrigger)

  useEffect(() => {
    if (adminTasksData.data.length !== 0) {
        setAdminTasks(normaliseAdminTasks(adminTasksData.data))
    }
  }, [adminTasksData.data])

  //update booking filter
  useEffect(() => {
    const bookingsURL = bookingType.name === BOOKING_TYPE.A ? bookings_url : admin_bookings_url
    let newFilter = `${bookingsURL}?from_date=${moment(fromDate).format("YYYY-MM-DD")}&to_date=${moment(toDate).format("YYYY-MM-DD")}`

    if (bookingType.name !== BOOKING_TYPE.A)
      newFilter = `${newFilter}&booking_type=${bookingType.name}`

    if (artistId)
      newFilter = `${newFilter}&artist_id=${artistId.toString()}`

    if (bookingType.name === BOOKING_TYPE.A) {
      if (clientId)
        newFilter = `${newFilter}&client_id=${clientId.toString()}`
    } else if (corporateId || clientId) {
      newFilter = `${newFilter}&corporate_or_client_id=${corporateId ? corporateId : clientId}`
    }

    setBookingUrl(newFilter)
  }, [fromDate, toDate, bookingType, artistId, clientId, corporateId])

  const artistsData = useAxiosFetch(artists_url, [], artistsTrigger)

  useEffect(() => {
    if (artistsData.data.length !== 0) {
      //change array to object for easy access
      setArtists(normaliseArtists(artistsData.data))
      setArtistsFetched(true)
    }
  }, [artistsData.data])

  let bookingsData = useAxiosCRUD(bookingUrl, {}, requestMethod, bookingTypeName, data, callMe, bookingTrigger)

  const getClientListFromBookings = (bookings, id_name) => {
    let list = []
    for (let key in bookings) {
      let client_id = bookings[key][id_name]
      if (!list.includes(client_id))
        list.push(client_id)
    }

    return list
  }

  //update client list whenever new bookings are loaded
  useEffect(() => {
    if (bookingsData.isLoading) {
      setEventsFetched(false)
    }
    else if (Object.keys(bookingsData.data).length !== 0) {
      
      if (bookingType.name === BOOKING_TYPE.A || bookingType.name === BOOKING_TYPE.P) {
        const id_name = bookingType.name === BOOKING_TYPE.A ? 'client_id' : 'card_or_client_id'
        setClientList(getClientListFromBookings(bookingsData.data, id_name))
      }
      
      setEventsFetched(false)
    } else {
      setEventsFetched(true)
    }
  }, [bookingsData.data, bookingsData.isLoading])

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientList])

  //regenerate events whenever clients or bookings data are updated
  useEffect(() => {
    if (artistsFetched && servicesFetched && Object.keys(clients).length > 0) {
      if (bookingType.name === BOOKING_TYPE.A) {
        setEvents(getEvents(bookingsData.data, artists, clients, services.items))
        setEventsFetched(true)
      } else {
        setAdminBookings(getAdminBookings(bookingType, bookingsData.data, artists, clients, services.items, corpCardsObj))
        setAdminBookingsFetched(true)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [clientsFetchTrigger, bookingsData.data])

  return (
    <BookingsStoreContext.Provider value={{services, servicesFetched, corpCards, adminTasks, 
      events, eventsFetched, adminBookings, adminBookingsFetched, artists, artistsFetched, bookingsData}}>
      {children}
    </BookingsStoreContext.Provider>
  )
}

export { BookingsStoreContext, BookingsStoreProvider }