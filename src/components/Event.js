import React from 'react'
import moment from 'moment'
import { FaUserAlt, FaMapMarkerAlt, FaPhoneSquare, FaDollarSign } from "react-icons/fa"

export function MonthEvent ({ event }) {
  return (
    <div className='rbc-event-label'>
      <span>{ `${moment(event.start).format('LT')} – ${moment(event.end).format('LT')} ` }</span>
      {event.total && 
      <>
        <FaDollarSign/>
        <span>{ `${event.total} ` }</span>
      </>}
      {event.artistName && <span>{ event.artistName}</span>}
    </div>
  )
}

export function DayEvent ({ event }) {
  return (
    <div className='rbc-event-label'>
      {event.address &&
      <>
        <FaMapMarkerAlt/><span>{ event.address }</span>
      </>}
      {event.client &&
      <>
        <FaUserAlt/>
        <span>{ `${event.client.name} ` }</span>
        <FaPhoneSquare/>
        <span>{ `${event.client.phone} ` }</span>
      </>}
      {event.total && 
      <>
        <FaDollarSign/>
        <span>{ `${event.total} ` }</span>
      </>}
        {event.artistName && <span>{`${event.artistName} `}</span>}
        {event.task && <span>{ event.task}</span>}
        {event.serviceItems && event.serviceItems.map( item => <div>{ item }</div> )}
    </div>
  )
}
