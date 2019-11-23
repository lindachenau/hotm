import React, {Component} from 'react'
import withStyles from '@material-ui/styles/withStyles'
import Button from '@material-ui/core/Button'
import {
  CardElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements'

const styles = () => ({
  stripe: {
    marginTop: 20,
    marginBottom: 20
  }
})

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

class _CardForm extends Component {
  state = {
    errorMessage: '',
  }

  handleChange = ({error}) => {
    if (error) {
      this.setState({errorMessage: error.message})
    }
  }

  handleSubmit = async (evt) => {
    evt.preventDefault()
    if (this.props.stripe) {
      let result = await this.props.stripe.createToken()
      if (result.token) {
        // alert("Payment token was created successfully")
        this.props.handleCharge(result.token)
      }
      else {
        alert("Payment token creation failed")
      }
    } else {
      console.log("Stripe.js hasn't loaded yet.")
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.stripe}>
        <form onSubmit={this.handleSubmit}>
          <label>
            Card details
            <CardElement
              onChange={this.handleChange}
              {...createOptions()}
            />
          </label>
          <div className={classes.stripe} role="alert">
            {this.state.errorMessage}
          </div>
          <Button variant="contained" color="primary" fullWidth type='submit'>Pay</Button>
        </form>
      </div>
    )
  }
}

const CardForm = withStyles(styles)(_CardForm)
const InjectedCardForm = injectStripe(CardForm)


export default class StripeForm extends Component {
  render() {
    return (
      <StripeProvider apiKey={this.props.stripePublicKey}>
        <Elements>
          <InjectedCardForm handleCharge={this.props.handleCharge} />
        </Elements>
      </StripeProvider>
    )
  }
}