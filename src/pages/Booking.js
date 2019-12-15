import React from "react"
import { withRouter } from 'react-router-dom'
import ArtistSelection from '../config/ArtistSelectionContainer'
import BookingSteps from '../components/BookingSteps'
import ServiceSelection from '../config/ServiceSelectionContainer'
import Confirmation from '../config/ConfirmationContainer'
import Payment from '../config/PaymentContainer'

const Booking = ({ bookingStage, changeBookingStage, services, theme, bookingValue, depositPayable, artists }) => {
  return (
    <React.Fragment>
      <BookingSteps activeStep={bookingStage}/>
      {bookingStage === 0 ? <ServiceSelection onSubmit={changeBookingStage} services={services} theme={theme}/> : null}
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
        bookingValue={bookingValue}
        depositPayable={depositPayable}/> 
        : null
      }
    </React.Fragment>
  )
}

export default withRouter(Booking)
