import React from 'react'
import moment from 'moment'
import { FaUserAlt, FaMapMarkerAlt, FaPhoneSquare, FaDollarSign } from "react-icons/fa"
/**
 * 
 * event display for Month view in mobile devices 
 */
export function MonthEvent ({ event }) {
  return (
    <div className='rbc-event-label'>
      <span>{ `${moment(event.start).format('LT')} – ${moment(event.end).format('LT')} ` }</span>
      <FaDollarSign/>
      <span>{ `${event.total} ` }</span>
      <span>{ event.artistNames}</span>
    </div>
  )
}

export function DayEvent ({ event }) {
  return (
    <div className='rbc-event-label'>
      <>
        <FaMapMarkerAlt/><span>{ event.address }</span>
      </>
      <>
        <FaUserAlt/> 
        <span>{ `${event.client.name} ` }</span> 
        <FaPhoneSquare/>
        <span>{ `${event.client.phone} ` }</span>
      </>
      <>
        <FaDollarSign/>
        <span>{ `${event.total} ` }</span>
        <span>{ event.artistNames}</span>
        {event.serviceItems.map( item => <div>{ item }</div> )}
      </> 
    </div>
  )
}
