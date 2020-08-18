import React, { useEffect } from 'react'
import { startDate, endDate } from '../utils/misc'
import { mergeThenSort } from '../utils/eventFunctions'

const EventManager = ({
  artistSignedIn,
  artist,
  calendarId, 
  fromDate,
  toDate,
  setEvents,
  draftEvent,
  draftEvents,
  setDraftEvents,
  triggerDeleteEvent
}) => {
  
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

  return null
}

export default EventManager