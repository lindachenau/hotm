import React, { useState, useEffect, useContext } from 'react'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'
import axios from "axios"
import { useLocation } from "react-router-dom"
import queryString from 'query-string'
import StripeForm from '../components/StripeForm'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { stripe_charge_server, bookings_url, admin_bookings_url, contact_phone } from '../config/dataLinks'
import { BOOKING_TYPE, PUT_OPERATION } from '../actions/bookingCreator'

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY

const logo = require('../images/hblc_logo_512.png')

const useStyles = makeStyles(theme => ({
  container1: {
    display: 'flex',
    marginTop: 10,
    marginBottom: 20
  },
  grow: {
    flexGrow: 1
  },
  logo: {
    maxWidth: '40%',
    width: 'auto',
    height: 'auto',
    [theme.breakpoints.down('sm')]: {
      maxHeight: 120,
    }
  }
}))

function PaymentLink ({ theme, updateBooking, getClient, client} ) {
 
  const classes = useStyles()
  const { corpCards } = useContext(BookingsStoreContext)
  const [query] = useState(queryString.parse(useLocation().search))
  const [bookingData, setBookingData] = useState(null)
  const [amount, setAmount] = useState(0)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTotal, setBookingTotal] = useState(0)
  const [clientPay, setClientPay] = useState(false)
  const [corpName, setCorpName] = useState('')

  useEffect(() => {
    const fetchBooking = async () => {
      const url = query.booking_type === 'client' ? bookings_url : admin_bookings_url
      const config = {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        url: `${url}?id=${query.booking_id}`
      }

      try {
        const result = await axios(config)
        setBookingData(result.data[0])
      } catch (err) {
        alert(`Unable to fetch booking data: ${err}. Please call ${contact_phone} to resolve this issue.`)
      }
    }

    fetchBooking()

  }, [])

  useEffect(() => {
    if (bookingData) {
      const amount = query.payment_type === 'deposit' ? (bookingData.total_amount * query.percentage / 100).toFixed(2) : 
        (bookingData.total_amount - bookingData.paid_amount).toFixed(2)
      setAmount(amount)
      setBookingDate(bookingData.booking_date)
      setBookingTotal(bookingData.total_amount)
      if (query.booking_type === 'client') {
        getClient(bookingData.client_id)
        setClientPay(true)
      } else if (bookingData.booking_type === BOOKING_TYPE.P) {
        getClient(bookingDate.card_or_client_id)
        setClientPay(true)
      } else {
        setCorpName(corpCards[bookingDate.card_or_client_id].name)
      }
    }
  }, [bookingData])

  const submit = async (token) => {
    const charge = async (bookingId) => {
      const who = clientPay ? client.name : corpName
      const response = await fetch(stripe_charge_server, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: token.id,
          description: `${who}'s ${query.payment_type} for booking ID: ${bookingId} on ${bookingDate}`,
          amount: (amount * 100).toFixed(0)
        })
      })

      return response
    }

    const response = await charge(query.booking_id)

    const {id, status} = await response.json()

    if (status === 'succeeded') {
      alert("Payment successful!")
      const bookingData = {
        booking_id: query.booking_id,
        payment_type: 'credit',
        payment_amount: amount,
        operation: PUT_OPERATION.PAYMENT
      }
  
      updateBooking(bookingData, query.booking_type === 'client' ? BOOKING_TYPE.T : BOOKING_TYPE.C, null, true)
    }
    else {
      alert("Your card was declined.")
    }
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 20}}>
      <div className={classes.container1}>
        <div className={classes.grow} />
        <img className={classes.logo} src={logo} alt="Hair Beauty Life Co logo" />
        <div className={classes.grow} />
      </div>      
      <Typography variant="body1" align="left" color="textPrimary">
        {`Paying ${query.payment_type} $${amount} for HBLC booking_id: ${query.booking_id}`}
      </Typography>
      <Typography variant="body1" align="left" color="textPrimary">
        {`Booking date : ${bookingDate}`}
      </Typography>
      <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
        {`Booking total : $${bookingTotal}`}
      </Typography>            
      <StripeForm stripePublicKey={stripePublicKey} handleCharge={submit} loggedIn={true} payMessage="Pay"/>
    </Container>
  )
}

export default PaymentLink