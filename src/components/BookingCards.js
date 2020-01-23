import React, { useState, useEffect, useContext }  from 'react'
import moment from 'moment'
import { FaUserAlt, FaMapMarkerAlt, FaPhoneSquare, FaDollarSign, FaUserCog } from "react-icons/fa"
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import MobileStepper from '@material-ui/core/MobileStepper'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import EmojiNatureIcon from '@material-ui/icons/EmojiNature'
import CircularProgress from '@material-ui/core/CircularProgress'
import { BookingsStoreContext } from './BookingsStoreProvider'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    marginBottom: 10
  },
  flex: {
    display: 'flex',
    marginTop: 10
  },
  grow: {
    flexGrow: 1,
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    padding: 40
  }
}));

function Card ({ event }) {
  const classes = useStyles()
  let itemKey = 0

  return (
    <Paper className={classes.paper} elevation={6}>
      <Typography variant="h6" align="center" color="textPrimary">
        { moment(event.start).format("dddd, YYYY/MM/DD") }
      </Typography>
      <Typography variant="h6" align="center" color="textPrimary" gutterBottom>
        { moment(event.start).format('LT') + ' – ' + moment(event.end).format('LT')}
      </Typography>
      <div>
        <FaMapMarkerAlt/><span>{ event.address }</span>
      </div>
      <div>
        <FaUserAlt/> 
        <span>{ event.client.name + ' ' }</span> 
        <FaPhoneSquare/>
        <span>{ event.client.phone + ' ' }</span>
        {event.organic ? <EmojiNatureIcon color='primary'/> : null}
      </div>
      <div>
        <br/>
        <FaDollarSign/>
        <span>{ event.total + ' '}</span>
        <FaUserCog/>
        <span>{ event.artists.map(artist => artist.name).join(', ')}</span>
        <ul>
          {event.serviceItems.map( item => <li key={itemKey++}>{ item }</li> )}
        </ul>
      </div>
    </Paper>
  )
}


const BookingCards = ({events, eventsFetched, changeBookingStage, setManageState, loadBooking, saveBooking, activeStep, setActiveStep}) => {
  const classes = useStyles()
  const { bookingsData } = useContext(BookingsStoreContext)
  const bookings = bookingsData.data
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

  const handleEdit = () => {
    loadBooking({...bookings[events[activeStep].id], client: events[activeStep].client})
    changeBookingStage(0)
    setManageState('Edit')
  }

  const handleCheckout = () => {
    const bookingId = events[activeStep].id
    const booking = bookings[bookingId]
    loadBooking({...booking, client: events[activeStep].client})
    saveBooking({...booking, paid_type: 'balance', paid_amount: (booking.total_amount - booking.paid_amount)})
    changeBookingStage(2)
    setManageState('Checkout')
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
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
          <div className={classes.flex}>
            <Button variant="text" color="primary" size='large' onClick={handleEdit}>
              Edit
            </Button>
            <div className={classes.grow} />
            <Button variant="text" color="primary" size='large' onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        </>
        :
        <Typography variant="h6" align="center" color="textPrimary">No booking found</Typography>}
      </>  
      }
    </Container>
  )
}

export default BookingCards