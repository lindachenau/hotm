import React, { useState, useEffect }  from 'react'
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
import CommentIcon from '@material-ui/icons/Comment'
import { BOOKING_TYPE } from '../actions/bookingCreator'

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

function EventCard ({ event }) {
  const classes = useStyles()
  let itemKey = 0

  return (
    <Paper className={classes.paper} elevation={6}>
      <Typography variant="h6" align="center" color="textPrimary">
        { moment(event.start).format("dddd, DD/MM/YYYY") }
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
        <span>{ `${event.paidAmount}/${event.total} `}</span>
        <FaUserCog/>
        <span>{ event.artists.map(artist => artist.name).join(', ')}</span>
        {event.complete ? <CheckCircleIcon color='primary'/> : null}
        <ul>
          {event.serviceItems.map( item => <li key={itemKey++}>{ item }</li> )}
        </ul>
      </div>
      <div>
        <CommentIcon/>
        <span>{ ` ${event.comment}`}</span>
      </div>
    </Paper>
  )
}

function AdminBookingCard ({ booking }) {
  const classes = useStyles()
  let itemKey = 0

  return (
    <Paper className={classes.paper} elevation={6}>
      <Typography variant="h6" align="center" color="textPrimary">
        { booking.title }
      </Typography>
      <div>
        <br/>
        <span>{`Contact: ${booking.contact}`}</span>
        <br/>
        <span>{`Total hours booked: ${booking.totalHours}`}</span>
        <br/>
        <ul>
          {booking.eventList.map(event => <li key={itemKey++}>{event}</li>)}
        </ul>
      </div>
    </Paper>
  )
}

const BookingCards = ({bookingType, events, eventsFetched, adminBookings, adminBookingsFetched, activeStep, setActiveStep}) => {
  const classes = useStyles()
  const [maxSteps, setMaxSteps] = useState(0)
  
  useEffect(() => {
    if (bookingType === BOOKING_TYPE.T)
      setMaxSteps(events.length)
    else
    setMaxSteps(adminBookings.length)
  }, [eventsFetched, events.length, adminBookingsFetched, adminBookings.length, bookingType])

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const artistBooking = eventsFetched && bookingType === BOOKING_TYPE.T
  const adminBooking = adminBookingsFetched && (bookingType === BOOKING_TYPE.C || bookingType === BOOKING_TYPE.P)

  return (
    <>
      {!eventsFetched && !adminBookingsFetched && <div className={classes.progress}><CircularProgress color='primary' /></div>}
      {(artistBooking || adminBooking) && 
      <>
        {(artistBooking && events.length === 0) || (adminBooking && adminBookings.length === 0) ?
        <Typography variant="h6" align="center" color="textPrimary">No booking found</Typography>
        :
        <>
          {bookingType === BOOKING_TYPE.T ? <EventCard event={events[activeStep]} /> : <AdminBookingCard booking={adminBookings[activeStep]} />}
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="text"
            activeStep={activeStep}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                Next booking
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                Prev booking
              </Button>
            }
          />
        </>}
      </>  
      }
    </>
  )
}

export default BookingCards