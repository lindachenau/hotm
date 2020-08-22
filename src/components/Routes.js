import React, { useState, useEffect, useContext, Suspense, lazy } from "react"
import { Route, Switch, HashRouter, Redirect } from "react-router-dom"
import ScrollToTop from './ScrollTop'
import CssBaseline from '@material-ui/core/CssBaseline'
import Topbar from './Topbar'
import { BookingsStoreContext } from './BookingsStoreProvider'
import { getBookingValue, getDepositPayable } from '../utils/getBookingValue'
import CircularProgress from '@material-ui/core/CircularProgress'

//Use route based lazy loading to split the code to smaller chunks
const ClientBooking = lazy(() => import('../pages/ClientBooking'))
const ArtistBooking = lazy(() => import('../config/ArtistBookingContainer'))
const Manage = lazy(() => import('../config/ManageContainer'))
const Checkout = lazy(() => import('../pages/Checkout'))
const CorporateBooking = lazy(() => import('../config/CorporateBookingContainer'))
const PackageBooking = lazy(() => import('../config/PackageBookingContainer'))

const Routes = ({ theme, bookingStage, bookingType, changeBookingStage, resetBooking, priceFactors, itemQty, loggedIn, isArtist, userEmail }) => {
  const { services, servicesFetched, events, eventsFetched, adminBookings, adminBookingsFetched, bookingsData, artists } = useContext(BookingsStoreContext)
  const [bookingValue, setBookingValue] = useState(0)
  const [depositPayable, setDepositPayable] = useState(0)
  const [artistSignedIn, setArtistSignedIn] = useState(false)
  const [prevActiveStep, setPrevActiveStep] = useState(0)

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
            <Route path='/artist'> 
              {isArtist ? 
                <ArtistBooking 
                  theme={theme} 
                  services={services}
                  itemQty={itemQty}
                  artists={artists}
                  userEmail={userEmail}
                  bookingValue={bookingValue}
                  resetBooking={resetBooking}
                  artistSignedIn={artistSignedIn}
                  artistBooking={events[prevActiveStep]}
                />
                :
                <Redirect to="/" />
              }
            </Route>            
            <Route path='/corporate'>
              {isArtist ?
                <CorporateBooking
                  artists={artists}
                  userEmail={userEmail}
                  artistSignedIn={artistSignedIn}
                  adminBooking={adminBookings[prevActiveStep]}
                />
                :
                <Redirect to="/" />
              }
            </Route>
            <Route path='/package'>
            {isArtist ?
              <PackageBooking
                artists={artists}
                userEmail={userEmail}
                artistSignedIn={artistSignedIn}
                adminBooking={adminBookings[prevActiveStep]}
              />
              :
              <Redirect to="/" />
            }                
            </Route>
            <Route path='/manage'>
            {isArtist ?
              <Manage 
                events={events} 
                eventsFetched={eventsFetched}
                adminBookings={adminBookings}
                adminBookingsFetched={adminBookingsFetched}
                bookingData={bookingsData}
                bookingType={bookingType}
                prevActiveStep={prevActiveStep}
                setPrevActiveStep={setPrevActiveStep}
              />
              :
              <Redirect to="/" />
            }                  
            </Route>
            <Route path='/checkout'>
            {isArtist ?
              <Checkout 
                events={events} 
                eventsFetched={eventsFetched}
                services={services} 
                bookingValue={bookingValue}
                depositPayable={depositPayable}
                artists={artists}/>
              :
              <Redirect to="/" />
            }                
            </Route>           
          </Switch>}
        </Suspense>
      </ScrollToTop>
    </HashRouter>
  )
}

export default Routes