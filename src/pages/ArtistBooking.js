import React from "react"
import { withRouter } from 'react-router-dom'
import ServiceSelection from '../config/ServiceSelectionContainer'
import ArtistBookingSteps from '../components/ArtistBookingSteps'
import AddPeople from '../config/AddPeopleContainer'
import ArtistPayment from '../config/ArtistPaymentContainer'

const ArtistBooking = ({ bookingStage, changeBookingStage, services, theme, bookingValue, depositPayable, artists, newBooking }) => {
  return (
    <React.Fragment>
      <ArtistBookingSteps activeStep={bookingStage}/>
      {bookingStage === 0 ? <ServiceSelection onSubmit={changeBookingStage} services={services} theme={theme} artistBooking={true}/> : null}
      {bookingStage === 1 ? 
        <AddPeople 
          changeBookingStage={changeBookingStage} 
          theme={theme} 
          items={services.items} 
          bookingValue={bookingValue}
          depositPayable={depositPayable}
          artists={artists}/> 
        : null
      }
      {bookingStage === 2 ? <ArtistPayment 
        changeBookingStage={changeBookingStage} 
        theme={theme} 
        items={services.items} 
        bookingValue={bookingValue}
        depositPayable={depositPayable} 
        bookingValue={bookingValue}
        newBooking={newBooking}/>
        : null
      }
    </React.Fragment>
  )
}

export default withRouter(ArtistBooking)
