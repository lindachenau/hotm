import { connect } from 'react-redux'
import { loadBooking } from '../actions/bookingCreator'
import Manage from '../pages/Manage'

const mapDispatchToProps = dispatch => {
    return {
      loadBooking: booking => dispatch(loadBooking((booking)))
    }
}

export default connect(null, mapDispatchToProps)(Manage)