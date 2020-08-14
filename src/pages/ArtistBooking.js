import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
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
import { mergeArrays, startDate, endDate } from '../utils/misc'
import { BOOKING_TYPE } from '../actions/bookingCreator'

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
}))

const ArtistBooking = ({
  theme, 
  services,
  itemQty,
  artists,
  userEmail,
  artistSignedIn,
  resetBooking,
  bookingValue,
  addBooking,
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
  const today = new Date()
  const [fromDate, setFromDate] = useState(moment(today).startOf('month').startOf('week')._d)
  const [toDate, setToDate] = useState(moment(today).endOf('month').endOf('week')._d)
  const [calendarId, setCalendarId] = useState(null)
  const [artistBookingItems, setArtistBookingItems] = useState([])
  const [triggerEventForm, setTriggerEventForm] = useState(false)
  const [triggerSaveAllDrafts, setTriggerSaveAllDrafts] = useState(false)
  const [triggerDeleteEvent, setTriggerDeleteEvent] = useState(false)  
  const items = services.items
  
  const mergeThenSort = (arr1, arr2) => {
    const events = mergeArrays(arr1, arr2).sort((a, b) => {
      let event1 = a.start.valueOf()
      let event2 = b.start.valueOf()
      if (event1 < event2)
        return -1
      else if (event1 > event2)
        return 1
      else
        return 0
    })

    return events
  }  

  useEffect(() => {
    const theArtist = Object.values(artists).filter(artist => artist.email === userEmail)
    if (artistSignedIn && theArtist.length > 0) {
      setArtist(theArtist[0])
      setBooingArtistId(theArtist[0].id)
      setCalendarId(theArtist[0].email)
    }
  }, [])


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
  }, [itemQty])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await window.gapi.client.calendar.events.list({
          'calendarId': calendarId,
          'timeMin': startDate(fromDate),
          'timeMax': endDate(toDate),
          'showDeleted': false,
          'singleEvents': true,
          'orderBy': 'startTime'
        })

        const artEvents = events.result.items.map((item) => {
          return {
            id: item.id,
            start: new Date(item.start.dateTime),
            end: new Date(item.end.dateTime),
            artistName: artist.name,
            type: item.summary === 'HOTM Booking' ? 'hotm' : 'private'
          }
        })
        setEvents(artEvents)
      } catch (err) {
        const errMessage = err.result.error.message
        alert(`Event fetch error: ${errMessage}`)
        console.log('Event fetch error: ', errMessage)
      }
    }
    
    //Artist is signed in to Google Calendar & with a valid calendar
    if (artistSignedIn && calendarId) 
      fetchEvents()

  }, [calendarId, fromDate, toDate])

  useEffect(() => {
    if (draftEvent) {
      setEvents([draftEvent])
      setDraftEvents(mergeThenSort([draftEvent], draftEvents))
    }
  }, [draftEvent])

  useEffect(() => {
    const events = draftEvents.filter(event => event.id !== draftEvent.id)
    setDraftEvents(events)
  }, [triggerDeleteEvent])

  const onSelectEvent = (event) => {
    if (event.type !== 'draft')
      return
    setDraftEvent(event)
    setTriggerEventForm(!triggerEventForm)
  }

  const onSaveEventDetails = (comment) => {
    setDraftEvent({...draftEvent, comment})
  }  

  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {

    if (event.type !== 'draft')
      return

    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    setEvents([updatedEvent])
    setDraftEvents(mergeThenSort([updatedEvent], draftEvents))
  }

  const resizeEvent = ({ event, start, end }) => {
    console.log(start, end)
    if (event.type !== 'draft' || start >= end)
      return

    const resized = {...event, start, end}
    setEvents([resized])
    setDraftEvents(mergeThenSort([resized], draftEvents))
  }

  const newEvent = (event) => {

    //Disable adding new event in month view
    if (event.slots.length === 1)
      return

      const newId = `draft-${draftId}`
      setDraftId(draftId + 1)
  
      const newEvent = {
      id: newId,
      type: 'draft',
      title: 'New Event',
      allDay: false,
      start: event.start,
      end: event.end,
      artistName: artist ? artist.name : '',
      comment: ''      
    }
    setEvents([newEvent])
    setDraftEvents(mergeThenSort([newEvent], draftEvents))
  }

  const onNavigate = (date, view) => {
    if (view === 'month') {
      const start = moment(date).startOf('month').startOf('week')._d
      const end = moment(date).endOf('month').endOf('week')._d
      if (start < fromDate)
        setFromDate(start)
      if (end > toDate)
        setToDate(end)      
    }

    if (view === 'day') {
      if (date < fromDate)
        setFromDate(date)
      if (date > toDate)
        setToDate(date)      
    }
  }

  const handleBook = () => {
    const callBack = (bookingId) => {  
      setTriggerSaveAllDrafts(!triggerSaveAllDrafts)
      alert('Booking successful! A deposit payment link has been sent to the client. Booking will be automatically cancelled if not paid within 12 hours.')
      setDraftEvents([])
      resetBooking()
    }

    let bookingData = {}
    
    const event = draftEvents[0]
    bookingData.client_id = client.id
    bookingData.artist_id_list = [artist.id]
    bookingData.services = Object.keys(itemQty).map(id => parseInt(id))
    bookingData.quantities = Object.values(itemQty)
    bookingData.booking_date = moment(event.start).format("YYYY-MM-DD")
    bookingData.booking_time = moment(event.start).format("HH:mm")
    bookingData.booking_end_time = moment(event.end).format("HH:mm")
    bookingData.with_organic = priceFactors.organic ? 1 : 0
    bookingData.with_pensioner_rate = priceFactors.pensionerRate ? 1 : 0
    bookingData.event_address = address
    bookingData.total_amount = bookingValue
    bookingData.comment = event.comment
    bookingData.booking_artist_name = artist.name
    //All fields below are redundant. They can be removed when API does not make them mandatory.
    bookingData.time_on_site = getDuration()
    bookingData.artist_start_time = bookingData.booking_time
    bookingData.travel_duration = 0
    bookingData.travel_distance = 0
    bookingData.payment_amount = 0
    bookingData.payment_type = 'deposit'

    addBooking(bookingData, BOOKING_TYPE.A, callBack)        
  }

  return (
    <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
      <Grid container justify="space-around" spacing={1}>
        <Grid item xs={12} md={4}>
          <LocationSearchInput address={address} changeAddr={(address) => {setAddress(address)}}/>  
          <div className={classes.padding}>
            <AddClient
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
            <ArtistBookingItems items={artistBookingItems} duration={getDuration()}/>
          </div>
          <div className={classes.padding2}>
            <div className={classes.grow} />
            <Button 
              variant="contained"
              onClick={handleBook}
              color="primary"
              disabled={draftEvents.length !== 1 || address === '' || client === null || Object.keys(itemQty).length === 0}
            >
              Book
            </Button>
            <div className={classes.grow} />
          </div>                    
          <div className={classes.padding}>
            <ServiceMenu services={services} artistBooking={true} />
          </div>
        </Grid>
        <Grid item xs={12} md={8}>                     
          <MyCalendar
            events={events}
            localizer={localizer}
            artist={artist}
            onSelectEvent={onSelectEvent}
            moveEvent={moveEvent}
            resizeEvent={resizeEvent}
            newEvent={newEvent}
            onNavigate={onNavigate}
            triggerSaveAllDrafts={triggerSaveAllDrafts}
            triggerDeleteEvent={triggerDeleteEvent}
            eventToDelete={draftEvent? draftEvent.id : null}
          />
        </Grid>
      </Grid>
      <EventForm 
        theme={theme}
        draftEvent={draftEvent}
        withLocation={false}
        withContact={false}
        withTask={false}
        triggerOpen={triggerEventForm}
        initOpen={false}
        onSaveEventDetails={onSaveEventDetails}
        onDeleteEvent={() => setTriggerDeleteEvent(!triggerDeleteEvent)}
      />      
    </Container>
  )
}

export default withRouter(ArtistBooking)