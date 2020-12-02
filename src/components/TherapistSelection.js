import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Alert from '@material-ui/lab/Alert'
import ServiceMenu from '../config/ServiceMenuContainer'
import AddArtists from '../components/AddArtists'
import LocationSearchInput from './LocationSearchInput'
import { travelTime } from '../utils/misc'

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
  userInfo,
  services,
  itemQty, 
  bookingDateAddr,
  submitBooking,
  onSubmit,
  artists,
  bookingValue,
  therapist,
  setTherapist,
  setTravelTime,
  artistBooking}) => {
  
  const classes = useStyles()
  const [address, setAddress] = useState(bookingDateAddr.bookingAddr)
    
  const missingFields = () => {
    let qty = 0
    for (let id of Object.keys(itemQty)) {
      qty += itemQty[id]
    }
    
    return !(qty > 0 && address && therapist)
  }

  useEffect(() => {
    if (userInfo.id)
      setAddress(userInfo.address)
  }, [userInfo])

  const outTravelRange = async() => {
    if (address && therapist && bookingValue > 0) {
      try {
        const result = await travelTime(therapist.id, address, bookingValue)
        const data = result.data
        if (data.can_travel) {
          setTravelTime(data.travel_time)
          return false
        } else {
          alert('Sorry, the therapist does not provide services at your location. Please choose another therapist.')
          return true
        }
      } catch (err) {
        console.log(err)
        return true
      }
    }
  }

  useEffect(() => {
    outTravelRange()
  }, [therapist, bookingValue])
  
  const handleAddrChange = address => {
    setAddress(address.replace(', Australia', ''))
  }

  const handleNext = async() => {

    if (await outTravelRange())
      return

    submitBooking(bookingDateAddr.artistStart, bookingDateAddr.bookingDate, bookingDateAddr.bookingEnd, address)
    onSubmit(1)
  }

  return (
    <Container maxWidth="sm" style={{paddingTop: 20, paddingBottom: 50}}>
      <div className={classes.paddingB}>
        <AddArtists
          artists={artists}
          multiArtists={false}
          clearable={false}
          setTags={setTherapist}
          tags={therapist}
          label="Choose therapist"
        />
      </div>
      <ServiceMenu services={services} artistBooking={artistBooking} skills={therapist ? therapist.skills : []}/>
      <Info/>
      <div className={classes.paddingT}>
        <LocationSearchInput address={address} changeAddr={handleAddrChange}/>
      </div>
      <div className={classes.flex}>
        <div className={classes.grow} />
        <Button variant='text' color='primary' onClick={handleNext} disabled={missingFields()}>
          Next
        </Button>
      </div>
    </Container>
  );
}

export default TherapistSelection

