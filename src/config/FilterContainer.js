import { connect } from 'react-redux'
import { setFromDate, setToDate, setBookingType, setArtist, setClient, setCorporate, searchBooking } from '../actions/bookingCreator'
import Filter from '../components/Filter'

const mapStateToProps = state => {
  return {
    bookingFilter: state.bookingFilter
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setFromDate: (val) => dispatch(setFromDate(val)),
    setToDate: (val) => dispatch(setToDate(val)),
    setBookingType: (val) => dispatch(setBookingType(val)),
    setArtist: (val) => dispatch(setArtist(val)),
    setClient: (val) => dispatch(setClient(val)),
    setCorporate: (val) => dispatch(setCorporate(val)),
    searchBooking: () => dispatch(searchBooking()) 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)