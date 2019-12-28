import React, { useState, useEffect} from "react";
import { withRouter } from 'react-router-dom';
import BookingCards from '../config/BookingCardsContainer'
import ArtistBooking from '../pages/ArtistBooking'


const Manage = ({
  events, 
  eventsFetched, 
  setActivateBookings, 
  bookingStage, 
  changeBookingStage, 
  services, 
  bookingValue, 
  depositPayable, 
  artists}) => {
  const [manageState, setManageState] = useState('Default')

  useEffect(() => {
    setActivateBookings(true)

    return () => {
      setActivateBookings(false)
    }
  }, [])

  return (
    <>
      {manageState === 'Default' ?
        <BookingCards events={events} eventsFetched={eventsFetched} setManageState={setManageState}/>
        : 
        <ArtistBooking
          bookingStage={bookingStage} 
          changeBookingStage={changeBookingStage}
          services={services}
          bookingValue={bookingValue}
          depositPayable={depositPayable}
          artists={artists}
          newBooking={false}
        />
      }
    </>
  )
}

export default withRouter(Manage)
