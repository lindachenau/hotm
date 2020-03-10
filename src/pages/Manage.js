import React, { useState } from "react"
import { withRouter } from 'react-router-dom'
import BookingCards from '../config/BookingCardsContainer'
import ArtistBooking from '../pages/ArtistBooking'


const Manage = ({
  events, 
  eventsFetched, 
  bookingStage, 
  changeBookingStage, 
  services, 
  bookingValue, 
  depositPayable, 
  artists}) => {
  const [manageState, setManageState] = useState('Default')
  const [activeStep, setActiveStep] = useState(0)

  return (
    <>
      {manageState === 'Default' ?
        <BookingCards 
          events={events} 
          eventsFetched={eventsFetched} 
          changeBookingStage={changeBookingStage}
          setManageState={setManageState}
          activeStep={activeStep}
          setActiveStep={setActiveStep}/>
        : null
      }
      {manageState === 'Edit' || manageState === 'Checkout' ?
        <ArtistBooking
          bookingStage={bookingStage} 
          changeBookingStage={changeBookingStage}
          services={services}
          bookingValue={bookingValue}
          depositPayable={depositPayable}
          artists={artists}
          newBooking={false}
          manageState={manageState}
          setManageState={setManageState}/>
          : null
      }
    </>
  )
}

export default withRouter(Manage)
