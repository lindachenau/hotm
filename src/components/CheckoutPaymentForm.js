import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import StripeForm from '../components/StripeForm'
import { stripe_charge_server } from '../config/dataLinks'
import { BOOKING_TYPE, PUT_OPERATION } from '../actions/bookingCreator'
import moment from 'moment'

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY

const useStyles = makeStyles(theme => ({
  title: {
    margin: 20
  },  
  button: {
    display: 'flex',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 20
  }
}))

export default function CheckoutPaymentForm({ 
  theme,
  event,
  triggerOpen,
  actualStart,
  actualEnd,
  comment,
  updateBooking
}) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const classes = useStyles(theme)
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    if (didMountRef.current) {
      setOpen(true)
    }
    else {
      didMountRef.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [triggerOpen])

  useEffect(() => {
    if (event && event.origBooking) 
      setAmount((event.origBooking.total_amount - event.origBooking.paid_amount).toFixed(2))
  }, [event])

  const submit = async (token) => {
    const charge = async (bookingId) => {
      const response = await fetch(stripe_charge_server, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: token.id,
          description: `${event.client.name}'s balance for booking ID: ${bookingId} on ${event.booking_date}`,
          amount: (amount * 100).toFixed(0)
        })
      })

      return response
    }

    const response = await charge(event.id)
    const {id, status} = await response.json()

    if (status === 'succeeded') {
      alert("Payment successful!")
      const bookingData = {
        booking_id: event.id,
        operation: PUT_OPERATION.CHECKOUT_PAYMENT,
        actual_start_time: moment(actualStart).format("HH:mm"),
        actual_end_time: moment(actualEnd).format("HH:mm"),
        comment: comment,
        payment_type: 'credit',
        payment_amount: amount,
        stripe_id: id
      }
      //Set BOOKING_TYPE to CHECKOUT to prevent events get automatically updated on bookingsData.data useEffect trigger in BookingStoreProvider
      updateBooking(bookingData, BOOKING_TYPE.T, null, true)
    } else {
      alert("The client's card was declined.")
    }

    setOpen(false)
  }

  const handleCash = () => {
    const bookingData = {
      booking_id: event.id,
      operation: PUT_OPERATION.CHECKOUT_PAYMENT,
      actual_start_time: moment(actualStart).format("HH:mm"),
      actual_end_time: moment(actualEnd).format("HH:mm"),
      comment: comment,
      payment_type: 'cash',
      payment_amount: amount
    }
    //Set BOOKING_TYPE to CHECKOUT to prevent events get automatically updated on bookingsData.data useEffect trigger in BookingStoreProvider
    updateBooking(bookingData, BOOKING_TYPE.T, () => alert('Checkout successful'), true)
    setOpen(false)
  }

  return (
    <>
      <Dialog fullWidth open={open} onBackdropClick={() => setOpen(false)}>
        <Typography className={classes.title} variant="h5" align="center" color="textPrimary">
          Collect Balance
        </Typography>
        <DialogContent>
          <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
            Balance payable: $ {amount.toString()}
          </Typography>
          <StripeForm stripePublicKey={stripePublicKey} handleCharge={submit} loggedIn={true} payMessage="Client's Credit Card"/>
          <Typography variant="body1" align="center" color="textPrimary" gutterBottom>
            OR
          </Typography>
        </DialogContent>
          <DialogActions className={classes.button}>
            <Button variant="contained" onClick={handleCash} color="secondary" fullWidth>
              Cash
            </Button>
          </DialogActions>        
      </Dialog>
    </>
  )
}