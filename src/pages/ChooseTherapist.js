import React, { useEffect } from "react"
import { withRouter } from 'react-router-dom'
import TimeSelection from '../components/TimeSelection'
import ChooseTherapistSteps from '../components/ChooseTherapistSteps'
import TherapistSelection from '../config/TherapistSelectionContainer'
import Confirmation from '../config/ConfirmationContainer'
import Payment from '../config/PaymentContainer'

const ChooseTherapist = ({ bookingStage, changeBookingStage, resetBooking, services, theme, bookingValue, depositPayable, artists }) => {

  useEffect(() => {
    resetBooking()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <ChooseTherapistSteps activeStep={bookingStage}/>
      {bookingStage === 0 ? 
        <TherapistSelection 
          onSubmit={changeBookingStage} 
          services={services} 
          theme={theme}
          artists={artists}
          bookingValue={bookingValue}
          newBooking={true}/> 
          : null
      }
      {bookingStage === 1 ? <TimeSelection changeBookingStage={changeBookingStage} theme={theme}/> : null}
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

export default withRouter(ChooseTherapist)