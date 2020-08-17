import React, { useState, useEffect, useContext } from "react"
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import BookingCards from '../components/BookingCards'
import DescriptionIcon from '@material-ui/icons/Description'
import PaymentIcon from '@material-ui/icons/Payment'
import EditIcon from '@material-ui/icons/Edit'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { BOOKING_TYPE } from '../actions/bookingCreator'

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
    marginTop: 10
  },
  grow: {
    flexGrow: 1,
  }
}))

const Manage = ({ events, eventsFetched, adminBookings, adminBookingsFetched, loadBooking, saveBooking, bookingsData, bookingType}) => {
  // bookingType = bookingFilter.bookingType.name
  const [activeStep, setActiveStep] = useState(0)
  const classes = useStyles()
  const [completed, setCompleted] = useState(false)
  const bookings = bookingsData ? bookingsData.data : null

  // disable EDIT and CHECKOUT for completed bookings
  // useEffect(() => {
  //   if (events.length > 0)
  //     setCompleted(events[activeStep].complete)
  // }, [events, activeStep])

  // const handleEdit = () => {
  //   loadBooking({...bookings[events[activeStep].id], client: events[activeStep].client})
  // }

  // const handleCheckout = () => {
  //   const bookingId = events[activeStep].id
  //   const booking = bookings[bookingId]
  //   loadBooking({...booking, client: events[activeStep].client})
  //   saveBooking({...booking, payment_type: 'checkout_credit', payment_amount: (booking.total_amount - booking.paid_deposit_total)})
  // }

  useEffect(() => {
    setActiveStep(0)
  }, [bookingType])

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      <BookingCards
        bookingType={bookingType}
        adminBookings={adminBookings}
        adminBookingsFetched={adminBookingsFetched}
        events={events} 
        eventsFetched={eventsFetched} 
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
      <div className={classes.flex}>
        {bookingType !== BOOKING_TYPE.A && 
        <IconButton edge="start" color="primary">
          <DescriptionIcon/>
        </IconButton>}
        <div className={classes.grow} />
        <IconButton edge="start" color="primary">
          <EditIcon/>
        </IconButton>
        <div className={classes.grow} />
        <IconButton edge="start" color="primary">
          <PaymentIcon/>
        </IconButton>
        <div className={classes.grow} />
        <IconButton edge="start" color="primary">
          <DeleteForeverIcon/>
        </IconButton>           
      </div>            
    </Container>    
  )
}

export default withRouter(Manage)
