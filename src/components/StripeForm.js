import React, {useState, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { BookingsStoreContext } from './BookingsStoreProvider'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import {
  CardElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements'

const useStyles = makeStyles(() => ({
  stripe: {
    marginTop: 20,
    marginBottom: 20
  },
  card: {
    marginTop: 10,
  },
  progress: {
    display: 'flex',
    justifyContent: 'center'
  }  
}))

const createOptions = () => {
  return {
    hidePostalCode: true,
    style: {
      base: {
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#c23d4b',
      },
    }
  }
}

function CardForm ({loggedIn, stripe, handleCharge, payMessage}) {
  const { bookingsData } = useContext(BookingsStoreContext)
  const { bookingInProgress } = bookingsData
  const [errorMessage, setErrorMessage] = useState('')
  const classes = useStyles()

  const handleChange = ({error}) => {
    if (error) {
      setErrorMessage(error.message)
    }
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    if (stripe) {
      let result = await stripe.createToken()
      if (result.token) {
        // alert("Payment token was created successfully")
        handleCharge(result.token)
      }
      else {
        alert("Payment token creation failed")
      }
    } else {
      console.log("Stripe.js hasn't loaded yet.")
    }
  }

  return (
    <div className={classes.stripe}>
      <form onSubmit={handleSubmit}>
        <label>
          Card details
          <CardElement
            className={classes.card}
            onChange={handleChange}
            {...createOptions()}
          />
        </label>
        <div className={classes.stripe} role="alert">
          {errorMessage}
        </div>
        {bookingInProgress ?
        <div className={classes.progress}>
          <CircularProgress color='primary' />
        </div>
        :
        <Button variant="contained" color="secondary" fullWidth type='submit' disabled={!loggedIn}>{payMessage}</Button>}
      </form>
    </div>
  )
}

const InjectedCardForm = injectStripe(CardForm)

export default function StripeForm({stripePublicKey, handleCharge, loggedIn, payMessage}) {
  return (
    <StripeProvider apiKey={stripePublicKey}>
      <Elements>
        <InjectedCardForm handleCharge={handleCharge} loggedIn={loggedIn} payMessage={payMessage}/>
      </Elements>
    </StripeProvider>
  )
}