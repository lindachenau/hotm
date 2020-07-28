import React, { useState, useEffect } from 'react'
import { MonthEvent, DayEvent } from './Event'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import { FaCalendarAlt, FaCalendarDay, FaChevronLeft, FaChevronRight, FaRegCalendarCheck } from "react-icons/fa"
import { GoTasklist } from "react-icons/go"
import { mergeArrays } from '../utils/arrays'

const DragAndDropCalendar = withDragAndDrop(Calendar)


const components = {
  month: {event: MonthEvent},
  day: {event: DayEvent}
}

const MyCalendar = ({
  events, 
  localizer, 
  artist, 
  onSelectEvent,
  moveEvent,
  resizeEvent,
  newEvent,
  triggerSaveAllDrafts, 
  triggerDeleteEvent, 
  eventToDelete
}) => {
  const [localEvents, setLocalEvents] = useState(events)
  const eventColors = {
    'hotm': '#f18383',
    'private': '#73f',
    'draft': '#037'
  }



  useEffect(() => {
    setLocalEvents(mergeArrays(events, localEvents))
  }, [events])

  useEffect(() => {
    const drafts = localEvents.filter(event => event.type === "draft")
    const savedDrafts = drafts.map(draft => {return {...draft, type: "hotm"}})
    setLocalEvents(mergeArrays(savedDrafts, localEvents))
  }, [triggerSaveAllDrafts])

  useEffect(() => {
    const events = localEvents.filter(event => event.id !== eventToDelete)
    setLocalEvents(events)
  }, [triggerDeleteEvent])

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
      onSelectEvent={onSelectEvent}
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