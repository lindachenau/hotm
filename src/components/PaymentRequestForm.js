import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import { BOOKING_TYPE } from '../actions/bookingCreator'
import { sendPaymentLink, setCancellationTimer } from '../utils/misc'
import { payment_link_base } from '../config/dataLinks'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    margin: 20
  },
  title: {
    margin: 20
  },  
  textField : {
    width: "100%"
  },
  check: {
    display: 'flex',
    marginTop: 20,
    alignItems: 'flex-start',
    marginLeft: 0
  },
  inline: {
    display: 'inline',
    paddingTop: 0
  },
  button: {
    display: 'flex',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  }
}))

export default function PaymentRequestForm({ theme, triggerOpen, initOpen, bookingType, adminBooking, clientBooking }) {
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)
  const [paymentType, setPaymentType] = useState('deposit')
  const [percentage, setPercentage] = useState(30)
  const [autoCancel, setAutoCancel] = useState(false)
  const [email, setEmail] = useState(null)
  const [bookingId, setBookingId] = useState(null)

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
    if (bookingType === BOOKING_TYPE.C) {
      setEmail(adminBooking ? adminBooking.email : null)
      setBookingId(adminBooking ? adminBooking.id : null)
    } else {
      setEmail(clientBooking ? clientBooking.client.email : null)
      setBookingId(clientBooking ? clientBooking.id : null)
    }
  }, [bookingType, adminBooking, clientBooking])

  const handleSend = () => {
    let paymentLink
    if (bookingType === BOOKING_TYPE.T)
      paymentLink = `${payment_link_base}?booking_type=client&booking_id=${clientBooking.id}&payment_type=${paymentType}&percentage=${percentage}`
    else
      paymentLink = `${payment_link_base}?booking_type=admin&booking_id=${adminBooking.id}&payment_type=${paymentType}&percentage=${percentage}`
    
    if (autoCancel) {
      sendPaymentLink(email, paymentLink, `Pay the ${paymentType}`, true)
      setCancellationTimer(bookingType, bookingId)
    } else {
      sendPaymentLink(email, paymentLink, `Pay the ${paymentType}`)
    }

    setOpen(false)
  }

  return (
    <>
      <Dialog fullWidth open={open} onBackdropClick={() => setOpen(false)}>
        <Typography className={classes.title} variant="h5" align="center" color="textPrimary">
          Payment Request
        </Typography>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="payment-type" 
              name="payment-type" 
              value={paymentType} 
              onChange={(event) => setPaymentType(event.target.value)}
            >
              <FormControlLabel value="balance" control={<Radio color="primary"/>} label="Balance" />
              <FormControlLabel value="deposit" control={<Radio color="primary"/>} label="Deposit" />
            </RadioGroup>
          </FormControl>
          <TextField
            id="percentage"
            label="Deposit percentage"
            type="number"
            defaultValue={percentage}
            margin="dense"              
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => setPercentage(event.target.value)}
          />
          {paymentType === 'deposit' && <div className={classes.check}>
            <Checkbox checked={autoCancel} onChange={() => setAutoCancel(!autoCancel)} value="autoCancel" className={classes.inline} color="primary"/>
            <Typography variant="body2" align="left" color="textPrimary">
              Cancel this booking automatically if deposit is not paid within 12 hours.
            </Typography>
          </div>}
          <TextField
            id='email'
            defaultValue={email}
            required
            margin="dense"
            label="email address"
            type="text"
            fullWidth
            onChange={(event) => setEmail(event.target.value)}
          />
        </DialogContent>
          <DialogActions className={classes.button}>
            <Button variant="contained" onClick={handleSend} color="secondary" fullWidth>
              Send
            </Button>
          </DialogActions>        
      </Dialog>
    </>
  )
}