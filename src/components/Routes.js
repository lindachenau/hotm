import React, { useState, useEffect, useContext, Suspense, lazy } from "react"
import { Route, Switch, HashRouter } from "react-router-dom"
import ScrollToTop from './ScrollTop'
import CssBaseline from '@material-ui/core/CssBaseline'
import Topbar from './Topbar'
import { BookingsStoreContext } from './BookingsStoreProvider'
import { getBookingValue, getDepositPayable } from '../utils/getBookingValue'
import CircularProgress from '@material-ui/core/CircularProgress'

//Use route based lazy loading to split the code to smaller chunks
const ClientBooking = lazy(() => import('../pages/ClientBooking'))
const ArtistBooking = lazy(() => import('../pages/ArtistBooking'))
const Manage = lazy(() => import('../pages/Manage'))
const Checkout = lazy(() => import('../pages/Checkout'))
const CorporateBooking = lazy(() => import('../pages/CorporateBooking'))
const PackageBooking = lazy(() => import('../pages/PackageBooking'))

const Routes = ({ theme, bookingStage, changeBookingStage, resetBooking, priceFactors, itemQty, loggedIn, isArtist, userEmail }) => {
  const { services, servicesFetched, events, eventsFetched, artists } = useContext(BookingsStoreContext)
  const [bookingValue, setBookingValue] = useState(0)
  const [depositPayable, setDepositPayable] = useState(0)
  const [artistSignedIn, setArtistSignedIn] = useState(false)

  useEffect(() => {
    setBookingValue(getBookingValue(services.items, priceFactors, itemQty))
  }, [services.items, priceFactors, itemQty])
  
  useEffect(() => {
    setDepositPayable(getDepositPayable(bookingValue))
  }, [bookingValue])

  return (
    <HashRouter>
      <ScrollToTop>
        <CssBaseline />
        <Topbar bookingValue={bookingValue} loggedIn={loggedIn} isArtist={isArtist} artists={artists} setArtistSignedIn={setArtistSignedIn}/>
        <Suspense fallback={<CircularProgress/>}>
        {servicesFetched &&
          <Switch>
            <Route exact path='/' render={() => 
              <ClientBooking 
                theme={theme} 
                services={services} 
                bookingStage={bookingStage} 
                changeBookingStage={changeBookingStage} 
                bookingValue={bookingValue}
                depositPayable={depositPayable}
                artists={artists}
                resetBooking={resetBooking}/>} 
            />
            {isArtist && <Route path='/artist' render={() => 
              <ArtistBooking 
                theme={theme} 
                services={services}
                itemQty={itemQty}
                artists={artists}
                userEmail={userEmail}
                resetBooking={resetBooking}
                artistSignedIn={artistSignedIn}/>} 
            />}
            {isArtist && <Route path='/corporate' render={() => 
              <CorporateBooking
                artists={artists}
                artistSignedIn={artistSignedIn}/>} 
            />}
            {isArtist && <Route path='/package' render={() => 
              <PackageBooking
                artists={artists}
                artistSignedIn={artistSignedIn}/>} 
            />}                      
            {isArtist && <Route path='/manage' render={() => 
              <Manage 
                events={events} 
                eventsFetched={eventsFetched}
                services={services} 
                bookingStage={bookingStage} 
                changeBookingStage={changeBookingStage} 
                bookingValue={bookingValue}
                depositPayable={depositPayable}
                artists={artists}/>} 
            />}
            {isArtist && <Route path='/checkout' render={() => 
              <Checkout 
                events={events} 
                eventsFetched={eventsFetched}
                services={services} 
                bookingValue={bookingValue}
                depositPayable={depositPayable}
                artists={artists}/>} 
            />}           
          </Switch>}
        </Suspense>
      </ScrollToTop>
    </HashRouter>
  )
}

export default Routes