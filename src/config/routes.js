//import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect } from "react"
import { Route, Switch, HashRouter } from "react-router-dom"
import Booking from '../pages/Booking'
import Calendar from '../pages/Calendar'
import Account from '../pages/Account'
import ScrollToTop from '../components/ScrollTop'
// import { getArtists, getBookings, getClients, getServices } from '../utils/load'
import { getArtists, getBookings, getClients, getServices } from '../utils/fakeload'

/**
 * For deploy testing frontend without backend
 */
const Routes = (props) => {
  const [artists] = useState(getArtists())
  const [clients] = useState(getClients())
  const [services] = useState(getServices())
  const [events, setEvents] = useState(getBookings(artists, clients, services.items, 300))
  const { theme } = props

  return (
    <HashRouter>
      <ScrollToTop>
        <Switch>
          <Route exact path='/' render={() => <Booking theme={theme} services={services} artists={artists}/>} />
          <Route path='/account' render={() => <Account events={events} />} />
          <Route path='/calendar' render={() => <Calendar events={events} />} />
        </Switch>
      </ScrollToTop>
    </HashRouter>
  )
}

export default Routes