import React, { useEffect } from "react"
import { withRouter } from 'react-router-dom'
import ArtistSelection from '../config/ArtistSelectionContainer'
import BookingSteps from '../components/BookingSteps'
import ServiceSelection from '../config/ServiceSelectionContainer'
import Confirmation from '../config/ConfirmationContainer'
import Payment from '../config/PaymentContainer'
import { resetBooking } from "../actions/bookingCreator"

const Booking = ({ bookingStage, changeBookingStage, resetBooking, services, theme, bookingValue, depositPayable, artists }) => {

  useEffect(() => {
    resetBooking()
  }, [])

  return (
    <React.Fragment>
      <BookingSteps activeStep={bookingStage}/>
      {bookingStage === 0 ? <ServiceSelection onSubmit={changeBookingStage} services={services} theme={theme} newBooking={true}/> : null}
      {bookingStage === 1 ? <ArtistSelection changeBookingStage={changeBookingStage} theme={theme}/> : null}
      {bookingStage === 2 ? 
        <Confirmation 
          changeBookingStage={changeBookingStage} 
          theme={theme} 
          items={services.items} 
          bookingValue={bookingValue}
          artists={artists}/> 
        : null
      }
      {bookingStage === 3 ? <Payment 
        changeBookingStage={changeBookingStage} 
        theme={theme} 
        items={services.items} 
        bookingValue={bookingValue}
        depositPayable={depositPayable}/> 
        : null
      }
    </React.Fragment>
  )
}

export default withRouter(Booking)
