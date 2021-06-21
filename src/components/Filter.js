import React, { useEffect, useState, useRef,useContext } from 'react'
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
import AddCorporate from './DropdownList'
import AddBookingType from './DropdownList'
import { BOOKING_TYPE } from '../actions/bookingCreator'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 20
  },
  padding: {
    paddingTop: 10
  },
}))

export default function Filter({
  theme,
  artists,
  triggerOpen, 
  bookingFilter,
  setFromDate,
  setToDate,
  setBookingType,
  setArtist,
  setClient,
  setCorporate,
  searchBooking}) {

  const { corpCards, apiToken } = useContext(BookingsStoreContext)
  const {fromDate, toDate, bookingType, artist, client, corporate} = bookingFilter
  const [open, setOpen] = useState(false)
  const didMountRef = useRef(false)

  const classes = useStyles(theme)

  const bookingTypes = [
    {
      name: BOOKING_TYPE.C
    },
    {
      name: BOOKING_TYPE.P
    },
    {
      name: BOOKING_TYPE.T
    }
  ]  

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
            id="from-date"
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
            id="to-date"
            label="Select to date"
            value={toDate}
            onChange={setToDate}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <div className={classes.padding}>
          <AddBookingType
            id="booking-type"
            disableClearable={true}
            options={bookingTypes}
            label="Select booking type"
            placeholder="Booking type"
            setTag={setBookingType}
            tag={bookingType}        
          />
        </div>
        <div className={classes.padding}>
          <AddArtists
            artists={artists}
            multiArtists={false}
            setTags={setArtist}
            tags={artist}
            label="Select therapist"
          />
        </div>
        <div className={classes.padding}>
          {bookingType.name === BOOKING_TYPE.C ?
            <AddCorporate
              options={corpCards}
              id="corporate-list"
              label="Select corporate"
              placeholder="corporate"
              setTag={setCorporate}
              tag={corporate}
            />
            :
            <AddClient
              apiToken={apiToken}
              setClient={setClient}
              client={client}
              label="Select client"
            />
          }                      
        </div>
      </DialogContent>
      <DialogActions className={classes.button}>
        <Button variant="contained" onClick={handleSearch} color="secondary" fullWidth>
          Search
        </Button>
      </DialogActions>
    </Dialog>
  )
}