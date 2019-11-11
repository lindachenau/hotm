import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ArtistCard from './ArtistCard'
import Container from '@material-ui/core/Container'
import MobileStepper from '@material-ui/core/MobileStepper'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
    marginTop: 10
  },
  grow: {
    flexGrow: 1,
  }
}))

export default function ArtistSelection ({changeBookingStage, availArtists, selectedArtist, changeSelectedArtist}) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(selectedArtist)
  const [maxSteps] = useState(availArtists.length)


  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSelect = () => {
    changeSelectedArtist(activeStep)
    changeBookingStage(2)
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      <ArtistCard
        avatar={ availArtists[activeStep].avatar} 
        name={ availArtists[activeStep].name} 
        skill={ availArtists[activeStep].skill }
        profile={ availArtists[activeStep].profile} 
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
      <div className={classes.flex}>
        <Button variant="text" color="primary" size='large' onClick={() => changeBookingStage(0)}>
          back
        </Button>
        <div className={classes.grow} />
        <Button variant="text" color="primary" size='large' onClick={handleSelect}>
          select this artist
        </Button>
      </div>
    </Container>
  )
}
