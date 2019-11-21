import { connect } from 'react-redux'
import { setActivateClients, setActivateBookings } from '../actions/bookingCreator'
import Manage from '../pages/Manage'

const mapDispatchToProps = dispatch => {
    return {
      setActivateClients: (val) => dispatch(setActivateClients(val)),
      setActivateBookings: (val) => dispatch(setActivateBookings(val))
    }
}

export default connect(null, mapDispatchToProps)(Manage)