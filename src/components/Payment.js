import React, { useState } from 'react'
import {StripeProvider, Elements} from 'react-stripe-elements'
import StripeCardSection from './StripeCardSection'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    background: "linear-gradient(#f0e8e8, #e0d8d8)",
    width: '100%',
    overflowX: 'auto'
  },
  flex: {
    display: 'flex',
    marginTop: 10
  },
  grow: {
    flexGrow: 1,
  },
  acknowledge: {
    display: 'flex',
    marginTop: 20,
    alignItems: 'flexStart'
  },
  inline: {
    display: 'inline',
    paddingTop: 0
  }
}))

function Payment ({theme, changeBookingStage, bookingValue, packageBooking}) {
  const classes = useStyles()
  const [checkedTerm, setCheckedTerm] = useState(false)
  const [checkedParking, setCheckedParking] = useState(false)


  const handleTerm = event => {
    setCheckedTerm(!checkedTerm)
  }

  const handleParking = event => {
    setCheckedParking(!checkedParking)
  }

  // const submit = async (ev) => {
  //   let {token} = await this.props.stripe.createToken({name: "Name"});
  //   let response = await fetch("/charge", {
  //     method: "POST",
  //     headers: {"Content-Type": "text/plain"},
  //     body: token.id
  //   });
  
  //   if (response.ok) alert("Booking successful!")
  // }

  const submit = (ev) => {
    alert("Booking successful!")
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      <Paper className={classes.paper}>
        <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
          Deposit payable: $ {packageBooking ? (bookingValue/2).toString() : '50'}
        </Typography>
        <StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
          <Elements>
            <StripeCardSection/>
          </Elements>
        </StripeProvider>
      </Paper>
      <div className={classes.acknowledge}>
        <Checkbox checked={checkedTerm} onChange={handleTerm} value="checkedTerm" className={classes.inline}/>
        <Typography variant="body2" align="left" color="textPrimary">
          I have read Terms & Conditions & Cancellation policy.
        </Typography>
      </div>
      <div className={classes.acknowledge}>
        <Checkbox checked={checkedParking} onChange={handleParking} value="checkedTerm" className={classes.inline}/>
        <Typography variant="body2" align="left" color="textPrimary">
          Customers are required to pay parking charges incurred while artists attend your booking. The incurred parking charges 
          will be added onto the final invoice.
        </Typography>
      </div>
      <div className={classes.flex}>
        <Button variant="text" color="primary" size='large' onClick={() => changeBookingStage(2)}>
          back
        </Button>
        <div className={classes.grow} />
        <Button variant="text" color="primary" size='large' onClick={submit} disabled={!(checkedTerm && checkedParking)}>
          Submit
        </Button>
      </div>
    </Container>
  )
}

export default Payment