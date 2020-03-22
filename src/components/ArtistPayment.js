import React, { useState, useContext } from 'react'
import StripeForm from './StripeForm'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { BookingsStoreContext } from './BookingsStoreProvider'
import CircularProgress from '@material-ui/core/CircularProgress'

import { stripe_charge_server } from '../config/dataLinks'
import sendReminder from '../reducers/bookingInfo'

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    width: '100%',
    overflowX: 'auto'
  },
  title : {
    marginBottom: 30
  },
  textField : {
    width: "100%",
    marginTop: 30
  },
  flex: {
    display: 'flex',
    marginTop: 10
  },
  container: {
    display: 'flex'
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

function ArtistPayment({
  theme, 
  changeBookingStage, 
  depositPayable, 
  resetBooking, 
  addBooking, 
  updateBooking,
  cancelBooking,
  bookingData, 
  newBooking,
  manageState,
  setManageState,
  comment,
  clientName,
  userEmail, 
  userName,
  bookingDate
  }) {
  const { bookingsData } = useContext(BookingsStoreContext)
  const { bookingInProgress } = bookingsData
  const [value, setValue] = useState(comment)

  const classes = useStyles()

  const handleChange = event => {
    setValue(event.target.value);
  }

  const clientEmail = "lenaqunying@outlook.com" //This is temporary. Currently it's not possible to get user email without user login.
  const updatedBookingData = {
    ...bookingData, 
    booking_artist_name: userName,
    booking_artist_email: userEmail,
    client_name: clientName,
    client_email: clientEmail
  }

  const submit = async (token) => {
    const charge = async (bookingId) => {
      const response = await fetch(stripe_charge_server, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: token.id,
          description: `${clientName}'s ${newBooking ? "deposit" : "balance"} for booking on ${bookingData.booking_date} 
          by ${userName}`,
          amount: (bookingData.payment_amount * 100).toFixed(0)
        })
      });

      if (response.ok) {
        const message = newBooking ? "Booking successful!" : "Checkout successful!"
        alert(message)
        if (newBooking) sendReminder(clientEmail, bookingDate)
        resetBooking()
      }
      else {
        alert("Your card was declined.")
        const payload = { 'booking_id': bookingId }
        cancelBooking(payload)
      }
    }

    if (newBooking) {
      addBooking({...updatedBookingData, comment: value}, charge)
    }
    else {
      updateBooking({...updatedBookingData, comment: value}, charge)
      setManageState('Default')
    }
  }

  const handleUpdate = () => {
    updateBooking({...updatedBookingData, payment_amount: 0, payment_type: "nil", comment: value}, () => alert("Update successful!"))
    setManageState('Default')
  }

  const handleCashPay = () => {
    updateBooking({...updatedBookingData, payment_type: "checkout_cash", comment: value}, () => alert("Checkout successful!"))
    setManageState('Default')
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      {bookingInProgress && <div className={classes.progress}><CircularProgress color='primary' /></div>}
      <Paper className={classes.paper}>
        {manageState !== 'Edit' &&
          <>
            {newBooking ?
              null
              :
              <Typography variant="h5" align="center" color="textPrimary" className={classes.title}>
              Checkout
              </Typography>
            }
            <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
              {newBooking ? `Deposit payable: $${depositPayable}` : `Balance payable: $${bookingData.payment_amount.toFixed(2)}`}
            </Typography>
            <StripeForm stripePublicKey={stripePublicKey} handleCharge={submit} loggedIn={true} payMessage="Client Pay"/>
            {!newBooking &&
              <>
                <div className={classes.container}>
                  <div className={classes.grow} />
                  <p>OR</p>
                  <div className={classes.grow} />
                </div>
                <Button variant="contained" onClick={handleCashPay} color="primary" fullWidth>
                  Cash Pay
                </Button>
              </>
            }
          </>
        }
        <TextField
          id="outlined-textarea"
          label="Additional instructions"
          placeholder="Any allergies, preferences, entrances,
          or any details about the room number if the client is
          staying in a hotel."
          multiline
          value={value}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={handleChange}
        />
      </Paper>
      <div className={classes.flex}>
        {manageState === 'Checkout' ?
          <Button variant="text" color="primary" size='large' onClick={() => setManageState('Default')}>
            Cancel
          </Button>
          :
          <Button variant="text" color="primary" size='large' onClick={() => changeBookingStage(1)}>
            back
          </Button>}
        <div className={classes.grow} />
        {!newBooking && manageState !== 'Checkout' &&
        <Button variant="text" color="primary" size='large' onClick={handleUpdate}>
          Update Booking
        </Button>}
      </div>
    </Container>
  )
}

export default ArtistPayment