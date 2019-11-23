import React, { useState, useContext } from 'react'
import StripeForm from './StripeForm'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { BookingsStoreContext } from '../config/BookingsStoreProvider'
import SigninForm from '../config/SigninFormContainer'

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

function Payment ({theme, changeBookingStage, depositPayable, resetBooking, addBooking, bookingInfo, loggedIn}) {
  const {bookingsData} = useContext(BookingsStoreContext)
  const [value, setValue] = React.useState('');

  const classes = useStyles()

  const handleChange = event => {
    setValue(event.target.value);
  }

  const successNotification = () => {
    alert("Booking successful!")
    resetBooking()
  }

  const submit = async (token) => {
    let response = await fetch("/charge", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        id: token.id,
        amount: depositPayable * 100
      })
    });
  
    let bookingData = {...bookingInfo, depositPaid: depositPayable, comment: value}

    if (response.ok) 
      addBooking(bookingData, successNotification, depositPayable)
    else
      alert("Stripe error")
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      <Paper className={classes.paper}>
        <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
          Deposit payable: $ {depositPayable.toString()}
        </Typography>
        <StripeForm stripePublicKey="pk_test_a0vfdte94kBhPrDqosS5OnPd00A0fS0egz" handleCharge={submit} />
        <TextField
          id="outlined-textarea"
          label="Additional instructions"
          placeholder="Let us know about any allergies, preferences, entrances,
          or any details about your room number if you are
          staying in a hotel."
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
      {!loggedIn && <SigninForm/>}
    </Container>
  )
}

export default Payment