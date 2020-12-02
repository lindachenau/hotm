import React, { useState, useEffect, useContext } from 'react'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'
import axios from "axios"
import { useLocation } from "react-router-dom"
import queryString from 'query-string'
import StripeForm from '../components/StripeForm'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { stripe_charge_server, bookings_url, admin_bookings_url } from '../config/dataLinks'
import { sendReminders } from '../utils/misc'
import { BOOKING_TYPE, PUT_OPERATION } from '../actions/bookingCreator'
import { localDate } from '../utils/dataFormatter'

const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY

const logo = require('../images/HBLC-Updated-logo-600.png')

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

function PaymentLink ({ theme, enableStore, updateBooking, getClient, client} ) {
 
  const classes = useStyles()
  const { corpCardsObj } = useContext(BookingsStoreContext)
  const [query] = useState(queryString.parse(useLocation().search))
  const [bookingData, setBookingData] = useState(null)
  const [amount, setAmount] = useState(0)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingType, setBookingType] = useState(null)
  const [bookingTotal, setBookingTotal] = useState(0)
  const [clientPay, setClientPay] = useState(false)
  const [corpName, setCorpName] = useState('')
  const [cancelled, setCancelled] = useState(false)
  const [paid, setPaid] = useState(false)
  const [pay, setPay] = useState(false)
  const [donePay, seDonePay] = useState(false)
  const [bookingTime, setBookingTime] = useState([])

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
        const data = result.data

        // Just in case the client forgets she's paid already.
        if ((query.payment_type === 'deposit' && data.paid_amount > 0) || 
          (query.payment_type === 'balance' && (data.total_amount - data.paid_amount) < 0.01)) {
          setPaid(true)
        }

        setBookingData(data)

      } catch (err) {
        setCancelled(true)
      }
    }

    enableStore()
    fetchBooking()

  }, [])

  useEffect(() => {
    if (bookingData) {
      const cId = query.booking_type === 'client' ? bookingData.client_id : bookingData.card_or_client_id
      const amount = query.payment_type === 'deposit' ? (bookingData.total_amount * query.percentage / 100).toFixed(2) : 
        (bookingData.total_amount - bookingData.paid_amount).toFixed(2)
      
      setAmount(amount)
      setBookingTotal(bookingData.total_amount)
      if (query.booking_type === 'client') {
        getClient(cId)
        setBookingDate(bookingData.booking_date)
        setBookingTime(localDate(bookingData.booking_date, bookingData.booking_start_time))
        setClientPay(true)
        setBookingType(BOOKING_TYPE.T)
      } else if (bookingData.booking_type === BOOKING_TYPE.P) {
        getClient(cId)
        setBookingDate(bookingData.event_list[0].booking_date)
        let bTimes = []
        for (const e of bookingData.event_list) {
          const time = localDate(e.booking_date, e.booking_start_time)
          const tick = time.getTime()
          if (!bTimes.some(bTime => bTime.getTime() === tick))
            bTimes.push(time)
        }
        setBookingTime(bTimes)
        setClientPay(true)
        setBookingType(BOOKING_TYPE.P)
      } else {
        setBookingDate(bookingData.event_list[0].booking_date)
        setCorpName(corpCardsObj[cId.toString()].name)
        setBookingType(BOOKING_TYPE.C)
      }
    }
  }, [bookingData])

  useEffect(() => {
    if (bookingData && !paid && !cancelled)
      setPay(true)
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
      const bookingInfo = {
        booking_id: query.booking_id,
        payment_type: 'credit',
        payment_amount: amount,
        operation: PUT_OPERATION.PAYMENT,
        stripe_id: id
      }
  
      updateBooking(bookingInfo, bookingType, null, true)
      //Payment successful. Set a reminder for the client. Corporate doesn't need a reminder.
      if (clientPay) 
        sendReminders(bookingType, query.booking_id, bookingTime, client.phone, client.name)
      
      seDonePay(true)
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
      {cancelled &&
      <Typography variant="body1" align="left" color="textPrimary">
          {`Sorry your HBLC booking_id: ${query.booking_id} has been cancelled.`}
      </Typography>}
      {paid &&
      <Typography variant="body1" align="left" color="textPrimary">
          {`You've already paid the ${query.payment_type} for HBLC booking_id: ${query.booking_id}. Thank you!`}
      </Typography>}
      {pay &&
      <>   
        <Typography variant="body1" align="left" color="textPrimary">
          {`Paying ${query.payment_type} $${amount} for HBLC booking_id: ${query.booking_id}`}
        </Typography>
        <Typography variant="body1" align="left" color="textPrimary">
          {`Booking date : ${bookingDate}`}
        </Typography>
        <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
          {`Booking total : $${bookingTotal}`}
        </Typography>            
        <StripeForm stripePublicKey={stripePublicKey} handleCharge={submit} loggedIn={!donePay} payMessage="Pay"/>
      </>}
    </Container>
  )
}

export default PaymentLink