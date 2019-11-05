import React, { useState } from "react"
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

import ServiceMenu from './ServiceMenu'

import LocationSearchInput from './LocationSearchInput'

const ServiceSelection = (props) => {
  const items = props.services.items
  const cats = props.services.cats
  const [ organic, setOrganic ] = useState(false)
  const [ pensioner, setPensioner ] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = event => {
    props.onSubmit(1)
  }

  const togglePensioner = event => {setPensioner(!pensioner)}

  const toggleOrganic = event => {setOrganic(!organic)}

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 50}}>
      <FormControlLabel
        control={
          <Switch checked={pensioner} onChange={togglePensioner} value="pensioner" color="primary"/>
        }
        label="Pensioner rate (less 20%)"
      />
      <FormControlLabel
        control={
          <Switch checked={organic} onChange={toggleOrganic} value="organic" color="primary"/>
        }
        label="Use organic products"
      />
      {cats.map( cat => 
        <ServiceMenu 
          items={items} 
          cat={cat} 
          theme={props.theme}
          organic={organic}
          pensioner={pensioner}
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
      <LocationSearchInput/>
      <Button variant='text' color='primary' onClick={handleSubmit} size="large">
          Submit
      </Button>
    </Container>
  );
}

export default ServiceSelection
