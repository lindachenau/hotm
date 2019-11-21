import React, { useState, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ArtistCard from './ArtistCard'
import Container from '@material-ui/core/Container'
import MobileStepper from '@material-ui/core/MobileStepper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import { BookingsStoreContext } from '../config/BookingsStoreProvider'
import moment from 'moment'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: 'sm',
    paddingTop: 20, 
    paddingBottom: 20
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    padding: 40
  },
  flex: {
    display: 'flex',
    marginTop: 10
  },
  grow: {
    flexGrow: 1,
  }
}))

export default function ArtistSelection ({theme, changeBookingStage, availArtists, selectedArtist, changeSelectedArtist, bookingDateAddr}) {
  const { artists, artistsFetched } = useContext(BookingsStoreContext)
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(selectedArtist)
  const [maxSteps, setMaxSteps] = useState(0)
  const { ids, isLoading, hasErr } = availArtists
  let artistsFound = !isLoading && ids.length > 0
  let noArtists = !isLoading && !hasErr && ids.length == 0

  useEffect(() => {
    setMaxSteps(ids.length)
  }, [isLoading])

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
    <Container className={classes.container}>
      {artistsFound &&
      <React.Fragment>
        <ArtistCard
          avatar={artists[ids[activeStep]].avatar} 
          name={artists[ids[activeStep]].name} 
          skill={artists[ids[activeStep]].skill }
          profile={artists[ids[activeStep]].profile} 
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
      </React.Fragment>}
      {isLoading && <div className={classes.progress}><CircularProgress color='primary' /></div>}
      {hasErr &&
      <Typography variant="body1" align="center" color="textPrimary">
        Fetching error
      </Typography>}
      {noArtists &&
      <Typography variant="body1" align="center" color="textPrimary">
        Sorry, no artists are available
      </Typography>}
      <div className={classes.flex}>
        <Button variant="text" color="primary" size='large' onClick={() => changeBookingStage(0)}>
          back
        </Button>
        <div className={classes.grow} />
        <Button variant="text" color="primary" size='large' onClick={handleSelect} disabled={!artistsFound}>
          select this artist
        </Button>
      </div>
    </Container>
  )
}
