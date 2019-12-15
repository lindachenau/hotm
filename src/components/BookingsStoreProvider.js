import React, { useState, useEffect, createContext } from "react"
import useAxiosFetch from '../actions/useAxiosFetch'
import useAxiosCRUD from '../actions/useAxiosCRUD'
import { normaliseArtists, normaliseClients, normaliseServices } from '../utils/dataFormatter'
import { bookings_url, artists_url, clients_url, services_url } from '../config/dataLinks'
import { getEvents } from '../utils/fakeload'

const BookingsStoreContext = createContext()

const BookingsStoreProvider = ({children, storeCtrl}) => {
  const {servicesActive, artistsActive, clientsActive, bookingsActive, requestMethod, data, callMe} = storeCtrl
  const [services, setServices] = useState({})
  const [servicesFetched, setServicesFetched] = useState(false)
  const [artists, setArtists] = useState({})
  const [artistsFetched, setArtistsFetched] = useState(false)
  const [clients, setClients] = useState({})
  const [clientsFetched, setClientsFetched] = useState(false)
  const [events, setEvents] = useState([])
  const [eventsFetched, setEventsFetched] = useState(false)

  let servicesData = useAxiosFetch(services_url, [], servicesActive);

  useEffect(() => {
    if (servicesData.data.length != 0) {
      setServices(normaliseServices(servicesData.data))
      setServicesFetched(true)
    }
  }, [servicesData.isLoading])

  let artistsData = useAxiosFetch(artists_url, [], artistsActive);

  useEffect(() => {
    if (artistsData.data.length != 0) {
      setArtists(normaliseArtists(artistsData.data))
      setArtistsFetched(true)
    }
  }, [artistsData.isLoading])

  let clientsData = useAxiosFetch(clients_url, [], clientsActive);

  useEffect(() => {
    if (clientsData.data.length != 0) {
      setClients(normaliseClients(clientsData.data))
      setClientsFetched(true)
    }
  }, [clientsData.isLoading])

  let bookingsData = useAxiosCRUD(bookings_url, {}, bookingsActive, requestMethod, data, callMe);

  useEffect(() => {
    if (Object.keys(bookingsData.data).length != 0 && !bookingsData.isLoading && !bookingsData.isUpdating && artistsFetched && clientsFetched && servicesFetched) {
      setEvents(getEvents(bookingsData.data, artists, clients, services.items))
      setEventsFetched(true)
    }
  }, [bookingsData.isLoading, bookingsData.isUpdating, bookingsData.data, artistsFetched, clientsFetched, servicesFetched])

  return (
    <BookingsStoreContext.Provider value={{services, servicesFetched, events, eventsFetched, artists, artistsFetched, bookingsData}}>
      {children}
    </BookingsStoreContext.Provider>
  )
}

export { BookingsStoreContext, BookingsStoreProvider }