import React, { useState, useEffect } from 'react'
import { MonthEvent, WeekEvent, DayEvent } from './Event'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import { FaCalendarAlt, FaCalendarWeek, FaCalendarDay, FaChevronLeft, FaChevronRight, FaRegCalendarCheck } from "react-icons/fa"
import { GoTasklist } from "react-icons/go"
import { mergeArrays } from '../utils/misc'

const DragAndDropCalendar = withDragAndDrop(Calendar)


const components = {
  month: {event: MonthEvent},
  week: {event: WeekEvent},
  day: {event: DayEvent}
}

const TheCalendar = ({
  events, 
  localizer, 
  defaultDate, 
  onSelectEvent,
  moveEvent,
  resizeEvent,
  newEvent,
  onNavigate,
  onView,
  triggerSaveAllDrafts, 
  triggerDeleteEvent, 
  eventToDelete
}) => {
  const [localEvents, setLocalEvents] = useState(events)
  const eventColors = {
    'hotm': '#e382b1',
    'private': '#917dab',
    'draft': '#325f9c'
  }

  useEffect(() => {
    setLocalEvents(mergeArrays(events, localEvents))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events])

  useEffect(() => {
    const drafts = localEvents.filter(event => event.type === "draft")
    const savedDrafts = drafts.map(draft => {return {...draft, type: "hotm"}})
    setLocalEvents(mergeArrays(savedDrafts, localEvents))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSaveAllDrafts])

  useEffect(() => {
    const events = localEvents.filter(event => event.id !== eventToDelete)
    setLocalEvents(events)
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      onNavigate={onNavigate}
      onView={onView}
      views={['month', 'week', 'day']}
      defaultView={Views.WEEK}
      date={defaultDate}
      min={new Date(2020, 1, 1, 6)}
      max={new Date(2020, 1, 1, 20)}
      scrollToTime={new Date(2020, 1, 1, 6)}
      messages={{
        month: <FaCalendarAlt />, 
        week: <FaCalendarWeek />, 
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

export default TheCalendar