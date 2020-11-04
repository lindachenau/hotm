import { connect } from 'react-redux'
import { submitBooking } from '../actions/bookingCreator'
import TherapistSelection from '../components/TherapistSelection'

const mapStateToProps = state => {
  return {
    bookingDateAddr: state.bookingDateAddr,
    itemQty: state.itemQty,
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = dispatch => {
    return {
      submitBooking: (artistStart, date, bookingEnd, addr) => dispatch(submitBooking(artistStart, date, bookingEnd, addr))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TherapistSelection)