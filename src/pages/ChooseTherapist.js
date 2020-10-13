import React, { useEffect, useState } from "react"
import { withRouter } from 'react-router-dom'
import TimeSelection from '../config/TimeSelectionContainer'
import ChooseTherapistSteps from '../components/ChooseTherapistSteps'
import TherapistSelection from '../config/TherapistSelectionContainer'
import Confirmation from '../config/ConfirmationContainer'
import Payment from '../config/PaymentContainer'

const ChooseTherapist = ({ bookingStage, changeBookingStage, resetBooking, services, theme, bookingValue, depositPayable, artists }) => {
  const [therapist, setTherapist] = useState(null)
  
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
          therapist={therapist}
          setTherapist={setTherapist}
          newBooking={true}/> 
          : null
      }
      {bookingStage === 1 ? 
      <TimeSelection 
        changeBookingStage={changeBookingStage} 
        calendarId={artists[therapist.id].email}
        services={services}
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
        depositPayable={depositPayable}/> 
        : null
      }
    </React.Fragment>
  )
}

export default withRouter(ChooseTherapist)