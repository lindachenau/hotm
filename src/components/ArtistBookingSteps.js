import React from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'


function getSteps(newBooking) {
  if (newBooking)
    return ['Select service', 'Add people', 'Payment']
  else
    return ['Select service', 'Change artist', 'Update']
}

function getStepContent(stepIndex, newBooking) {
  switch (stepIndex) {
    case 0:
      return 'Select service items, time and location'
    case 1:
      return newBooking ? 'Add artists and client to the booking' : "Change artists for the booking"
    case 2:
      return newBooking ? 'Pay deposit' : 'Update changes to the system'
    default:
      return 'Unknown stepIndex'
  }
}

export default function ArtistBookingSteps(props) {
  const { activeStep, newBooking } = props
  const steps = getSteps(newBooking)

  return (
    <Container maxWidth="md" style={{paddingTop: 20}}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant='h6' align='center' gutterBottom>{getStepContent(activeStep, newBooking)}</Typography>
    </Container>
  )
}