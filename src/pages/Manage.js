import React, { useState, useEffect, useContext } from "react"
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import BookingCards from '../components/BookingCards'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'
import ArtistBooking from '../pages/ArtistBooking'

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
    marginTop: 10
  },
  grow: {
    flexGrow: 1,
  }
}))

const Manage = ({
  events, 
  eventsFetched,
  loadBooking, 
  saveBooking, 
  services, 
  bookingValue, 
  depositPayable, 
  artists}) => {
  const [activeStep, setActiveStep] = useState(0)
  const classes = useStyles()
  const [completed, setCompleted] = useState(false)
  const { bookingsData } = useContext(BookingsStoreContext)
  const bookings = bookingsData.data

  // disable EDIT and CHECKOUT for completed bookings
  useEffect(() => {
    if (events.length > 0)
      setCompleted(events[activeStep].complete)
  }, [events, activeStep])

  const handleEdit = () => {
    loadBooking({...bookings[events[activeStep].id], client: events[activeStep].client})
  }

  const handleCheckout = () => {
    const bookingId = events[activeStep].id
    const booking = bookings[bookingId]
    loadBooking({...booking, client: events[activeStep].client})
    saveBooking({...booking, payment_type: 'checkout_credit', payment_amount: (booking.total_amount - booking.paid_deposit_total)})
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      <BookingCards 
        events={events} 
        eventsFetched={eventsFetched} 
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
      <div className={classes.flex}>
        <Button variant="text" color="primary" size='large' onClick={handleEdit} disabled={completed}>
          Edit
        </Button>
        <div className={classes.grow} />
        <Button variant="text" color="primary" size='large' onClick={handleCheckout} disabled={completed}>
          Payment Link
        </Button>
        <div className={classes.grow} />
        <Button variant="text" color="primary" size='large' onClick={handleCheckout} disabled={completed}>
          Delete
        </Button>            
      </div>            
    </Container>    
  )
}

export default withRouter(Manage)
