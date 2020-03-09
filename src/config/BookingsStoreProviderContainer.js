import { connect } from 'react-redux'
import { fetchArtists, fetchServices } from '../actions/bookingCreator'
import { BookingsStoreProvider } from '../components/BookingsStoreProvider'

const mapStateToProps = state => {
  return {
    storeCtrl : state.storeActivation,
    bookingFilter: state.bookingFilter
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchArtists: () => dispatch(fetchArtists()),
    fetchServices: () => dispatch(fetchServices())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingsStoreProvider)