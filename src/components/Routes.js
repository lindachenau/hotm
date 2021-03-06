import React, { useState, useEffect, useContext, Suspense, lazy } from "react"
import { Route, Switch, HashRouter, Redirect } from "react-router-dom"
import ScrollToTop from './ScrollTop'
import CssBaseline from '@material-ui/core/CssBaseline'
import Topbar from './Topbar'
import { BookingsStoreContext } from './BookingsStoreProvider'
import { getBookingValue, getDepositPayable } from '../utils/getBookingValue'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Typography } from '@material-ui/core'

//Use route based lazy loading to split the code to smaller chunks
const Home = lazy(() => import('../pages/Home'))
const AnyTherapist = lazy(() => import('../pages/AnyTherapist'))
const TherapistBooking = lazy(() => import('../config/TherapistBookingContainer'))
const Manage = lazy(() => import('../pages/Manage'))
const MyCalendar = lazy(() => import('../config/MyCalendarContainer'))
const ChooseTherapist = lazy(() => import('../pages/ChooseTherapist'))
const CorporateBooking = lazy(() => import('../config/CorporateBookingContainer'))
const PackageBooking = lazy(() => import('../config/PackageBookingContainer'))
const PaymentLink = lazy(() => import('../config/PaymentLinkContainer'))
const Admin = lazy(() => import('../config/AdminContainer'))

const Routes = ({ 
  theme, 
  bookingStage, 
  bookingType, 
  changeBookingStage, 
  resetBooking, 
  priceFactors, 
  itemQty, 
  loggedIn,
  isArtist,
  userEmail }) => {
  const { services, artistsFetched, servicesFetched, events, eventsFetched, adminBookings, adminBookingsFetched, bookingsData, artists } = 
    useContext(BookingsStoreContext)
  const [bookingValue, setBookingValue] = useState(0)
  const [depositPayable, setDepositPayable] = useState(0)
  const [artistSignedIn, setArtistSignedIn] = useState(false)
  const [prevActiveStep, setPrevActiveStep] = useState(0)
  //Admin and therapist booking event for checkout pop-up in MyCalendar
  const [bookingEvent, setBookingEvent] = useState({adminBookings: false})
  const [triggerSignin, setTriggerSignin] = useState(false)
  const ready = artistsFetched && servicesFetched

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
        <Topbar 
          bookingValue={bookingValue} 
          loggedIn={loggedIn} 
          isArtist={isArtist} 
          artists={artists} 
          setArtistSignedIn={setArtistSignedIn}
          triggerSignin={triggerSignin}
          setTriggerSignin={setTriggerSignin}
        />
        <Suspense fallback={<CircularProgress/>}>
          <Switch>
            <Route exact path='/' render={() => 
              <Home 
                theme={theme}
                artists={artists}/>}
            />
            <Route path='/any-therapist'>
              {ready ? 
                <AnyTherapist 
                  theme={theme} 
                  services={services} 
                  bookingStage={bookingStage} 
                  changeBookingStage={changeBookingStage} 
                  bookingValue={bookingValue}
                  depositPayable={depositPayable}
                  artists={artists}
                  resetBooking={resetBooking}
                  triggerSignin={triggerSignin}
                  setTriggerSignin={setTriggerSignin}
                />
                :
                <Typography variant="h5" align="center" color="textPrimary">
                  Sorry service data is not available.
                </Typography>
              }
            </Route>
            <Route path='/choose-therapist'>
            {ready ? 
              <ChooseTherapist 
                theme={theme} 
                services={services} 
                bookingStage={bookingStage} 
                changeBookingStage={changeBookingStage} 
                bookingValue={bookingValue}
                depositPayable={depositPayable}
                artists={artists}
                resetBooking={resetBooking}
                triggerSignin={triggerSignin}
                setTriggerSignin={setTriggerSignin}
              />
              :
              <Typography variant="h5" align="center" color="textPrimary">
                Sorry service data is not available.
              </Typography>
              }
            </Route>
            <Route path='/therapist-booking'> 
              {isArtist ? 
                <TherapistBooking 
                  theme={theme} 
                  services={services}
                  itemQty={itemQty}
                  artists={artists}
                  userEmail={userEmail}
                  bookingValue={bookingValue}
                  resetBooking={resetBooking}
                  artistSignedIn={artistSignedIn}
                  artistBooking={events[prevActiveStep]}
                  checkoutEvent={bookingEvent}
                />
                :
                <Redirect to="/" />
              }
            </Route>            
            <Route path='/corporate-booking'>
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
            <Route path='/package-booking'>
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
            <Route path='/manage-bookings'>
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
            <Route path='/my-calendar'>
            {isArtist ?
              <MyCalendar 
                theme={theme}
                userEmail={userEmail}
                artistSignedIn={artistSignedIn}
                artists={artists}
                services={services}
                bookingEvent={bookingEvent}
                setBookingEvent={setBookingEvent}/>
              :
              <Redirect to="/" />
            }                
            </Route>
            <Route exact path='/payment'>
              <PaymentLink/>
            </Route>
            <Route exact path='/admin'>
              {isArtist ? 
                <Admin/>
                :
                <Redirect to="/" />
              }
            </Route>    
          </Switch>
        </Suspense>
      </ScrollToTop>
    </HashRouter>
  )
}

export default Routes