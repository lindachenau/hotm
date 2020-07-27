import React, { useState, useEffect } from 'react'
import { MonthEvent, DayEvent } from './Event'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import { FaCalendarAlt, FaCalendarDay, FaChevronLeft, FaChevronRight, FaRegCalendarCheck } from "react-icons/fa"
import { GoTasklist } from "react-icons/go"

const DragAndDropCalendar = withDragAndDrop(Calendar)


const components = {
  month: {event: MonthEvent},
  day: {event: DayEvent}
}

const MyCalendar = ({events, localizer, artist, onSelectEvent}) => {
  const [localEvents, setLocalEvents] = useState(events)
  const [draftId, setDraftId] = useState(1)
  const eventColors = {
    'hotm': '#f18383',
    'private': '#73f',
    'draft': '#037'
  }

  const mergeArrays = (arr1, arr2) => {
    let merged = []
    const arr = arr1.concat(arr2)
    let assoc = {}

    arr.forEach((item) => {
      const id = item.id
      if (!assoc[id]) {
        merged.push(item)
        assoc[id] = true
      }
    })

    return merged
  }

  useEffect(() => {
    setLocalEvents(mergeArrays(events, localEvents))
  }, [events])

  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {

    if (event.type !== 'draft')
     return

    const idx = localEvents.indexOf(event)
  
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...localEvents]
    nextEvents.splice(idx, 1, updatedEvent)
    setLocalEvents(nextEvents)
  
    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  const resizeEvent = ({ event, start, end }) => {
    
    if (event.type !== 'draft')
      return
  
    const nextEvents = localEvents.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    setLocalEvents(nextEvents)
  
    //alert(`${event.title} was resized to ${start}-${end}`)
  }

  const newEvent = (event) => {

    //Disable adding new event in month view
    if (event.slots.length === 1)
      return

    const newId = `draft-${draftId}`
    setDraftId(draftId + 1)

    let hour = {
      id: newId,
      type: 'draft',
      title: 'New Event',
      allDay: false,
      start: event.start,
      end: event.end,
      artistNames: artist ? artist.name : ''
    }
    setLocalEvents(localEvents.concat([hour]))
  }

  return (
    <DragAndDropCalendar
      style={{height: '80vh', width: '100%', margin: 'auto'}}
      popup={true}
      localizer={localizer}
      events={localEvents}
      components={components}
      onEventDrop={moveEvent}
      resizable
      onEventResize={resizeEvent}
      selectable
      onSelectSlot={newEvent}
      onSelectEvent={(event) => onSelectEvent(event)}
      views={['month', 'day']}
      defaultView={Views.MONTH}
      defaultDate={new Date()}
      scrollToTime={new Date(2019, 1, 1, 6)}
      messages={{
        month: <FaCalendarAlt />, 
        day: <FaCalendarDay />,
        previous: <FaChevronLeft />,
        next: <FaChevronRight />,
        today: <FaRegCalendarCheck />,
        showMore: total => (
          <>
            {`+${total} `}
            <GoTasklist />
          </>
        ),
        noEventsInRange: 'There are no bookings in this range.'
      }}
      eventPropGetter={event => {
        return {
          style: {
            backgroundColor: eventColors[event.type]
          }
        }
      }}
    />
  )
}

export default MyCalendar