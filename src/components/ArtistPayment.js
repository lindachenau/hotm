import React, { useState } from 'react'
import StripeForm from './StripeForm'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    width: '100%',
    overflowX: 'auto'
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
  }
}))

function ArtistPayment({
  theme, 
  changeBookingStage, 
  depositPayable, 
  resetBooking, 
  addBooking, 
  updateBooking,
  bookingData, 
  newBooking,
  manageState,
  setManageState,
  comment
  }) {
  const [value, setValue] = useState(comment)

  //This booking has been checked out. No payment or update is allowed.
  const disablePayment = !newBooking & bookingData.paid_amount === 0

  const classes = useStyles()

  const handleChange = event => {
    setValue(event.target.value);
  }

  const successNotification = (message) => {
    // const message = newBooking ? "Booking successful!" : "Checkout successful!"
    alert(message + " successful!")
    resetBooking()
  }

  const submit = async (token) => {
    let response = await fetch("/charge", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        id: token.id,
        description: newBooking ? "deposit for booking" : "balance for booking",
        amount: (bookingData.paid_amount * 100).toFixed(0)
      })
    });
  
    if (response.ok) {
      if (newBooking) 
        addBooking({...bookingData, comment: value}, () => successNotification("Booking"))
      else
        updateBooking({...bookingData, comment: value}, () => successNotification("Checkout"))
    }
    else {
      alert("Stripe error. Please call to resolve this issue.")
    }
  }

  const handleUpdate = () => {
    updateBooking({...bookingData, paid_amount: 0, paid_type: "none", comment: value}, () => successNotification("Update"))
  }

  const handleCashPay = () => {
    updateBooking({...bookingData, paid_type: "cash", comment: value}, () => successNotification("Checkout"))
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      <Paper className={classes.paper}>
        {newBooking ?
          <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
            Deposit payable: $ {depositPayable.toString()}
          </Typography>
          :
          <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
            Balance payable: $ {bookingData.paid_amount.toString()}
          </Typography>
        }
        <StripeForm stripePublicKey="pk_test_a0vfdte94kBhPrDqosS5OnPd00A0fS0egz" handleCharge={submit} loggedIn={true} payMessage="Client Pay"/>
        {!newBooking && 
          <>
            <div className={classes.container}>
              <div className={classes.grow} />
              <p>OR</p>
              <div className={classes.grow} />
            </div>
            <Button variant="contained" onClick={handleCashPay} color="primary" fullWidth disabled={disablePayment}>
              Cash Pay
            </Button>
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
        <Button variant="text" color="primary" size='large' onClick={handleUpdate} disabled={disablePayment}>
          Update Booking
        </Button>}
      </div>
    </Container>
  )
}

export default ArtistPayment