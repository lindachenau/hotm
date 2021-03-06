import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'

import ServiceMenu from '../config/ServiceMenuContainer'
import LocationSearchInput from './LocationSearchInput'
import { validateClientBooking } from '../utils/misc'
import { available_artists_url } from '../config/dataLinks'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  }
}))

function Info() {
  return (
    <Alert elevation={6} severity="info" variant="outlined" style={{marginTop: 10}}>
      Appointments between 8am to 6pm can be booked online, at least 24 hours in advance.
    </Alert>
  )
}

const ServiceSelection = ({ 
  theme,
  services,
  itemQty, 
  onSubmit, 
  pensionerRate, 
  bookingDate, 
  bookingAddr,
  userInfo,
  submitBooking,
  getAvailArtist,
  changeSelectedArtist,
  artistBooking,
  bookingValue }) => {
  const classes = useStyles()
  const items = services.items
  const [selectedDate, setSelectedDate] = useState(bookingDate)
  const [address, setAddress] = useState(bookingAddr)
  
  useEffect(() => {
    setSelectedDate(bookingDate)
    setAddress(bookingAddr)
  }, [bookingAddr, bookingDate])

  useEffect(() => {
    if (userInfo.id)
      setAddress(userInfo.address)
  }, [userInfo])

  const missingFields = () => {
    let qty = 0
    for (let id of Object.keys(itemQty)) {
      qty += itemQty[id]
    }
    
    return !(qty > 0 && address && selectedDate)
  }

  const handleDateChange = date => {
    setSelectedDate(date);
  }

  const handleAddrChange = address => {
    setAddress(address.replace(', Australia', ''))
  }

  const getBookingEnd = () => {
    let duration = 0
    for (let id of Object.keys(itemQty)) {
      let qty = itemQty[id]
      duration += items[id].timeOnsite * qty
    }
    //timeOnsite is minutes
    return selectedDate.getTime() + duration * 60 * 1000
  }

  const handleNext = async (event) => {
    const { valid, reason } = await validateClientBooking(pensionerRate, selectedDate)
    if (!valid) {
      alert(reason)
      return
    }

    submitBooking(null, selectedDate, new Date(getBookingEnd()), address)

    /*A workaround for redux-thunk error. When passing (itemQty, selectedDate, address) to getAvailArtist action creator,
    *(itemQty, selectedDate, address) become undefined even though the values are still correct in mapDispatchToProps.
    */
    let url = available_artists_url + '?date=' + moment(selectedDate).format("YYYY-MM-DD") + 
    '&start_time=' + moment(selectedDate).format("HH:mm") + '&services=' + Object.keys(itemQty) +
    '&quantities=' + Object.values(itemQty) + '&event_addr=' + address + '&total_amount=' + bookingValue
    
    getAvailArtist(url)

    changeSelectedArtist(0)
    onSubmit(1)
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 50}}>
      <ServiceMenu services={services} artistBooking={artistBooking} />
      <Info/>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-between">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Select booking date"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Select booking time"
            value={selectedDate}
            minutesStep={15}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <LocationSearchInput address={address} changeAddr={handleAddrChange}/>
      <div className={classes.flex}>
        <div className={classes.grow} />
        <Button variant='text' color='primary' onClick={handleNext} disabled={missingFields()}>
          Next
        </Button>
      </div>
    </Container>
  );
}

export default ServiceSelection

