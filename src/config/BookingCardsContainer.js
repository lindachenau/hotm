import { connect } from 'react-redux'
import { loadBooking } from '../actions/bookingCreator'
import BookingCards from '../components/BookingCards'

const mapDispatchToProps = dispatch => {
    return {
      loadBooking: booking => dispatch(loadBooking((booking)))
    }
}

export default connect(null, mapDispatchToProps)(BookingCards)