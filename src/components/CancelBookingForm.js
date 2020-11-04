import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { BOOKING_TYPE, PUT_OPERATION } from '../actions/bookingCreator'
import { stripe_refund_server } from '../config/dataLinks'

const useStyles = makeStyles(theme => ({
  title: {
    margin: 20
  },  
  button: {
    display: 'flex',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  }
}))

export default function CancelBookingForm({ theme, triggerOpen, initOpen, bookingType, adminBooking, artistBooking, updateBooking }) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [bookingId, setBookingId] = useState(null)
  const [chargeId, setChargeId] = useState(null)
  const [deposit, setDeposit] = useState(0)

  const classes = useStyles(theme)

  useEffect(() => {
    if (didMountRef.current) {
      setOpen(true)
    }
    else {
      didMountRef.current = true
      setOpen(initOpen)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [triggerOpen, initOpen])

  useEffect(() => {
    const booking = bookingType === BOOKING_TYPE.C ? adminBooking : artistBooking
    if (booking) {
      setBookingId(booking.id)
      setChargeId(booking.stripeId)
      setDeposit(booking.paidAmount)
    }
  }, [bookingType, adminBooking, artistBooking])

  const handleConfirm = async() => {
    const refund = async(chargeId) => {
      const response = await fetch(stripe_refund_server, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: chargeId
        })
      })

      return response
    }

    const response = await refund(chargeId)
    const {id, status, errorMessage} = await response.json()

    if (status === 'succeeded') {
      alert(`Deposit $${deposit} was refunded successfully!`)

      const bookingData = {
        booking_id: bookingId,
        operation: PUT_OPERATION.PAYMENT,
        payment_type: 'credit',
        payment_amount: -deposit,
        stripe_id: id
      }
      //Set BOOKING_TYPE to CHECKOUT to prevent events get automatically updated on bookingsData.data useEffect trigger in BookingStoreProvider
      updateBooking(bookingData, bookingType === BOOKING_TYPE.C ? BOOKING_TYPE.C : BOOKING_TYPE.T, null, true)
    } else {
      alert(errorMessage)
    }
    
    setOpen(false)
  }

  return (
    <>
      <Dialog fullWidth open={open} onBackdropClick={() => setOpen(false)}>
        <Typography className={classes.title} variant="h5" align="center" color="textPrimary">
          Booking Cancellation
        </Typography>
        <DialogContent>
          <Typography className={classes.title} variant="h6" align="left" color="textPrimary">
            {`Cancel booking ID: ${bookingId} and refund the deposit if any?`}
          </Typography>
        </DialogContent>
          <DialogActions className={classes.button}>
            <Button variant="contained" onClick={handleConfirm} color="secondary" fullWidth>
              Confirm
            </Button>
          </DialogActions>        
      </Dialog>
    </>
  )
}