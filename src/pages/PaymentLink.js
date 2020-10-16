import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useLocation } from "react-router-dom"
import queryString from 'query-string'
import StripeForm from '../components/StripeForm'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { bookings_url, contact_phone } from '../config/dataLinks'

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

function PaymentLink () {
 
  const classes = useStyles()

  const [query] = useState(queryString.parse(useLocation().search))
  const [bookingData, setBookingData] = useState(null)
  const [amount, setAmount] = useState(0)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTotal, setBookingTotal] = useState(0)

  useEffect(() => {
    const fetchBooking = async () => {
      const config = {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        url: `${bookings_url}/?booking_id=${query.booking_id}`
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
      setAmount((bookingData.total_amount * query.percentage / 100).toFixed(2))
      setBookingDate(bookingData.booking_date)
      setBookingTotal(bookingData.total_amount)
    }
  }, [bookingData])

  const submit = async (token) => {
    // const charge = async (bookingId) => {
    //   const response = await fetch(stripe_charge_server, {
    //     method: "POST",
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify({
    //       id: token.id,
    //       description: `${userName}'s deposit for booking on ${bookingDate}`,
    //       amount: (amount * 100).toFixed(0)
    //     })
    //   })

    //   const {id, status} = await response.json()
    // }
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
      <StripeForm stripePublicKey={stripePublicKey} handleCharge={submit} payMessage="Pay"/>
    </Container>
  )
}

export default PaymentLink