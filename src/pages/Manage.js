import React, { useEffect} from "react";
import { withRouter } from 'react-router-dom';
import BookingCards from '../components/BookingCards'


const Manage = ({events, eventsFetched, setActivateClients, setActivateBookings}) => {

  useEffect(() => {
    setActivateClients(true)
    setActivateBookings(true)

    return () => {
      setActivateBookings(false)
    }
  }, [])

  return (
    <React.Fragment>
      <BookingCards events={events} eventsFetched={eventsFetched}/>
    </React.Fragment>
  )
}

export default withRouter(Manage)
