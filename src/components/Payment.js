import React, { useState } from 'react'
import StripeForm from './StripeForm'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import SigninForm from '../config/SigninFormContainer'

import { stripe_charge_server } from '../config/dataLinks'
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
  }
}))

function Payment (
  { theme, 
    changeBookingStage, 
    depositPayable, 
    resetBooking, 
    addBooking, 
    bookingInfo, 
    items, 
    itemQty, 
    loggedIn, 
    priceFactors, 
    bookingValue, 
    userId, 
    userName
  }) {
  const [value, setValue] = useState('');

  const classes = useStyles()

  const handleChange = event => {
    setValue(event.target.value);
  }

  const successNotification = () => {
    alert("Booking successful!")
    resetBooking()
  }

  const submit = async (token) => {
    let response = await fetch(stripe_charge_server, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        id: token.id,
        description: `${userName}'s deposit for booking`,
        amount: (depositPayable * 100).toFixed(0)
      })
    });

    console.log(response)
  
    let bookingData = {
      ...bookingInfo, 
      client_id: userId,
      with_organic: priceFactors.organic ? 1 : 0,
      with_pensioner_rate: priceFactors.pensionerRate ? 1 : 0,
      unit_prices: Object.keys(itemQty).map(id => items[id].price),
      total_amount: bookingValue, 
      paid_amount: depositPayable, 
      paid_type: 'deposit', 
      comment: value,
      status: ''
    }

    if (response.ok) 
      addBooking(bookingData, successNotification, depositPayable)
    else
      alert("Stripe error. Please call to resolve this issue.")
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
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