import React, { useEffect } from "react"
import { withRouter } from 'react-router-dom'
import ServiceSelection from '../config/ServiceSelectionContainer'
import ArtistBookingSteps from '../components/ArtistBookingSteps'
import AddPeople from '../config/AddPeopleContainer'
import ArtistPayment from '../config/ArtistPaymentContainer'

const ArtistBooking = ({ bookingStage, changeBookingStage, resetBooking, services, theme, bookingValue, depositPayable, artists, newBooking, setManageState }) => {

  useEffect(() => {
    if (newBooking)
      resetBooking()
  }, [])

  return (
    <React.Fragment>
      <ArtistBookingSteps activeStep={bookingStage} newBooking={newBooking}/>
      {bookingStage === 0 ? 
        <ServiceSelection 
        onSubmit={changeBookingStage} 
        services={services} 
        theme={theme} 
        artistBooking={true}
        newBooking={newBooking}
        setManageState={setManageState}/> 
        : null
      }
      {bookingStage === 1 ? 
        <AddPeople 
          changeBookingStage={changeBookingStage} 
          theme={theme} 
          items={services.items} 
          bookingValue={bookingValue}
          depositPayable={depositPayable}
          newBooking={newBooking}
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
