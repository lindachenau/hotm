import { connect } from 'react-redux'
import { submitBooking, getAvailArtist, changeSelectedArtist } from '../actions/bookingCreator'
import TherapistSelection from '../components/TherapistSelection'

const mapStateToProps = state => {
  return {
    bookingDateAddr: state.bookingDateAddr,
    itemQty: state.itemQty
  }
}

const mapDispatchToProps = dispatch => {
    return {
      submitBooking: (artistStart, date, bookingEnd, addr) => dispatch(submitBooking(artistStart, date, bookingEnd, addr))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TherapistSelection)