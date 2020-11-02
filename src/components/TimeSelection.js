import React, { useState, useEffect } from 'react'
import TheCalendar from './TheCalendar'
import 'react-big-calendar/lib/sass/styles.scss'
import '../components/CalendarToolbar.css'
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import InfoIcon from '@material-ui/icons/Info'
import CheckIcon from '@material-ui/icons/Check'
import HelpIcon from '@material-ui/icons/Help'
import Button from '@material-ui/core/Button'
import EventManager from './EventManager'
import EventForm from '../components/EventForm'
import { moveEvent, onNavigate, onSaveEventDetails, mergeThenSort } from '../utils/eventFunctions'
import { validateClientBooking } from '../utils/misc'

const localizer = momentLocalizer(moment)

const TimeSelection = ({changeBookingStage, services, itemQty, pensionerRate, travelTime=30, calendarId, offDays, bookingDateAddr, submitBooking, theme}) => {
  const useStyles = makeStyles(theme => ({
    flex: {
      display: 'flex',
      marginTop: 10
    },
    grow: {
      flexGrow: 1,
    }
  }))
  
  const classes = useStyles()
  const [events, setEvents] = useState([])
  const [today, setToday] = useState(new Date())
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [draftId, setDraftId] = useState(1)
  const [duration, setDuration] = useState(60)
  const [draftEvent, setDraftEvent] = useState(null)
  const [draftEvents, setDraftEvents] = useState([])
  const [triggerEventForm, setTriggerEventForm] = useState(false)
  const [triggerDeleteEvent, setTriggerDeleteEvent] = useState(false)
  const [saveModified, setSaveModified] = useState(false)
  const [slots, setSlots] = useState([])
  const bookingAddr = bookingDateAddr.bookingAddr
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  const getDuration = () => {
    let duration = 0
    const items = services.items
    for (let id of Object.keys(itemQty)) {
      let qty = itemQty[id]
      duration += items[id].timeOnsite * qty
    }
    return duration
  }

  useEffect(() => {
    setDuration(getDuration())

    if (bookingDateAddr.bookingDate) {
      const today = bookingDateAddr.bookingDate
      setToday(today)
      setFromDate(moment(today).startOf('month').startOf('week')._d)
      setToDate(moment(today).endOf('month').endOf('week')._d)
  
      const newEvent = {
        id: 'draft-1',
        type: 'draft',
        title: 'New Event',
        allDay: false,
        start: bookingDateAddr.artistStart,
        bookingTime: today,
        end: bookingDateAddr.bookingEnd,
        comment: ''
      }
      setEvents([newEvent])
      setDraftEvents([newEvent])  
    } else {
      setFromDate(moment(today).startOf('month').startOf('week')._d)
      setToDate(moment(today).endOf('month').endOf('week')._d)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [])

  useEffect(() => {
    setDraftEvent(null)
  }, [triggerDeleteEvent])

  useEffect(() => {
    if (events.length > 0 && events[0].type !== 'draft')
      slots2CheckConflicts(mergeThenSort(slots, events))
  }, [events])

  const onSelectEvent = (event) => {
    if (event.type !== 'draft')
      return
    setDraftEvent(event)
    setTriggerEventForm(!triggerEventForm)
  }

  const slots2CheckConflicts = (events) => {
    setSlots(events.map(event => { return {
      start: event.start,
      end: event.end
    }}))
  }

  const newEvent = (event) => {

    //Disable adding new event in month view
    if (event.slots.length === 1)
      return

    if (draftEvents.length === 1) {
      alert('Only one booking event is allowed.')
      return
    }

    const newId = `draft-${draftId}`
    setDraftId(draftId + 1)

    const bookingTime = event.start.getTime()
    const newEvent = {
      id: newId,
      type: 'draft',
      title: 'New Event',
      allDay: false,
      start: new Date(bookingTime - travelTime * 60 * 1000),
      bookingTime: event.start,
      end: new Date(bookingTime + duration * 60 * 1000),
      comment: ''
    }
    setEvents([newEvent])
    setDraftEvents([newEvent])
  }

  const checkConflicts = (start, end) => {
    const startTick = start.getTime()
    const endTick = end.getTime()
    for (let i = 0; i < slots.length; i++) {
      const slotStart = slots[i].start.getTime()
      const slotEnd = slots[i].end.getTime()
      if (endTick >= slotStart && startTick <= slotEnd)
        return true
    }

    return false
  }

  const handleNext = async () => {
    const theEvent = draftEvents[0]
    submitBooking(theEvent.start, theEvent.bookingTime, theEvent.end, bookingAddr)

    const { valid, reason } = await validateClientBooking(pensionerRate, theEvent.bookingTime)
    if (!valid) {
      alert(reason)
      return
    }

    if (checkConflicts(theEvent.start, theEvent.end)) {
      alert("Your appointment conflicts with the therapist's existing events. Please move it to avoid conflicts.")
      return
    }
           
    changeBookingStage(2)
  }

  const handleBack = () => {
    const theEvent = draftEvents[0]
    if (theEvent)
      submitBooking(theEvent.start, theEvent.bookingTime, theEvent.end, bookingAddr)
    changeBookingStage(0)
  }

  return (
    <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
      <Grid container justify="space-around" spacing={1}>
        <Grid item xs={12} md={3}>
          <List component="nav">
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary={`The service takes ${duration} minutes.`} />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="Click on an available time slot to book your appointment. 
                  An event, in blue colour, including the therapist travel time and 
                  your appointment time will be generated automatically." />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary="The event must start between 8am to 6pm and not overlap with the therapist's existing events." />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary="If conflict, move the event by dragging or open the event edit box to change start time." />
            </ListItem>            
          </List>
          <div className={classes.flex}>
            <Button variant="text" color="primary" size='large' onClick={handleBack}>
              back
            </Button>
            <div className={classes.grow} />
            <Button variant="text" color="primary" size='large' onClick={handleNext} disabled={draftEvents[0] === undefined}>
              Next
            </Button>
          </div>          
        </Grid>
        <Grid item xs={12} md={9}>
          <TheCalendar
            events={events}
            localizer={localizer}
            defaultDate={today}
            onSelectEvent={onSelectEvent}
            moveEvent={({event, start, end}) => moveEvent(event, start, end, setEvents, draftEvents, setDraftEvents)}
            resizeEvent={null}
            newEvent={newEvent}
            onNavigate={(date, view) => onNavigate(date, view, setFromDate, setToDate, setToday)}
            triggerSaveAllDrafts={null}
            triggerDeleteEvent={triggerDeleteEvent}
            eventToDelete={draftEvent? draftEvent.id : null}
          />
        </Grid>
      </Grid>
      <EventForm 
        theme={theme}
        mode='book'
        draftEvent={draftEvent}
        withLocation={false}
        withContact={false}
        withTask={false}
        withTravelTime={false}
        withDuration={false}
        withComment={false}
        triggerOpen={triggerEventForm}
        initOpen={false}
        onSaveEventDetails={(task, address, contact, comment, start, bookingTime, end) => 
          onSaveEventDetails(task, address, contact, comment, start, bookingTime, end, draftEvent, setDraftEvent)}
        onDeleteEvent={() => setTriggerDeleteEvent(!triggerDeleteEvent)}
      />      
      <EventManager
        mode='book'
        saveModified={saveModified}
        setSaveModified={setSaveModified}
        artistSignedIn={false}
        artist={null}
        offDays={offDays}
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

export default TimeSelection