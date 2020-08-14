import React, { useState, useEffect, useContext }  from 'react'
import moment from 'moment'
import { FaUserAlt, FaMapMarkerAlt, FaPhoneSquare, FaDollarSign, FaUserCog } from "react-icons/fa"
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import MobileStepper from '@material-ui/core/MobileStepper'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import EmojiNatureIcon from '@material-ui/icons/EmojiNature'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CircularProgress from '@material-ui/core/CircularProgress'
import CommentIcon from '@material-ui/icons/Comment';
import { BookingsStoreContext } from './BookingsStoreProvider'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    marginBottom: 10
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    padding: 40
  }
}))

function Card ({ event }) {
  const classes = useStyles()
  let itemKey = 0

  return (
    <Paper className={classes.paper} elevation={6}>
      <Typography variant="h6" align="center" color="textPrimary">
        { moment(event.start).format("dddd, YYYY/MM/DD") }
      </Typography>
      <Typography variant="h6" align="center" color="textPrimary" gutterBottom>
        { `${moment(event.start).format('LT')} – ${moment(event.end).format('LT')}` }
      </Typography>
      <div>
        <FaMapMarkerAlt/><span>{ event.address }</span>
      </div>
      <div>
        <FaUserAlt/> 
        <span>{ `${event.client.name} ` }</span> 
        <FaPhoneSquare/>
        <span>{ `${event.client.phone} ` }</span>
        {event.organic ? <EmojiNatureIcon color='primary'/> : null}
      </div>
      <div>
        <br/>
        <FaDollarSign/>
        <span>{ `${event.depositPaid}/${event.total} `}</span>
        <FaUserCog/>
        <span>{ event.artists.map(artist => artist.name).join(', ')}</span>
        {event.complete ? <CheckCircleIcon color='primary'/> : null}
        <ul>
          {event.serviceItems.map( item => <li key={itemKey++}>{ item }</li> )}
        </ul>
      </div>
      <div>
        <CommentIcon/>
        <span>{event.comment}</span>
      </div>
    </Paper>
  )
}

const BookingCards = ({events, eventsFetched, activeStep, setActiveStep}) => {
  const classes = useStyles()
  const [maxSteps, setMaxSteps] = useState(0)
  
  useEffect(() => {
    setMaxSteps(events.length)
  }, [eventsFetched, events.length])

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <>
      {!eventsFetched && <div className={classes.progress}><CircularProgress color='primary' /></div>}
      {eventsFetched && 
      <>
        {events.length > 0 ?
        <>
          <Card event={events[activeStep]} />
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="text"
            activeStep={activeStep}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                Next event
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                Prev event
              </Button>
            }
          />

        </>
        :
        <Typography variant="h6" align="center" color="textPrimary">No booking found</Typography>}
      </>  
      }
    </>
  )
}

export default BookingCards