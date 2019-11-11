import React from "react";
import { withRouter } from 'react-router-dom';
import BookingCards from '../components/BookingCards'


const Manage = (props) => {
  return (
    <React.Fragment>
      <BookingCards events={props.events}/>
    </React.Fragment>
  )
}

export default withRouter(Manage)
