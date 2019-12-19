import React from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'


function getSteps() {
  return ['Select service', 'Select an artist', 'Confirm booking', 'Pay deposit']
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Select service items, time and location to find available artists'
    case 1:
      return 'Select an artist for your booking'
    case 2:
      return 'Confirm your booking details'
    case 3:
      return 'Pay the deposit to secure your booking'
    default:
      return 'Unknown stepIndex'
  }
}

export default function BookingSteps(props) {
  const steps = getSteps()
  const { activeStep } = props

  return (
    <Container maxWidth="md" style={{paddingTop: 20}}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography variant='h6' align='center' gutterBottom>{getStepContent(activeStep)}</Typography>
    </Container>
  )
}