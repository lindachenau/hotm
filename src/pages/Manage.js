import React, { useState, useEffect, useRef } from "react"
import { Redirect, withRouter } from 'react-router-dom'
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

const Manage = ({ events, eventsFetched, adminBookings, adminBookingsFetched, bookingsData, bookingType, prevActiveStep, setPrevActiveStep}) => {
  // bookingType = bookingFilter.bookingType.name
  const [activeStep, setActiveStep] = useState(prevActiveStep)
  const didMountRef = useRef(false)
  const classes = useStyles()
  const [completed, setCompleted] = useState(false)
  const [browsing, setBrowsing] = useState(true)
  const bookings = bookingsData ? bookingsData.data : null
  const [location, setLocation] = useState({})
  const pathnames = {
    corporate: '/corporate',
    package: '/package',
    artist:'/artist'
  }

  // disable EDIT and CHECKOUT for completed bookings
  // useEffect(() => {
  //   if (events.length > 0)
  //     setCompleted(events[activeStep].complete)
  // }, [events, activeStep])

  const handleView = () => {
    setPrevActiveStep(activeStep)
    setLocation({
      pathname: pathnames[bookingType],
      state: {view : true}
    })
    setBrowsing(false)
  }

  const handleEdit = () => {
    setPrevActiveStep(activeStep)
    setLocation({
      pathname: pathnames[bookingType],
      state: {edit : true}
    })
    setBrowsing(false)
  }

  const handlePayment = () => {}

  const handleDelete = () => {}

  useEffect(() => {
    // Don't reset on mount
    if (didMountRef.current)
      setActiveStep(0)
    else
      didMountRef.current = true
  }, [eventsFetched, adminBookingsFetched])

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
        <div className={classes.flex}>
          {bookingType !== BOOKING_TYPE.A && 
          <IconButton edge="start" color="primary" onClick={handleView}>
            <DescriptionIcon/>
          </IconButton>}
          <div className={classes.grow} />
          <IconButton edge="start" color="primary" onClick={handleEdit}>
            <EditIcon/>
          </IconButton>
          <div className={classes.grow} />
          <IconButton edge="start" color="primary" onClick={handlePayment}>
            <PaymentIcon/>
          </IconButton>
          <div className={classes.grow} />
          <IconButton edge="start" color="primary" onClick={handleDelete}>
            <DeleteForeverIcon/>
          </IconButton>           
        </div>            
      </Container>
      :
      <Redirect to={location} />}
    </>  
  )
}

export default withRouter(Manage)
