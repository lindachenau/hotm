import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { makeStyles } from '@material-ui/core/styles'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import AddArtists from './AddArtists'
import AddClient from './AddClient'

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  }
}))

export default function Filter({
  theme,
  artists,
  triggerOpen, 
  bookingFilter,
  setFromDate,
  setToDate,
  setArtist,
  setClient,
  searchBooking}) {

  const {fromDate, toDate, artist, client} = bookingFilter
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)

  const classes = useStyles(theme)

  useEffect(() => {
    if (didMountRef.current)
      setOpen(true)
    else
      didMountRef.current = true
  }, [triggerOpen])

  const handleSearch = () => {
    searchBooking()
    setOpen(false)
  }
  
  return (
    <Dialog open={open} onBackdropClick={() => setOpen(false)}>
      <DialogTitle id="simple-dialog-title">Filters for booking search</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Select from date"
            value={fromDate}
            onChange={setFromDate}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Select to date"
            value={toDate}
            onChange={setToDate}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <br/>
        <br/>
        <AddArtists
          artists={artists}
          multiArtists={false}
          clearable={false}
          setTags={setArtist}
          tags={artist}
          label="Select artist"
        />
        <br/>
        <AddClient
          setClient={setClient}
          client={client}
          label="Select client"
        />
      </DialogContent>
      <DialogActions className={classes.button}>
        <Button variant="contained" onClick={handleSearch} color="primary" fullWidth>
          Search
        </Button>
      </DialogActions>
    </Dialog>
  )
}