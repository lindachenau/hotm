import React, { useState, useEffect, useContext } from 'react';
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
import { BookingsStoreContext } from '../components/BookingsStoreProvider'
import AddArtists from '../components/AddArtists'
import AddPackage from '../components/DropdownList'
import AddClient from '../components/AddClient'
import EventForm from '../components/EventForm'
import EventDrafts from '../components/EventDrafts'
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

const PackageBooking = ({theme, artists, userEmail, artistSignedIn, addBooking}) => {
  const { services, adminTasks } = useContext(BookingsStoreContext)
  const classes = useStyles(theme)
  const [packageList, setPackageList] = useState([])
  const [artist, setArtist] = useState(null)
  const [booingArtistId, setBooingArtistId] = useState('')
  const [draftId, setDraftId] = useState(1)
  const [bookingPackage, setBookingPackage] = useState(null)
  const [client, setClient] = useState(null)
  const [task, setTask] = useState(null)
  const [draftEvent, setDraftEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [draftEvents, setDraftEvents] = useState([])
  const today = new Date()
  const [fromDate, setFromDate] = useState(moment(today).startOf('month').startOf('week')._d)
  const [toDate, setToDate] = useState(moment(today).endOf('month').endOf('week')._d)
  const calendarId = artist ? artist.email : null
  const [triggerEventForm, setTriggerEventForm] = useState(false)
  const [triggerSaveAllDrafts, setTriggerSaveAllDrafts] = useState(false)
  const [triggerDeleteEvent, setTriggerDeleteEvent] = useState(false)
  
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
    if (theArtist.length > 0) {
      setBooingArtistId(theArtist[0].id)
    }
  }, [])  

  useEffect(() => {
    if (Object.keys(services).length > 0) {
      let list = []
      Object.values(services.items).forEach(item => {
        if (!item.onlineBooking)
          list.push({
            id: item.id,
            name: item.description
          })
      })

      setPackageList(list)
    }
  }, [services])

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
    setTask(adminTasks.filter(task => task.name === event.task)[0])
    setTriggerEventForm(!triggerEventForm)
  }

  const onSaveEventDetails = (task, location, contact, comment) => {
    setDraftEvent({...draftEvent, task: task, location, contact, comment})
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
      artistId: artist ? artist.id : '',
      task: task ? task.name : '',
      subject: bookingPackage ? bookingPackage.name : '',
      location: '',
      contact: client ? `${client.name} - ${client.phone}`: '',
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
    }

    let bookingData = {}
    bookingData.booking_type = BOOKING_TYPE.P
    bookingData.card_or_client_id = client.id
    bookingData.booked_by_artist_id = booingArtistId
    bookingData.service_item = bookingPackage.id

    let eventList = []
    draftEvents.forEach(draft => {
      const event = {
        artist_id: draft.artistId,
        event_location: draft.location,
        contact: draft.contact,
        job_description: draft.task,
        comment: draft.comment,
        booking_date: moment(draft.start).format("YYYY-MM-DD"),
        booking_start_time: moment(draft.start).format("HH:mm"),
        booking_end_time: moment(draft.end).format("HH:mm")
      }
      eventList.push(event)
    })

    bookingData.event_list = eventList
    addBooking(bookingData, BOOKING_TYPE.P, callBack)    
  }

  return (
    <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
      <Grid container justify="space-around" spacing={1}>
        <Grid item xs={12} md={3}>
          <AddPackage
            options={packageList}
            disableClearable={true}
            id="package-list"
            label="Package"
            placeholder="package"
            setTag={setBookingPackage}
            tag={bookingPackage}
          />
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
            <EventDrafts
              theme={theme}
              items={draftEvents}
              corporate={false}
            />
          </div>
          <div className={classes.padding2}>
            <div className={classes.grow} />
            <Button 
              variant="contained" 
              onClick={handleBook} 
              color="primary"
              disabled={draftEvents.length === 0 || bookingPackage === null || artist === null}
            >
              Book all drafts
            </Button>
            <div className={classes.grow} />
          </div>          
        </Grid>
        <Grid item xs={12} md={9}>                     
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
        triggerOpen={triggerEventForm}
        initOpen={false}
        taskList={adminTasks}
        task={task}
        setTask={setTask}
        onSaveEventDetails={onSaveEventDetails}
        onDeleteEvent={() => setTriggerDeleteEvent(!triggerDeleteEvent)}
      />
    </Container>
  )
}

export default withRouter(PackageBooking)