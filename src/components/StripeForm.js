import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
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

function CardForm ({loggedIn, stripe, handleCharge}) {
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
            onChange={handleChange}
            {...createOptions()}
          />
        </label>
        <div className={classes.stripe} role="alert">
          {errorMessage}
        </div>
        <Button variant="contained" color="primary" fullWidth type='submit' disabled={!loggedIn}>Pay</Button>
      </form>
    </div>
  )
}

const InjectedCardForm = injectStripe(CardForm)

export default function StripeForm({stripePublicKey, handleCharge, loggedIn}) {
  return (
    <StripeProvider apiKey={stripePublicKey}>
      <Elements>
        <InjectedCardForm handleCharge={handleCharge} loggedIn={loggedIn}/>
      </Elements>
    </StripeProvider>
  )
}