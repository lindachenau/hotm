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
    width: "100%"
  },
  flex: {
    display: 'flex',
    marginTop: 10
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
  bookingData, 
  bookingValue,
  newBooking,
  comment
  }) {
  const [value, setValue] = useState(comment);

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
        description: "'s deposit for booking",
        amount: (depositPayable * 100).toFixed(0)
      })
    });
  
    if (response.ok) 
      addBooking(bookingData, successNotification, depositPayable)
    else
      alert("Stripe error. Please call to resolve this issue.")
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
            Balance payable: $ {(bookingValue - depositPayable).toString()}
          </Typography>
        }
        <StripeForm stripePublicKey="pk_test_a0vfdte94kBhPrDqosS5OnPd00A0fS0egz" handleCharge={submit} loggedIn={true} payMessage="Client Pay"/>
        <TextField
          id="outlined-textarea"
          label="Additional instructions"
          placeholder="Let us know about any allergies, preferences, entrances,
          or any details about your room number if you are
          staying in a hotel. If there's free street parking near the event, please advise."
          multiline
          value={value}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={handleChange}
        />
      </Paper>
      <div className={classes.flex}>
        <Button variant="text" color="primary" size='large' onClick={() => changeBookingStage(1)}>
          back
        </Button>
        <div className={classes.grow} />
        {!newBooking &&
        <Button variant="text" color="primary" size='large'>
          Update Booking
        </Button>}
      </div>
    </Container>
  )
}

export default ArtistPayment