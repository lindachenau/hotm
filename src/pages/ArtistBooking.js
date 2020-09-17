import React, { useState, useEffect, useContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import MyCalendar from '../components/MyCalendar'
import 'react-big-calendar/lib/sass/styles.scss'
import '../components/CalendarToolbar.css'
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import AddArtists from '../components/AddArtists'
import LocationSearchInput from '../components/LocationSearchInput'
import AddClient from '../components/AddClient'
import EventForm from '../components/EventForm'
import ServiceMenu from '../config/ServiceMenuContainer'
import ArtistBookingItems from '../components/ArtistBookingItems'
import EventManager from '../components/EventManager'
import { mergeThenSort, resizeEvent, moveEvent, onNavigate, onSaveEventDetails } from '../utils/eventFunctions'
import { BOOKING_TYPE } from '../actions/bookingCreator'
import { BookingsStoreContext } from '../components/BookingsStoreProvider'
import CircularProgress from '@material-ui/core/CircularProgress'

const localizer = momentLocalizer(moment)

const useStyles = makeStyles(theme => ({
  padding: {
    paddingTop: 10
  },
  padding2: {
    display: 'flex',
    paddingTop: 20,
    paddingBottom: 20
  },
  grow: {
    flexGrow: 1
  },
  progress: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20
  }  
}))

const ArtistBooking = ({
  location,
  theme,
  artistBooking,
  services,
  itemQty,
  artists,
  userEmail,
  artistSignedIn,
  resetBooking,
  bookingValue,
  addBooking,
  updateBooking,
  loadBooking,
  priceFactors }) => {
  const classes = useStyles(theme)
  const [artist, setArtist] = useState(null)
  const [booingArtistId, setBooingArtistId] = useState('')
  const [draftId, setDraftId] = useState(1)
  const [client, setClient] = useState(null)
  const [draftEvent, setDraftEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [draftEvents, setDraftEvents] = useState([])
  const [address, setAddress] = useState('')
  const [today, setToday] = useState(new Date())
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [calendarId, setCalendarId] = useState(null)
  const [artistBookingItems, setArtistBookingItems] = useState([])
  const [triggerEventForm, setTriggerEventForm] = useState(false)
  const [triggerSaveAllDrafts, setTriggerSaveAllDrafts] = useState(false)
  const [triggerDeleteEvent, setTriggerDeleteEvent] = useState(false)  
  const items = services.items
  // This component has 3 modes of operations - book, edit and view. edit and view are redirected from "Manage bookings".
  const [mode, setMode] = useState('book')
  const [saveModified, setSaveModified] = useState(false)
  const [browsing, setBrowsing] = useState(false)
  const { bookingsData } = useContext(BookingsStoreContext)
  const { bookingInProgress } = bookingsData
  const [estimatedDuration, setEstimatedDuration] = useState(0)
  
  useEffect(() => {
    const theArtist = Object.values(artists).filter(artist => artist.email === userEmail)
    if (theArtist.length > 0) {
      setBooingArtistId(theArtist[0].id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  

  useEffect(() => {
    const theArtist = Object.values(artists).filter(artist => artist.email === userEmail)
    if (artistSignedIn && theArtist.length > 0) {
      setArtist(theArtist[0])

      if (!location.state ) {
        setCalendarId(theArtist[0].email)
        setFromDate(moment(today).startOf('month').startOf('week')._d)
        setToDate(moment(today).endOf('month').endOf('week')._d)        
      } else if (location.state.edit) {
        setToday(artistBooking.start)
        setFromDate(moment(artistBooking.start).startOf('month').startOf('week')._d)
        setToDate(moment(artistBooking.start).endOf('month').endOf('week')._d)                     
        setMode('edit')
        setCalendarId(artistBooking.artists[0].email)
        setAddress(artistBooking.address)
        setClient(artistBooking.client)
        setArtist(artistBooking.artists[0])
        loadBooking(artistBooking.origBooking)
        const entry = {
          id: artistBooking.id,
          type: 'draft',
          title: 'HOTM Booking',
          allDay: false,
          start: artistBooking.start,
          bookingTime: artistBooking.bookingTime,
          end: artistBooking.end,
          artistName: artistBooking.artistName,
          address: artistBooking.address,
          comment: artistBooking.comment            
        }
  
        setEvents([entry])
        setDraftEvents([entry])      
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (artist)
      setCalendarId(artist.email)
  }, [artist])

  const getDuration = () => {
    let duration = 0
    for (let id of Object.keys(itemQty)) {
      let qty = itemQty[id]
      duration += items[id].timeOnsite * qty
    }

    return duration
  }

  useEffect(() => {
    let artItems = []
    for (let id of Object.keys(itemQty)) {
      const item = {
        id: id,
        description: items[id].description,
        qty: itemQty[id]
      }
      artItems.push(item)
    }
    setArtistBookingItems(artItems)
    setEstimatedDuration(getDuration())
  }, [itemQty])

  const newEvent = (event) => {

    //Disable adding new event in month view
    if (event.slots.length === 1)
      return

    //Disable adding new event before artist, package and client selection
    if (artist === null || artistBookingItems.length === 0 || client === null) {
      alert('Select artist, service items and client before creating an event.')
      return
    }             

    const newId = `draft-${draftId}`
    setDraftId(draftId + 1)

    const newEvent = {
      id: newId,
      type: 'draft',
      title: 'New Event',
      allDay: false,
      start: event.start,
      bookingTime: event.start,
      end: event.end,
      artistName: artist ? artist.name : '',
      artistId: artist ? artist.id : '',
      comment: ''      
    }
    setEvents([newEvent])
    setDraftEvents(mergeThenSort([newEvent], draftEvents))
  }

  const onSelectEvent = (event) => {
    if (event.type !== 'draft')
      return
    setDraftEvent(event)
    setTriggerEventForm(!triggerEventForm)
  }

  const handleBack = () => {
    setBrowsing(true)
  }

  const handleBook = () => {
    const callBack = (bookingId) => {
      const message = mode === 'book' ? 'Booking successful! A deposit payment link has been sent to the client. Booking will be automatically cancelled if not paid within 12 hours.' :
        'Updating successful'
      setTriggerSaveAllDrafts(!triggerSaveAllDrafts)
      alert(message)
      setDraftEvents([])
      resetBooking()
      if (mode === 'edit')
        setBrowsing(true)
    }

    let bookingData = {}
    
    const event = draftEvents[0]

    bookingData.client_id = client.id
    bookingData.artist_id_list = [artist.id]
    bookingData.services = Object.keys(itemQty).map(id => parseInt(id))
    bookingData.quantities = Object.values(itemQty)
    bookingData.booking_date = moment(event.start).format("YYYY-MM-DD")
    bookingData.booking_time = moment(event.bookingTime).format("HH:mm")
    bookingData.booking_end_time = moment(event.end).format("HH:mm")
    bookingData.with_organic = priceFactors.organic ? 1 : 0
    bookingData.with_pensioner_rate = priceFactors.pensionerRate ? 1 : 0
    bookingData.event_address = address
    bookingData.total_amount = bookingValue
    bookingData.comment = event.comment
    bookingData.booking_artist_id = booingArtistId
    //All fields below are redundant. They can be removed when API does not make them mandatory.
    bookingData.time_on_site = getDuration()
    bookingData.artist_start_time = moment(event.start).format("HH:mm")
    bookingData.travel_duration = 0
    bookingData.travel_distance = 0
    bookingData.payment_amount = 0
    bookingData.payment_type = 'deposit'

    if (mode === 'book') {
      addBooking(bookingData, BOOKING_TYPE.A, callBack)
    }
    else {
      bookingData.booking_id = artistBooking.id
      updateBooking(bookingData, BOOKING_TYPE.A, callBack)
    }
  }

  return (
    <>
    {browsing ?
      <Redirect to={'/manage'} />
      :
      <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
        <Grid container justify="space-around" spacing={1}>
          <Grid item xs={12} md={4}>
            <LocationSearchInput address={address} changeAddr={(address) => {setAddress(address.replace(', Australia', ''))}}/>  
            <div className={classes.padding}>
              <AddClient
                disabled={mode !== 'book'}
                setClient={setClient}
                client={client}
                label="Add client"
              />
            </div>
            <div className={classes.padding}>
              <AddArtists
                artists={artists}
                multiArtists={false}
                clearable={false}
                setTags={setArtist}
                tags={artist}
                label="Select artist"
              />
            </div>
            <div className={classes.padding}>
              <ArtistBookingItems items={artistBookingItems} duration={estimatedDuration}/>
            </div>
            {bookingInProgress ? 
              <div className={classes.progress}><CircularProgress color='primary' /></div>
              :
              <div className={classes.padding2}>
                {mode === 'edit' &&
                <Button 
                  variant="text" 
                  onClick={handleBack} 
                  color="primary"
                >
                  Back
                </Button>}                                 
                <div className={classes.grow} />
                <Button 
                  variant="text"
                  onClick={handleBook}
                  color="primary"
                  disabled={
                    draftEvents.length !== 1 || 
                    address === '' || 
                    client === null || 
                    Object.keys(itemQty).length === 0}
                >
                  {mode === 'book' ? 'Book' : 'Save'}
                </Button>
                </div>}                   
            <div className={classes.padding}>
              <ServiceMenu services={services} artistBooking={true} />
            </div>
          </Grid>
          <Grid item xs={12} md={8}>                     
            <MyCalendar
              events={events}
              localizer={localizer}
              defaultDate={today}
              onSelectEvent={onSelectEvent}
              moveEvent={({event, start, end}) => moveEvent(event, start, end, setEvents, draftEvents, setDraftEvents)}
              resizeEvent={({event, start, end}) => resizeEvent(event, start, end, setEvents, draftEvents, setDraftEvents)}
              newEvent={newEvent}
              onNavigate={(date, view) => onNavigate(date, view, fromDate, setFromDate, toDate, setToDate, setToday)}
              triggerSaveAllDrafts={triggerSaveAllDrafts}
              triggerDeleteEvent={triggerDeleteEvent}
              eventToDelete={draftEvent? draftEvent.id : null}
            />
          </Grid>
        </Grid>
        <EventForm 
          theme={theme}
          mode={mode}
          setSaveModified={setSaveModified}
          draftEvent={draftEvent}
          withLocation={false}
          withContact={false}
          withTask={false}
          triggerOpen={triggerEventForm}
          initOpen={false}
          estimatedDuration={estimatedDuration}
          onSaveEventDetails={(task, address, contact, comment, start, bookingTime, end) => 
            onSaveEventDetails(task, address, contact, comment, start, bookingTime, end, draftEvent, setDraftEvent)}
          onDeleteEvent={() => setTriggerDeleteEvent(!triggerDeleteEvent)}
        />
        <EventManager
          mode={mode}
          saveModified={saveModified}
          setSaveModified={setSaveModified}
          artistSignedIn={artistSignedIn}
          artist={artist}
          calendarId={calendarId}
          fromDate={fromDate}
          toDate={toDate}
          setEvents={setEvents}
          draftEvent={draftEvent}
          draftEvents={draftEvents}
          setDraftEvents={setDraftEvents}     
          triggerDeleteEvent={triggerDeleteEvent}
        />        
      </Container>}
    </>
  )
}

export default withRouter(ArtistBooking)