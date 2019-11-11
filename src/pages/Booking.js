import React from "react"
import { withRouter } from 'react-router-dom'
import ArtistSelection from '../config/ArtistSelectionContainer'
import BookingSteps from '../components/BookingSteps'
import ServiceSelection from '../config/ServiceSelectionContainer'
import Confirmation from '../config/ConfirmationContainer'
import Payment from '../components/Payment'

const Booking = ({ bookingStage, changeBookingStage, services, theme, bookingValue, packageBooking }) => {
  return (
    <React.Fragment>
      <BookingSteps activeStep={bookingStage}/>
      {bookingStage === 0 ? <ServiceSelection onSubmit={changeBookingStage} services={services} theme={theme}/> : null}
      {bookingStage === 1 ? <ArtistSelection changeBookingStage={changeBookingStage} theme={theme}/> : null}
      {bookingStage === 2 ? <Confirmation changeBookingStage={changeBookingStage} theme={theme} bookingValue={bookingValue}/> : null}
      {bookingStage === 3 ? <Payment 
        changeBookingStage={changeBookingStage} 
        theme={theme} 
        bookingValue={bookingValue} 
        packageBooking={packageBooking}/> 
        : null
      }
    </React.Fragment>
  )
}

export default withRouter(Booking)
