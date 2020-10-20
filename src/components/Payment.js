import React, { useState, useContext } from 'react'
import StripeForm from './StripeForm'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import SigninForm from '../config/SigninFormContainer'
import { BookingsStoreContext } from './BookingsStoreProvider'
import CircularProgress from '@material-ui/core/CircularProgress'
import moment from 'moment'
import { stripe_charge_server } from '../config/dataLinks'
// import sendReminder from '../reducers/bookingInfo'
import { BOOKING_TYPE } from '../actions/bookingCreator'

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    width: '100%',
    overflowX: 'auto'
  },
  textField : {
    width: "100%"
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    padding: 40
  }
}))

function Payment (
  { theme,
    chooseTherapist=false,
    therapist,
    itemQty,
    bookingDateAddr,
    changeBookingStage, 
    depositPayable, 
    resetBooking, 
    addBooking,
    cancelBooking,
    bookingInfo, 
    loggedIn, 
    priceFactors, 
    bookingValue, 
    userId, 
    userName,
    clientEmail
  }) {
  const { bookingsData } = useContext(BookingsStoreContext)
  const { bookingInProgress } = bookingsData
  const [value, setValue] = useState('');

  const classes = useStyles()

  const handleChange = event => {
    setValue(event.target.value);
  }

  const submit = async (token) => {
    let bookingData = {}
    let bookingDate
    const charge = async (bookingId) => {
      const response = await fetch(stripe_charge_server, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: token.id,
          description: `${userName}'s deposit for booking on ${bookingDate}`,
          amount: (depositPayable * 100).toFixed(0)
        })
      })

      const {id, status} = await response.json()
      
      if (status === 'succeeded') {
        alert("Booking successful!")
        // sendReminder(clientEmail, bookingDate)
        resetBooking()
      }
      else {
        alert("Your card was declined.")
        const payload = { 'booking_id': bookingId }
        cancelBooking(payload, BOOKING_TYPE.T)
      }
    }

    if (chooseTherapist) {
      bookingDate = moment(bookingDateAddr.bookingDate).format("YYYY-MM-DD")
      bookingData = {
        client_id: userId,
        client_name: userName,
        client_email: clientEmail,
        booking_artist_name: "",
        booking_artist_email: "",
        artist_id_list: [therapist.id],
        services: Object.keys(itemQty).map(id => parseInt(id)),
        quantities: Object.values(itemQty),
        booking_date: bookingDate,
        artist_start_time: moment(bookingDateAddr.artistStart).format("HH:mm"),
        booking_start_time: moment(bookingDateAddr.bookingDate).format("HH:mm"),
        booking_end_time: moment(bookingDateAddr.bookingEnd).format("HH:mm"),
        with_organic: priceFactors.organic ? 1 : 0,
        with_pensioner_rate: priceFactors.pensionerRate ? 1 : 0,
        event_address: bookingDateAddr.bookingAddr,
        total_amount: bookingValue,
        comment: value,
        time_on_site: (bookingDateAddr.bookingEnd.getTime() - bookingDateAddr.bookingDate.getTime()) / 60000,
        travel_duration: 0,
        travel_distance: 0,
        payment_amount: depositPayable,
        payment_type: 'deposit'
      }
    } else {
      bookingDate = bookingInfo.booking_date
      bookingData = {
        ...bookingInfo, 
        client_id: userId,
        client_name: userName,
        client_email: clientEmail,
        booking_artist_name: "",
        booking_artist_email: "",
        with_organic: priceFactors.organic ? 1 : 0,
        with_pensioner_rate: priceFactors.pensionerRate ? 1 : 0,
        total_amount: bookingValue, 
        payment_amount: depositPayable, 
        paid_checkout_total: 0,
        paid_deposit_total: depositPayable,
        payment_type: 'deposit', 
        comment: value,
        status: ''
      }
    }

    addBooking(bookingData, BOOKING_TYPE.T, charge)
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      {bookingInProgress && <div className={classes.progress}><CircularProgress color='primary' /></div>}
      <Paper className={classes.paper}>
        <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
          Deposit payable: $ {depositPayable.toString()}
        </Typography>
        <StripeForm stripePublicKey={stripePublicKey} handleCharge={submit} loggedIn={loggedIn} payMessage="Pay"/>
        <TextField
          id="outlined-textarea"
          label="Additional instructions"
          placeholder="Let us know about any allergies, preferences, entrances,
          or any details about your room number if you are
          staying in a hotel. If there's free street parking near the event, please advise."
          multiline
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={handleChange}
        />
      </Paper>
      <Button variant="text" color="primary" size='large' onClick={() => changeBookingStage(2)}>
        back
      </Button>
      <SigninForm initOpen={!loggedIn}/>
    </Container>
  )
}

export default Payment