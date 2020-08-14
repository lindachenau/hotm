import { connect } from 'react-redux'
import { loadBooking, saveBooking } from '../actions/bookingCreator'
import Manage from '../pages/Manage'

const mapDispatchToProps = dispatch => {
    return {
      loadBooking: booking => dispatch(loadBooking((booking))),
      saveBooking: booking => dispatch(saveBooking((booking)))
    }
}

export default connect(null, mapDispatchToProps)(Manage)