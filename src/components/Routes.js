import React, { useState, useEffect, useContext, Suspense, lazy } from "react"
import { Route, Switch, HashRouter } from "react-router-dom"
import ScrollToTop from './ScrollTop'
import CssBaseline from '@material-ui/core/CssBaseline'
import Topbar from './Topbar'
import { BookingsStoreContext } from './BookingsStoreProvider'
import { getBookingValue, getDepositPayable } from '../utils/getBookingValue'
import CircularProgress from '@material-ui/core/CircularProgress'

//Use route based lazy loading to split the code to smaller chunks
// const Booking = lazy(() => import('../pages/Booking'))
// const ArtistBooking = lazy(() => import('../pages/ArtistBooking'))
// const Manage = lazy(() => import('../config/ManageContainer'))
// const Calendar = lazy(() => import('../pages/Calendar'))

import Booking from '../pages/Booking'
import ArtistBooking from '../pages/ArtistBooking'
import Manage from  '../config/ManageContainer'
import Calendar from '../pages/Calendar'

/**
 * For deploy testing frontend without backend
 */
const Routes = ({ theme, bookingStage, changeBookingStage, resetBooking, priceFactors, itemQty, loggedIn, isArtist }) => {
  const { services, servicesFetched, events, eventsFetched, artists } = useContext(BookingsStoreContext)
  const [bookingValue, setBookingValue] = useState(0)
  const [depositPayable, setDepositPayable] = useState(0)

  useEffect(() => {
    setBookingValue(getBookingValue(services.items, priceFactors, itemQty))
    setDepositPayable(getDepositPayable(bookingValue))
  }, [services.items, priceFactors, itemQty, bookingValue])
  
  return (
    <HashRouter>
      <ScrollToTop>
        <CssBaseline />
        <Topbar bookingValue={bookingValue} loggedIn={loggedIn} isArtist={isArtist} artists={artists}/>
        <Suspense fallback={<CircularProgress/>}>
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
                artists={artists}
                resetBooking={resetBooking}/>} 
            />
            <Route exact path='/artist' render={() => 
              <ArtistBooking 
                theme={theme} 
                services={services} 
                bookingStage={bookingStage} 
                changeBookingStage={changeBookingStage} 
                bookingValue={bookingValue}
                depositPayable={depositPayable}
                artists={artists}
                newBooking={true}
                resetBooking={resetBooking}/>} 
            />
            <Route path='/manage' render={() => 
              <Manage 
                events={events} 
                eventsFetched={eventsFetched}
                services={services} 
                bookingStage={bookingStage} 
                changeBookingStage={changeBookingStage} 
                bookingValue={bookingValue}
                depositPayable={depositPayable}
                artists={artists}/>} 
            />
            <Route path='/calendar' render={() => <Calendar events={events} />} />
          </Switch>}
        </Suspense>
      </ScrollToTop>
    </HashRouter>
  )
}

export default Routes