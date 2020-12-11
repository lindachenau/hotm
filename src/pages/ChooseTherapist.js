import React, { useEffect, useState } from "react"
import { withRouter } from 'react-router-dom'
import TimeSelection from '../config/TimeSelectionContainer'
import ChooseTherapistSteps from '../components/ChooseTherapistSteps'
import TherapistSelection from '../config/TherapistSelectionContainer'
import Confirmation from '../config/ConfirmationContainer'
import Payment from '../config/PaymentContainer'

const ChooseTherapist = ({ location, bookingStage, changeBookingStage, resetBooking, services, theme, bookingValue, depositPayable, artists, triggerSignin, setTriggerSignin }) => {
  const [therapist, setTherapist] = useState(null)
  const [travelTime , setTravelTime] = useState(30)
  
  useEffect(() => {
    resetBooking()
    if (location && location.therapist)
      setTherapist(location.therapist)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (therapist)
      resetBooking()
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [therapist])
  
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
          therapist={therapist}
          setTherapist={setTherapist}
          setTravelTime={setTravelTime}
          newBooking={true}/> 
          : null
      }
      {bookingStage === 1 ? 
      <TimeSelection 
        changeBookingStage={changeBookingStage} 
        calendarId={therapist? therapist.email : null}
        offDays={therapist? therapist.offDays : []}
        services={services}
        travelTime={travelTime}
        theme={theme}/> 
        : null
      }
      {bookingStage === 2 ? 
        <Confirmation 
          changeBookingStage={changeBookingStage} 
          theme={theme} 
          items={services.items} 
          bookingValue={bookingValue}
          artists={artists}
          chooseTherapist={true}
          therapistId={therapist.id}/> 
        : null
      }
      {bookingStage === 3 ? <Payment 
        changeBookingStage={changeBookingStage} 
        theme={theme}
        chooseTherapist={true}
        therapist={therapist}
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

export default withRouter(ChooseTherapist)