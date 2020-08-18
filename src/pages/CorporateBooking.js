import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router-dom'
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
import AddCorporate from '../components/DropdownList'
import EventForm from '../components/EventForm'
import EventDrafts from '../components/EventDrafts'
import EventManager from '../components/EventManager'
import { onSelectEvent, resizeEvent, moveEvent, newEvent, onNavigate, onSaveEventDetails } from '../utils/eventFunctions'
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

const CorporateBooking = ({theme, artists, userEmail, artistSignedIn, addBooking}) => {
  const { corpCards, adminTasks } = useContext(BookingsStoreContext)
  const classes = useStyles(theme)
  const [artist, setArtist] = useState(null)
  const [booingArtistId, setBooingArtistId] = useState('')
  const [draftId, setDraftId] = useState(1)
  const [corporate, setCorporate] = useState(null)
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
  
  useEffect(() => {
    const theArtist = Object.values(artists).filter(artist => artist.email === userEmail)
    if (theArtist.length > 0) {
      setBooingArtistId(theArtist[0].id)
    }
  }, [])
  
  const handleBook = () => {

    const callBack = (bookingId) => {
      setTriggerSaveAllDrafts(!triggerSaveAllDrafts)
      alert('Booking successful!')
      setDraftEvents([])      
    }

    let bookingData = {}
    bookingData.booking_type = BOOKING_TYPE.C
    bookingData.card_or_client_id = corporate.id
    bookingData.booked_by_artist_id = booingArtistId

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
    addBooking(bookingData, BOOKING_TYPE.C, callBack)
  }

  return (
    <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
      <Grid container justify="space-around" spacing={1}>
        <Grid item xs={12} md={3}>
          <AddCorporate
            options={corpCards}
            disableClearable={true}
            id="corporate-list"
            label="Select corporate"
            placeholder="corporate"
            setTag={setCorporate}
            tag={corporate}
          />             
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
              corporate={true}
            />
          </div>
          <div className={classes.padding2}>
            <div className={classes.grow} />
            <Button 
              variant="contained" 
              onClick={handleBook} 
              color="primary" 
              disabled={draftEvents.length === 0 || artist === null || corporate === null}
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
            onSelectEvent={(event) => onSelectEvent(event, setDraftEvent, adminTasks, setTask, triggerEventForm, setTriggerEventForm)}
            moveEvent={({event, start, end}) => moveEvent(event, start, end, setEvents, draftEvents, setDraftEvents)}
            resizeEvent={({event, start, end}) => resizeEvent(event, start, end, setEvents, draftEvents, setDraftEvents)}
            newEvent={(event) => newEvent(event, draftId, setDraftId, setEvents, draftEvents, setDraftEvents, artist, task, corporate)}
            onNavigate={(date, view) => onNavigate(date, view, fromDate, setFromDate, toDate, setToDate)}
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
        onSaveEventDetails={(task, location, contact, comment) => onSaveEventDetails(task, location, contact, comment, draftEvent, setDraftEvent)}
        onDeleteEvent={() => setTriggerDeleteEvent(!triggerDeleteEvent)}
      />
      <EventManager
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
    </Container>
  )
}

export default withRouter(CorporateBooking)