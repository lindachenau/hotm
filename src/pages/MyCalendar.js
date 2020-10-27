import React, { useState, useEffect } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import TheCalendar from '../components/TheCalendar'
import 'react-big-calendar/lib/sass/styles.scss'
import '../components/CalendarToolbar.css'
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import axios from "axios"
import Container from '@material-ui/core/Container'
import EventManager from '../components/EventManager'
import { onNavigate } from '../utils/eventFunctions'
import { booking_events_url } from '../config/dataLinks' 
import { localDate, getEvents } from '../utils/dataFormatter'
import CheckoutForm from '../components/CheckoutForm'

const localizer = momentLocalizer(moment)

const MyCalendar = ({theme, userEmail, artistSignedIn, updateBooking, getClient, client, artists, services, bookingEvent, setBookingEvent}) => {
  const [events, setEvents] = useState([])
  /*
   * today is passed to date prop of DragAndDropCalendar which is used as current date to open the calendar.
   * We initialise today to 'today' in booking creation and the first event date in booking editing.
   * today will be updated whenever onNavigate is called so that Calendar can track date correctly.
  */
  const [today, setToday] = useState(new Date())
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [triggerCheckoutForm, setTriggerCheckoutForm] = useState(false)
  const [browsing, setBrowsing] = useState(true)
  const [location] = useState({
    pathname: '/therapist-booking',
    state: {checkout : true}
  })

  const calendarId = userEmail
  
  useEffect(() => {
    setFromDate(moment(today).startOf('month').startOf('week')._d)
    setToDate(moment(today).endOf('month').endOf('week')._d)
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, [])

  const onSelectEvent = async (event) => {
    if (event.type !== 'hotm')
      return

    try {
      const url = `${booking_events_url}?gcal_event_id=${event.id.slice(0, 26)}`
      const config = {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        url: url
      }

      const bookingEvent = (await axios(config)).data

      if (bookingEvent.admin_booking_id) {
        setBookingEvent({
          adminBooking: true,
          id: bookingEvent.admin_booking_id,
          eventId: bookingEvent.event_id,
          start: localDate(bookingEvent.booking_date, bookingEvent.booking_start_time),
          end: localDate(bookingEvent.booking_date, bookingEvent.booking_end_time),
          address: bookingEvent.event_location,
          task: bookingEvent.job_description,
          contact: bookingEvent.contact,
          comment: bookingEvent.comment,
          status: bookingEvent.status,
          actualStart: bookingEvent.status === 'checkout' ? localDate(bookingEvent.booking_date, bookingEvent.actual_start_time) : null,
          actualEnd: bookingEvent.status === 'checkout' ? localDate(bookingEvent.booking_date, bookingEvent.actual_end_time) : null
        })
        setTriggerCheckoutForm(!triggerCheckoutForm)
      } else {
        //Open the checkout form first before the client is fetched. Client query is very slow
        const events = getEvents([bookingEvent], artists, {}, services.items)
        const event = events[0]
        event.adminBooking = false
        event.contact = ''
        setBookingEvent(event)
        setTriggerCheckoutForm(!triggerCheckoutForm)
  
        //Fetch the client in the background
        await getClient(bookingEvent.client_id)
      }
      
    } catch (err) {
      console.log('Booking event fetch error: ', err)
    }
  }

  useEffect(() => {
    //Client is fetched. Update the contact now in Checkout form.
    if (Object.keys(client).length) {
      const contact = `${client.name} ${client.phone}`
      setBookingEvent(Object.assign({}, bookingEvent, {
        client: client,
        contact: contact
      }))
    }
}, [client])

  return (
    <>
      {browsing ?
      <Container maxWidth='xl' style={{paddingTop: 10, paddingLeft: 10, paddingRight: 10}}>
        <TheCalendar
          events={events}
          localizer={localizer}
          defaultDate={today}
          onSelectEvent={onSelectEvent}
          moveEvent={null}
          resizeEvent={null}
          newEvent={null}
          onNavigate={(date, view) => onNavigate(date, view, setFromDate, setToDate, setToday)}
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
        <CheckoutForm
          event={bookingEvent}
          triggerOpen={triggerCheckoutForm}
          initOpen={false}
          updateBooking={updateBooking}
          setBrowsing={setBrowsing}
        />
      </Container>
      :
      <Redirect to={location} />}
    </>  
  )
}

export default withRouter(MyCalendar)