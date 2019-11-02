import React from 'react';
import ArtistCard from './ArtistCard'
import Container from '@material-ui/core/Container'
import MobileStepper from '@material-ui/core/MobileStepper'
import { getArtists } from '../utils/fakeload'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'

const artists = Object.values(getArtists(3))

export default function ArtistSelection (props) {

  const [activeStep, setActiveStep] = React.useState(0)
  const maxSteps = artists.length

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
        avatar={ artists[activeStep].avatar} 
        name={ artists[activeStep].name} 
        skill={ artists[activeStep].skill }
        profile={ artists[activeStep].profile} 
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
