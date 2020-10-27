import React from 'react'
import moment from 'moment'
import { FaUserAlt, FaMapMarkerAlt, FaPhoneSquare, FaUserCog, FaCog, FaClock } from "react-icons/fa"

export function MonthEvent ({ event }) {
  return (
    <div className='rbc-event-label'>
      <span>{ `${moment(event.start).format('LT')} – ${moment(event.end).format('LT')} ` }</span>
      {event.artistName && <span>{ event.artistName}</span>}
    </div>
  )
}

export function WeekEvent ({ event }) {
  return (
    <div className='rbc-event-label'>
      {event.bookingTime &&
      <>
        <FaClock/><span>{ ` ${moment(event.bookingTime).format('LT')} ` }</span>
      </>}
      {event.address &&
      <>
        <FaMapMarkerAlt/><span>{ ` ${event.address}  ` }</span>
      </>}
      {event.client &&
      <>
        <FaUserAlt/>
        <span>{ ` ${event.client.name}  ` }</span>
        <FaPhoneSquare/>
        <span>{ `${event.client.phone}  ` }</span>
      </>}
      {event.artistName && 
      <>
        <FaUserCog/><span>{` ${event.artistName}  `}</span>
      </>}
    </div>
  )
}

export function DayEvent ({ event }) {
  return (
    <div className='rbc-event-label'>
      {event.bookingTime &&
      <>
        <FaClock/><span>{ ` ${moment(event.bookingTime).format('LT')} ` }</span>
      </>}
      {event.address &&
      <>
        <FaMapMarkerAlt/><span>{ ` ${event.address}  ` }</span>
      </>}
      {event.client &&
      <>
        <FaUserAlt/>
        <span>{ ` ${event.client.name}  ` }</span>
        <FaPhoneSquare/>
        <span>{ `${event.client.phone}  ` }</span>
      </>}
      {event.artistName && 
      <>
        <FaUserCog/><span>{` ${event.artistName}  `}</span>
      </>}
      {event.task && 
      <>
        <FaCog/><span>{` ${event.task}`}</span>
      </>}
    </div>
  )
}
