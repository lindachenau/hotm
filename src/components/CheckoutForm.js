import React, { useEffect, useState, useRef } from 'react'
import { FaMapMarkerAlt, FaPhoneSquare, FaDollarSign, FaUserCog } from "react-icons/fa"
import EmojiNatureIcon from '@material-ui/icons/EmojiNature'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { makeStyles } from '@material-ui/core/styles'
import { BOOKING_TYPE, PUT_OPERATION } from '../actions/bookingCreator'
import IconButton from '@material-ui/core/IconButton'
import CommentIcon from '@material-ui/icons/Comment'
import { FaFileInvoiceDollar, FaRegCreditCard } from "react-icons/fa"
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import EditIcon from '@material-ui/icons/Edit'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker
} from '@material-ui/pickers'
import moment from 'moment'
import { sendPaymentLink } from '../utils/misc'
import { payment_link_base, hblc_logo, booking_website } from '../config/dataLinks'
import CheckoutPaymentForm from '../components/CheckoutPaymentForm'
import { BOOKING_STATUS } from '../utils/dataFormatter'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    margin: 20
  },  
  grow: {
    flexGrow: 1
  },  
  textField : {
    width: "100%"
  },
  flex: {
    display: 'flex',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  },
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20
  }  
}))

function TherapistEventCard ({ event }) {
  const classes = useStyles()
  let itemKey = 0

  return (
    <Paper className={classes.paper} elevation={6}>
      <div>
        <FaMapMarkerAlt/><span>{ ` ${event.address}` }</span>
      </div>
      <div>
        <FaPhoneSquare/><span>{ ` ${event.contact} ` }</span>
        {event.organic ? <EmojiNatureIcon color='primary'/> : null}
      </div>
      <div>
        <br/>
        <FaDollarSign/>
        <span>{ ` ${event.paidAmount}/${event.total} `}</span>
        {event.complete ? <CheckCircleIcon color='primary'/> : null}
        <br/>
        <FaUserCog/>
        {event.serviceItems && 
        <ul>
          {event.serviceItems.map( item => <li key={itemKey++}>{ item }</li> )}
        </ul>}
      </div>
      <div>
        <CommentIcon/>
        <span>{ ` ${event.comment}`}</span>
      </div>
    </Paper>
  )
}

function AdminEventCard ({ event }) {
  const classes = useStyles()

  return (
    <Paper className={classes.paper} elevation={6}>
      <div>
        <FaMapMarkerAlt/><span>{ ` ${event.address}` }</span>
      </div>
      <div>
        <FaUserCog/><span>{ ` ${event.task}` }</span>
      </div>
      <div>
        <FaPhoneSquare/><span>{ ` ${event.contact}` }</span>
      </div>
      <div>
        <CommentIcon/>
        <span>{ ` ${event.comment}`}</span>
      </div>
    </Paper>
  )
}

export default function CheckoutForm({
  theme,
  event,
  triggerOpen,
  updateBooking,
  setBrowsing
}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [actualStart, setActualStart] = useState(null)
  const [actualEnd, setActualEnd] = useState(null)
  const [checkoutComment, setCheckoutComment] = useState('')
  const [checkedOut, setCheckedOut] = useState(false)
  const { adminBooking } = event
  const futureEvent = event.end ? event.end.getTime() > new Date().getTime() : false
  const [triggerCheckoutPaymentForm, setTriggerCheckoutPaymentForm] = useState(false)

  const classes = useStyles(theme)

  useEffect(() => {
    if (didMountRef.current) {
      setOpen(true)
      if (checkedOut) {
        setActualStart(event.actualStart)
        setActualEnd(event.actualEnd)
      } else {
        setActualStart(event.start)
        setActualEnd(event.end)
      }
      setCheckoutComment('')
    }
    else {
      didMountRef.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [triggerOpen])

  useEffect(() => {
    if (event.adminBooking)
      setCheckedOut(event.status === 'checkout' && event.actualStart && event.actualEnd)
    else 
      setCheckedOut((event.status === BOOKING_STATUS.COMPLETED || event.status === BOOKING_STATUS.CHECKEDOUT) && event.actualStart && event.actualEnd)
  }, [event])

  const handleCheckout = () => {
    const bookingData = {
      booking_id: event.id,
      event_id: event.eventId,
      operation: PUT_OPERATION.CHECKOUT,
      actual_start_time: moment(actualStart).format("HH:mm"),
      actual_end_time: moment(actualEnd).format("HH:mm"),
      comment: `${event.comment} ${checkoutComment}`
    }
    //Set BOOKING_TYPE to CHECKOUT to prevent adminBookings get automatically updated on bookingsData.data useEffect trigger in BookingStoreProvider
    updateBooking(bookingData, BOOKING_TYPE.C, () => alert('Checkout successful!'), true)  
    setOpen(false)
  }

  const handleCheckoutPay = () => {
    setOpen(false)
    setTriggerCheckoutPaymentForm(!triggerCheckoutPaymentForm)
  }

  const handleCheckoutLink = async () => {
    const bookingData = {
      booking_id: event.id,
      operation: PUT_OPERATION.CHECKOUT,
      actual_start_time: moment(actualStart).format("HH:mm"),
      actual_end_time: moment(actualEnd).format("HH:mm"),
      comment: `${event.comment} ${checkoutComment}`
    }

    const paymentLink = `${payment_link_base}?booking_type=client&booking_id=${event.id}&payment_type=balance`
    const content = `<a href=${booking_website}><img src=${hblc_logo} alt="HBLC logo"/></a>
    <h3>Thanks for booking with Hair Beauty Life Co. Please click the link below for payment.</h3>
    <a href=${paymentLink}>Pay the balance</a>`
        
    const status = await sendPaymentLink(event.client.email, content)
    //Set BOOKING_TYPE to CHECKOUT to prevent events get automatically updated on bookingsData.data useEffect trigger in BookingStoreProvider
    const message = status === 'success' ? 'Payment link sent & checkout successful!' : 'Payment link sent failure. Please send it again manually.' 
    updateBooking(bookingData, BOOKING_TYPE.T, () => alert(message), true)  
    setOpen(false)
  }

  const handleEdit = () => {
    setBrowsing(false)
  }

  return (
    <>
      <Dialog fullWidth open={open} onBackdropClick={() => setOpen(false)}>
        <div className={classes.container}>
          <div className={classes.grow} />
          <h3>{ `Booking ID: ${event.id}` }</h3>
          <div className={classes.grow} />
        </div>
        {adminBooking ? <AdminEventCard event={event}/> : <TherapistEventCard event={event}/>}
        <DialogContent>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
              fullWidth
              margin="normal"
              id="time-picker-start"
              label={checkedOut ? "Service started at" : "Select service start time"}
              disabled={checkedOut}
              value={actualStart}
              minutesStep={15}
              onChange={setActualStart}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <KeyboardTimePicker
              fullWidth
              margin="normal"
              id="time-picker-end"
              label={checkedOut ? "Service ended at" : "Select service end time"}
              disabled={checkedOut}
              value={actualEnd}
              minutesStep={15}
              onChange={setActualEnd}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </MuiPickersUtilsProvider>
          {!checkedOut &&
          <TextField
            id="comment"
            label="Checkout comment"
            placeholder="Checkout comment"
            defaultValue={checkoutComment}
            multiline
            className={classes.textField}
            margin="dense"
            variant="outlined"
            onChange={(event) => setCheckoutComment(event.target.value)}
          />}
        </DialogContent>
          <DialogActions className={classes.button}>
            {adminBooking ?
            <Button variant="contained" onClick={handleCheckout} color="secondary" fullWidth disabled={futureEvent || checkedOut}>
              Checkout
            </Button>
            :
            <>
              <Button 
                variant="text" 
                onClick={handleCheckoutPay} 
                disabled={futureEvent || checkedOut}
                color="primary"
                aria-label="checkout & pay"
                endIcon={<FaRegCreditCard />}
              >
                Checkout
              </Button>
              <div className={classes.grow} />
              <Button 
                variant="text" 
                onClick={handleCheckoutLink} 
                disabled={futureEvent || checkedOut}
                color="primary"
                aria-label="checkout & payment link"
                endIcon={<FaFileInvoiceDollar />}
              >
                Checkout
              </Button>
              <div className={classes.grow} />
              <IconButton 
                edge="start" 
                color="primary" 
                onClick={handleEdit} 
                disabled={(event.client === undefined ? true : false)  || checkedOut}
              >
                <EditIcon/>
              </IconButton>
            </>}
          </DialogActions>        
      </Dialog>
      <CheckoutPaymentForm
        event={event}
        triggerOpen={triggerCheckoutPaymentForm}
        actualStart={actualStart}
        actualEnd={actualEnd}
        comment={`${event.comment} ${checkoutComment}`}
        updateBooking={updateBooking}
      />
    </>
  )
}