import { connect } from 'react-redux'
import { loadBooking, saveBooking } from '../actions/bookingCreator'
import BookingCards from '../components/BookingCards'

const mapDispatchToProps = dispatch => {
    return {
      loadBooking: booking => dispatch(loadBooking((booking))),
      saveBooking: booking => dispatch(saveBooking((booking)))
    }
}

export default connect(null, mapDispatchToProps)(BookingCards)