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
import EventManager from '../components/EventManager'
import { onSelectEvent, resizeEvent, moveEvent, onNavigate } from '../utils/eventFunctions'

const localizer = momentLocalizer(moment)

const MyCalendar = ({theme, userEmail, artistSignedIn}) => {
  const [events, setEvents] = useState([])
  /*
   * today is passed to date prop of DragAndDropCalendar which is used as current date to open the calendar.
   * We initialise today to 'today' in booking creation and the first event date in booking editing.
   * today will be updated whenever onNavigate is called so that Calendar can track date correctly.
  */
  const [today, setToday] = useState(new Date())
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const calendarId = userEmail
  
  useEffect(() => {
    setFromDate(moment(today).startOf('month').startOf('week')._d)
    setToDate(moment(today).endOf('month').endOf('week')._d)
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [])

  return (
    <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
      <TheCalendar
        events={events}
        localizer={localizer}
        defaultDate={today}
        onSelectEvent={(event) => onSelectEvent(event, null, [], null, null, null)}
        moveEvent={({event, start, end}) => moveEvent(event, start, end, setEvents, [], null)}
        resizeEvent={({event, start, end}) => resizeEvent(event, start, end, setEvents, [], null)}
        newEvent={null}
        onNavigate={(date, view) => onNavigate(date, view, fromDate, setFromDate, toDate, setToDate, setToday)}
        triggerSaveAllDrafts={null}
        triggerDeleteEvent={null}
        eventToDelete={null}
      />
      <EventManager
        mode={null}
        saveModified={null}
        setSaveModified={null}
        artistSignedIn={artistSignedIn}
        artist={null}
        calendarId={calendarId}
        fromDate={fromDate}
        toDate={toDate}
        setEvents={setEvents}
        draftEvent={null}
        draftEvents={[]}
        setDraftEvents={null}     
        triggerDeleteEvent={null}
      />
    </Container>
  )
}

export default withRouter(MyCalendar)