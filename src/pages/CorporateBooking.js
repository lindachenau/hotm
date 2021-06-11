import React, { useState, useEffect, useContext } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import TheCalendar from '../components/TheCalendar'
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
import { mergeThenSort, onSelectEvent, resizeEvent, moveEvent, onNavigate, onView, onSaveEventDetails, noEvents } from '../utils/eventFunctions'
import { BOOKING_TYPE, PUT_OPERATION } from '../actions/bookingCreator'
import { localDate } from '../utils/dataFormatter'
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

const CorporateBooking = ({location, theme, adminBooking, artists, userEmail, artistSignedIn, addBooking, updateBooking}) => {
  /*
   * events: "events" for passing to TheCalendar which will merge "events" from props to its local "events". setEvents is called @ newEvent
   *         moveEvent, resizeEvent, onSaveEventDetails, onNavigate and admin booking retrieval
   *
   * draftEvent: a synthetic "event" for passing to a pop-up onSelectEvent. setDraftEvent is called @ onSelectEvent, onSaveEventDetails
   * 
   * draftEvents: a collection of draft "events" for booking/updating/deleting. setDraftEvents is called @ newEvent
   *              moveEvent, resizeEvent, onSaveEventDetails to merge in the modified event. setDraftEvents is called @ onDeleteEvent
   *              to remove the deleted event
   */
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
  /*
   * today is passed to date prop of DragAndDropCalendar which is used as current date to open the calendar.
   * We initialise today to 'today' in booking creation and the first event date in booking editing.
   * today will be updated whenever onNavigate is called so that Calendar can track date correctly.
  */
  const [today, setToday] = useState(new Date())
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const calendarId = artist ? artist.email : null
  const [triggerEventForm, setTriggerEventForm] = useState(false)
  const [triggerSaveAllDrafts, setTriggerSaveAllDrafts] = useState(false)
  const [triggerDeleteEvent, setTriggerDeleteEvent] = useState(false)
  const [prevArtist, setPrevArtist] = useState(null)
  const [triggerDeleteArtist, setTriggerDeleteArtist] = useState(false)
  const [artistToDelete, setArtistToDelete] = useState(null)
  // This component has 2 modes of operations - book and edit. edit is redirected from "Manage bookings".
  const [mode, setMode] = useState('book')
  const [saveModified, setSaveModified] = useState(false)
  const [browsing, setBrowsing] = useState(false)
  const { bookingsData } = useContext(BookingsStoreContext)
  const { bookingInProgress } = bookingsData
  
  useEffect(() => {
    const theArtist = Object.values(artists).filter(artist => artist.email === userEmail)
    if (theArtist.length > 0) {
      setBooingArtistId(theArtist[0].id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [])

  useEffect(() => {
    if (location.state) {
      // Open Calendar to the first event date in booking editing
      const bookingDate = new Date(adminBooking.origEventList[0].booking_date)
      setToday(bookingDate)
      // For default monthly view
      // setFromDate(moment(bookingDate).startOf('month').startOf('week')._d)
      // setToDate(moment(bookingDate).endOf('month').endOf('week')._d)      
      setFromDate(moment(bookingDate).startOf('week')._d)
      setToDate(moment(bookingDate).endOf('week')._d)      

      if (location.state.edit)
        setMode('edit')
    } else {
      // For default monthly view
      // setFromDate(moment(today).startOf('month').startOf('week')._d)
      // setToDate(moment(today).endOf('month').endOf('week')._d)
      //For default weekly view
      setFromDate(moment(today).startOf('week')._d)
      setToDate(moment(today).endOf('week')._d)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [])

  useEffect(() => {
    //The selected artist has been explicitly removed. Send a trigger to remove all events of the removed artist.
    if (prevArtist && artist === null) {
      setTriggerDeleteArtist(!triggerDeleteArtist)
      setArtistToDelete(prevArtist.id)
    }

    setPrevArtist(artist)
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [artist])

  useEffect(() => {
    if (mode !== 'book') {
      setCorporate(corpCards.filter(card => card.id === adminBooking.cId)[0])
      let events = []
      adminBooking.origEventList.forEach((event) => {
        const entry = {
          id: event.event_id,
          type: 'draft',
          title: 'HBLC Booking',
          allDay: false,
          start: localDate(event.booking_date, event.artist_start_time),
          bookingTime: localDate(event.booking_date, event.booking_start_time),
          end: localDate(event.booking_date, event.booking_end_time),
          artistName: artists[event.artist_id].name,
          artistId: artists[event.artist_id].id,
          task: event.job_description,
          subject: adminBooking.title,      
          address: event.event_location,
          contact: event.contact,
          comment: event.comment            
        }
        events.push(entry)
      })
      setEvents(events)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [mode])

  const newEvent = (event) => {

    //Disable adding new event in month view and before artist and corporate selection
    if (event.slots.length === 1)
      return

    //Disable adding new event before artist and corporate selection
    if (artist === null || corporate === null) {
      alert('Select therapist and corporate before creating an event.')
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
      artistName: artist.name,
      artistId: artist.id,
      task: task ? task.name : '',
      subject: corporate.name,      
      address: corporate.address,
      contact: `${corporate.contactPerson} - ${corporate.contactPhone}`,
      comment: ''      
    }
    setEvents([newEvent])
    setDraftEvents(mergeThenSort([newEvent], draftEvents))
  }

  const handleBack = () => {
    setBrowsing(true)
  }
  
  const handleBook = () => {

    const callBack = (bookingId) => {
      const message = mode === 'book' ? 'Booking successful!' : 'Updating successful'      
      setTriggerSaveAllDrafts(!triggerSaveAllDrafts)
      alert(message)
      setDraftEvents([])
      if (mode === 'edit')
        setBrowsing(true)     
    }

    let bookingData = {}
    bookingData.booking_type = BOOKING_TYPE.C
    bookingData.card_or_client_id = corporate.id
    bookingData.booking_artist_id = booingArtistId
    
    let eventList = []
    draftEvents.forEach(draft => {
      const existingEvent = !draft.id.toString().includes('draft')
      let event = {}
      if (draft.toBeDeleted && existingEvent) {
        event.event_id = draft.id
        event.operation = PUT_OPERATION.DELETE
      } else {
        event.artist_id = draft.artistId
        event.event_location = draft.address
        event.contact = draft.contact
        event.job_description = draft.task
        event.comment = draft.comment
        event.booking_date = moment(draft.start).format("YYYY-MM-DD")
        event.artist_start_time = moment(draft.start).format("HH:mm")
        event.booking_start_time = moment(draft.bookingTime).format("HH:mm")
        event.booking_end_time = moment(draft.end).format("HH:mm")

        if (existingEvent) {
          event.event_id = draft.id
          event.operation = PUT_OPERATION.UPDATE
        } 
      }
      eventList.push(event)
    })

    bookingData.event_list = eventList

    if (mode === 'book') {
      addBooking(bookingData, BOOKING_TYPE.C, callBack)
    } else {
      bookingData.booking_id = adminBooking.id
      bookingData.operation = PUT_OPERATION.UPDATE
      updateBooking(bookingData, BOOKING_TYPE.C, callBack)
    }
  }

  return (
    <>
    {browsing ?
      <Redirect to={'/manage-bookings'} />
      :
      <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
        <Grid container justify="space-around" spacing={1}>
          <Grid item xs={12} md={3}>
            <AddCorporate
              disabled={mode !== 'book'}
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
                label="Select therapist"
              />
            </div>
            <div className={classes.padding}>
              <EventDrafts
                theme={theme}
                items={draftEvents}
                corporate={true}
              />
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
                  disabled={noEvents(mode, adminBooking, draftEvents) || corporate === null}
                >
                  {mode === 'book' ? 'Book all drafts' : 'Save modified drafts'}
                </Button>
            </div>}         
          </Grid>
          <Grid item xs={12} md={9}>                     
            <TheCalendar
              events={events}
              localizer={localizer}
              defaultDate={today}
              onSelectEvent={(event) => onSelectEvent(event, setDraftEvent, adminTasks, setTask, triggerEventForm, setTriggerEventForm)}
              moveEvent={({event, start, end}) => moveEvent(event, start, end, setEvents, draftEvents, setDraftEvents)}
              resizeEvent={({event, start, end}) => resizeEvent(event, start, end, setEvents, draftEvents, setDraftEvents)}
              newEvent={newEvent}
              onNavigate={(date, view) => onNavigate(date, view, setFromDate, setToDate, setToday)}
              onView={(view) => onView(view, setFromDate, setToDate, today)}
              triggerSaveAllDrafts={triggerSaveAllDrafts}
              triggerDeleteEvent={triggerDeleteEvent}
              eventToDelete={draftEvent? draftEvent.id : null}
              triggerDeleteArtist={triggerDeleteArtist}
              artistToDelete={artistToDelete}
            />
          </Grid>
        </Grid>
        <EventForm 
          theme={theme}
          mode={mode}
          setSaveModified={setSaveModified}
          draftEvent={draftEvent}
          triggerOpen={triggerEventForm}
          taskList={adminTasks}
          task={task}
          setTask={setTask}
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
          offDays={artist ? artist.offDays : []}
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

export default withRouter(CorporateBooking)