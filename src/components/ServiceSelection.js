import React, { useState } from "react"
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
  changeSelectedArtist }) => {
  
  const classes = useStyles()
  const items = services.items
  const cats = services.cats
  const [selectedDate, setSelectedDate] = useState(bookingDate)
  const [address, setAddress] = useState(bookingAddr)
  
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

  const handleSubmit = event => {
    submitBooking(selectedDate, address)
    getAvailArtist(itemQty, bookingDate, bookingAddr)
    changeSelectedArtist(0)
    onSubmit(1)
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 50}}>
      <FormControlLabel
        control={
          <Switch checked={pensionerRate} onChange={() => togglePensionerRate()} value="pensionerRate" color="primary"/>
        }
        label="Pensioner rate (less 20%)"
      />
      <FormControlLabel
        control={
          <Switch checked={organic} onChange={() => toggleOrganic()} value="organic" color="primary"/>
        }
        label="Use organic products"
      />
      {cats.map( cat => 
        <ServiceMenu 
          items={items}
          key={cat}
          cat={cat} 
          theme={theme}
          organic={organic}
          pensioner={pensionerRate}
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
        <div className={classes.grow} />
        <Button variant='text' color='primary' onClick={handleSubmit} size="large" disabled={missingFields()}>
            Submit
        </Button>
      </div>
    </Container>
  );
}

export default ServiceSelection

