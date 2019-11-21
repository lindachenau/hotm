import React, { useState, useEffect, useContext } from "react"
import { Route, Switch, HashRouter } from "react-router-dom"
import Booking from '../pages/Booking'
import Calendar from '../pages/Calendar'
import Manage from '../config/ManageContainer'
import Account from '../pages/Account'
import ScrollToTop from '../components/ScrollTop'
import CssBaseline from '@material-ui/core/CssBaseline'
import Topbar from '../components/Topbar'
import { BookingsStoreContext } from './BookingsStoreProvider'
import { getBookingValue, getDepositPayable } from '../utils/getBookingValue'

/**
 * For deploy testing frontend without backend
 */
const Routes = ({ theme, bookingStage, changeBookingStage, packageBooking, priceFactors, itemQty }) => {
  const { services, servicesFetched, events, eventsFetched, artists, bookingsData } = useContext(BookingsStoreContext)
  const [bookingValue, setBookingValue] = useState(0)
  const [depositPayable, setDepositPayable] = useState(0)

  useEffect(() => {
    setBookingValue(getBookingValue(services.items, priceFactors, itemQty))
    setDepositPayable(getDepositPayable(itemQty, bookingValue))
  }, [services.items, priceFactors, itemQty])
  
  return (
    <HashRouter>
      <ScrollToTop>
        <CssBaseline />
        <Topbar bookingValue={bookingValue}/>
        {servicesFetched &&
        <Switch>
          <Route exact path='/' render={() => 
            <Booking 
              theme={theme} 
              services={services} 
              bookingStage={bookingStage} 
              changeBookingStage={changeBookingStage} 
              bookingValue={bookingValue}
              depositPayable={depositPayable}
              artists={artists}/>} 
            />
          <Route path='/manage' render={() => <Manage events={events} eventsFetched={eventsFetched}/>} />
          <Route path='/calendar' render={() => <Calendar events={events} />} />
          <Route path='/account' render={() => <Account/>} />
        </Switch>}
      </ScrollToTop>
    </HashRouter>
  )
}

export default Routes