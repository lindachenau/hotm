import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'

import ServiceMenu from '../config/ServiceMenuContainer'

import LocationSearchInput from './LocationSearchInput'

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


const ServiceSelection = ({ 
  theme, 
  services,
  itemQty, 
  onSubmit, 
  organic, 
  pensionerRate, 
  bookingDate, 
  bookingAddr, 
  toggleOrganic, 
  togglePensionerRate, 
  submitBooking,
  getAvailArtist,
  changeSelectedArtist,
  artistBooking,
  newBooking,
  setManageState }) => {
  
  const classes = useStyles()
  const items = services.items
  const cats = services.cats
  const [selectedDate, setSelectedDate] = useState(bookingDate)
  const [address, setAddress] = useState(bookingAddr)
  
  useEffect(() => {
    setSelectedDate(bookingDate)
    setAddress(bookingAddr)
  }, [bookingAddr, bookingDate])

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
    setAddress(address)
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

  const checkBookingRules = () => {
    let allAddOn = true
    Object.keys(itemQty).forEach(id => {allAddOn = items[id].addOn && allAddOn})

    if (pensionerRate && selectedDate.getDay() !== 1) {
      alert('Sorry, pensioner rate is only available on Mondays.')
      return false
    }
    else if (allAddOn) {
      alert('Sorry, add-on services* can not be booked on its own.')
      return false
    }

    return true
  }

  const handleSubmit = event => {

    if (!checkBookingRules())
      return

    submitBooking(selectedDate, new Date(getBookingEnd()), address)

    /*A workaround for redux-thunk error. When passing (itemQty, selectedDate, address) to getAvailArtist action creator,
    *(itemQty, selectedDate, address) become undefined even though the values are still correct in mapDispatchToProps.
    */
    let url = available_artists_url + '?date=' + moment(selectedDate).format("YYYY-MM-DD") + 
    '&start_time=' + moment(selectedDate).format("HH:mm") + '&services=' + Object.keys(itemQty) +
    '&quantities=' + Object.values(itemQty) + '&event_addr=' + address
    
    getAvailArtist(url)

    changeSelectedArtist(0)
    onSubmit(1)
  }

  const handleNext = event => {
    if (!checkBookingRules())
    return

    submitBooking(selectedDate, new Date(getBookingEnd()), address)
    onSubmit(1)
  }

  const handleCancel = () => {
    setManageState('Default')
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 50}}>
      <FormControlLabel
        control={
          <Switch checked={pensionerRate} onChange={() => togglePensionerRate()} value="pensionerRate" color="primary"/>
        }
        label="Monday pensioner rate (less 20%)"
      />
      <FormControlLabel
        control={
          <Switch checked={organic} onChange={() => toggleOrganic()} value="organic" color="primary"/>
        }
        label="Use organic products"
      />
      {cats.map( cat => 
        <ServiceMenu
          theme={theme}
          items={items}
          key={cat.name}
          cat={cat} 
          organic={organic}
          pensioner={pensionerRate}
          artistBooking={artistBooking}
        />
      )}
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
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <LocationSearchInput address={address} changeAddr={handleAddrChange}/>
      <div className={classes.flex}>
        {!newBooking &&
        <Button variant='text' color='primary' onClick={handleCancel}>
          Cancel
        </Button>}
        <div className={classes.grow} />
        <Button variant='text' color='primary' onClick={artistBooking ? handleNext : handleSubmit} size="large" disabled={missingFields()}>
          {artistBooking ? 'Next' : 'Submit'}
        </Button>
      </div>
    </Container>
  );
}

export default ServiceSelection

