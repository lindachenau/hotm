import React, { useState } from 'react';
import ArtistCard from './ArtistCard'
import Container from '@material-ui/core/Container'
import MobileStepper from '@material-ui/core/MobileStepper'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'


export default function ArtistSelection (props) {

  const [activeStep, setActiveStep] = useState(0)
  const [maxSteps] = useState(Math.ceil(Math.random() * 5))
  const [artistArr] = useState(Object.values(props.artists).slice(maxSteps))
  const [idArr] = useState(Object.keys(props.artists).slice(maxSteps))


  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSelect = event => {
    props.onSelect(2)
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 50}}>
      <ArtistCard
        avatar={ artistArr[activeStep].avatar} 
        name={ artistArr[activeStep].name} 
        skill={ artistArr[activeStep].skill }
        profile={ artistArr[activeStep].profile} 
      />
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next artist
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Prev artist
          </Button>
        }
      />
      <Button variant="text" color="primary" size='large' onClick={handleSelect}>
        select this artist
      </Button>
    </Container>
  )
}
