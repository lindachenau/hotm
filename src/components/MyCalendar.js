import React, {useState} from 'react'
import { MonthEvent, DayEvent } from './Event'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import { FaCalendarAlt, FaCalendarDay, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { GoTasklist } from "react-icons/go"

const DragAndDropCalendar = withDragAndDrop(Calendar)


const components = {
  month: {event: MonthEvent},
  day: {event: DayEvent}
}

const MyCalendar = ({events, localizer}) => {
  const [localEvents, setLocalEvents] = useState(events)

  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {

    const idx = localEvents.indexOf(event)
  
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)
    console.log(nextEvents)
    setLocalEvents(nextEvents)
  
    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  const resizeEvent = ({ event, start, end }) => {
  
    const nextEvents = localEvents.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    setLocalEvents(nextEvents)
  
    //alert(`${event.title} was resized to ${start}-${end}`)
  }

  const newEvent = (event) => {
    let newId = 1
    if (localEvents.length > 0) {
      let idList = localEvents.map(a => a.id)
      newId = Math.max(...idList) + 1
    }

    let hour = {
      id: newId,
      status: 2,
      title: 'New Event',
      allDay: event.slots.length == 1,
      start: event.start,
      end: event.end,
    }
    setLocalEvents(localEvents.concat([hour]))
  }

  return (
    <DragAndDropCalendar
      style={{height: '95vh', width: '100%', margin: 'auto'}}
      popup={true}
      localizer={localizer}
      events={localEvents}
      components={components}
      selectable
      onEventDrop={moveEvent}
      resizable
      onEventResize={resizeEvent}
      onSelectSlot={newEvent}
      onDragStart={console.log}
      views={['month', 'day']}
      defaultView={Views.MONTH}
      defaultDate={new Date()}
      scrollToTime={new Date(2019, 1, 1, 6)}
      messages={{
        month: <FaCalendarAlt />, 
        day: <FaCalendarDay />,
        previous: <FaChevronLeft />,
        next: <FaChevronRight />,
        showMore: total => (
          <>
            {`+${total} `}
            <GoTasklist />
          </>
        ),
        noEventsInRange: 'There are no bookings in this range.'
      }}
    />
  )
}

export default MyCalendar