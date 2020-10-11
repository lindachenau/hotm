import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Alert from '@material-ui/lab/Alert'
import ServiceMenu from '../config/ServiceMenuContainer'
import AddArtists from '../components/AddArtists'
import LocationSearchInput from './LocationSearchInput'

import { available_artists_url, contact_phone } from '../config/dataLinks'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  flex: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  paddingB: {
    paddingBottom: 10
  },
  paddingT: {
    paddingTop: 20
  }
}))

function Info() {
  return (
    <Alert elevation={6} severity="info" variant="outlined" style={{marginTop: 10}}>
      Appointments between 8am to 6pm can be booked online, at least 24 hours in advance.
    </Alert>
  )
}

const TherapistSelection = ({ 
  theme, 
  services,
  itemQty, 
  bookingAddr,
  onSubmit,
  artists,
  artistBooking,
  bookingValue }) => {
  
  const classes = useStyles()
  const items = services.items
  const [address, setAddress] = useState(bookingAddr)
  const [artist, setArtist] = useState(null)
  
  useEffect(() => {
    setAddress(bookingAddr)
  }, [bookingAddr])

  const missingFields = () => {
    let qty = 0
    for (let id of Object.keys(itemQty)) {
      qty += itemQty[id]
    }
    
    return !(qty > 0 && address && artist)
  }

  const handleAddrChange = address => {
    setAddress(address.replace(', Australia', ''))
  }

  const handleSubmit = event => {
    onSubmit(1)
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 50}}>
      <div className={classes.paddingB}>
        <AddArtists
          artists={artists}
          multiArtists={false}
          clearable={false}
          setTags={setArtist}
          tags={artist}
          label="Select therapist"
        />
      </div>
      <ServiceMenu services={services} artistBooking={artistBooking} />
      <Info/>
      <div className={classes.paddingT}>
        <LocationSearchInput address={address} changeAddr={handleAddrChange}/>
      </div>
      <div className={classes.flex}>
        <div className={classes.grow} />
        <Button variant='text' color='primary' onClick={handleSubmit} disabled={missingFields()}>
          Next
        </Button>
      </div>
    </Container>
  );
}

export default TherapistSelection

