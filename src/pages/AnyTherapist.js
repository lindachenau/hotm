import React, { useEffect } from "react"
import { withRouter } from 'react-router-dom'
import PickTherapist from '../config/PickTherapistContainer'
import AnyTherapistSteps from '../components/AnyTherapistSteps'
import ServiceSelection from '../config/ServiceSelectionContainer'
import Confirmation from '../config/ConfirmationContainer'
import Payment from '../config/PaymentContainer'

const AnyTherapist = ({ bookingStage, changeBookingStage, resetBooking, services, theme, bookingValue, depositPayable, artists, triggerSignin, setTriggerSignin }) => {

  useEffect(() => {
    resetBooking()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <AnyTherapistSteps activeStep={bookingStage}/>
      {bookingStage === 0 ? 
        <ServiceSelection 
          onSubmit={changeBookingStage} 
          services={services} 
          theme={theme} 
          bookingValue={bookingValue}
          newBooking={true}/> 
          : null
      }
      {bookingStage === 1 ? <PickTherapist changeBookingStage={changeBookingStage} theme={theme}/> : null}
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
        depositPayable={depositPayable}
        triggerSignin={triggerSignin}
        setTriggerSignin={setTriggerSignin}/> 
        : null
      }
    </React.Fragment>
  )
}

export default withRouter(AnyTherapist)
