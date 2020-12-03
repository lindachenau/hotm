import React, { useState, useEffect, useRef, useContext } from "react"
import { Redirect, withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import BookingCards from '../components/BookingCards'
import { FaFileInvoiceDollar } from "react-icons/fa"
import EditIcon from '@material-ui/icons/Edit'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import PaymentRequestForm from '../components/PaymentRequestForm'
import CancelBookingForm from '../config/CancelBookingFormContainer'
import { BOOKING_TYPE } from '../actions/bookingCreator'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'
import { BOOKING_STATUS } from '../utils/dataFormatter'

const useStyles = makeStyles(theme => ({
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
}))

const Manage = ({ events, eventsFetched, adminBookings, adminBookingsFetched, bookingType, prevActiveStep, setPrevActiveStep}) => {
  const { bookingsData } = useContext(BookingsStoreContext)
  const { bookingInProgress } = bookingsData
  // bookingType = bookingFilter.bookingType.name
  const [activeStep, setActiveStep] = useState(prevActiveStep)
  const didMountRef = useRef(false)
  const classes = useStyles()
  const [completed, setCompleted] = useState(false)
  const [triggerPaymentRequestForm, setTriggerPaymentRequestForm] = useState(false)
  const [triggerCancelBookingForm, setTriggerCancelBookingForm] = useState(false)
  const [browsing, setBrowsing] = useState(true)
  const [location, setLocation] = useState({})
  const pathnames = {
    corporate: '/corporate-booking',
    package: '/package-booking',
    therapist:'/therapist-booking'
  }

  // disable EDIT, PAYMENT LINK and DELETE for completed bookings
  useEffect(() => {
    if (bookingType === BOOKING_TYPE.T && events.length > 0)
      setCompleted(events[activeStep].status === BOOKING_STATUS.COMPLETED || events[activeStep].status === BOOKING_STATUS.DELETED)

    if (bookingType !== BOOKING_TYPE.T && adminBookings.length > 0)
      setCompleted(adminBookings[activeStep].status === BOOKING_STATUS.COMPLETED || adminBookings[activeStep].status === BOOKING_STATUS.DELETED)
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [activeStep, adminBookings, events])

  useEffect(() => {
    // Don't reset on mount
    if (didMountRef.current)
      setActiveStep(0)
    else
      didMountRef.current = true
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [eventsFetched, adminBookingsFetched])

  const handleEdit = () => {
    setPrevActiveStep(activeStep)
    setLocation({
      pathname: pathnames[bookingType],
      state: {edit : true}
    })
    setBrowsing(false)
  }

  const handlePayment = () => {
    setTriggerPaymentRequestForm(!triggerPaymentRequestForm)
  }

  const handleDelete = () => {
    setTriggerCancelBookingForm(!triggerCancelBookingForm)
  }

  return (
    <>
      {browsing ?
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
        {bookingInProgress ?
        <div className={classes.progress}>
          <CircularProgress color='primary' />
        </div>
        :
        <div className={classes.flex}>
          <IconButton edge="start" color="primary" onClick={handleEdit} disabled={completed}>
            <EditIcon/>
          </IconButton>
          <div className={classes.grow} />
          <IconButton edge="start" color="primary" onClick={handlePayment} disabled={completed}>
            <FaFileInvoiceDollar/>
          </IconButton>
          <div className={classes.grow} />
          <IconButton edge="start" color="primary" onClick={handleDelete} disabled={completed}>
            <DeleteForeverIcon/>
          </IconButton>           
        </div>}
        <PaymentRequestForm 
          triggerOpen={triggerPaymentRequestForm}
          initOpen={false}
          bookingType={bookingType}
          adminBooking={adminBookings[activeStep]}
          clientBooking={events[activeStep]}
        />
        <CancelBookingForm 
          triggerOpen={triggerCancelBookingForm}
          initOpen={false}
          bookingType={bookingType}
          adminBooking={adminBookings[activeStep]}
          clientBooking={events[activeStep]}
        />
      </Container>
      :
      <Redirect to={location} />}
    </>  
  )
}

export default withRouter(Manage)
