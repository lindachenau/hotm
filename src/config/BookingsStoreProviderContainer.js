import { connect } from 'react-redux'
import { fetchArtists, fetchServices, fetchCorpCards, fetchAdminTasks, searchBooking, enableStore } from '../actions/bookingCreator'
import { BookingsStoreProvider } from '../components/BookingsStoreProvider'

const mapStateToProps = state => {
  return {
    storeActivation : state.storeActivation,
    bookingFilter: state.bookingFilter,
    isArtist: state.userInfo.isArtist
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchArtists: () => dispatch(fetchArtists()),
    fetchServices: () => dispatch(fetchServices()),
    fetchCorpCards: () => dispatch(fetchCorpCards()),
    fetchAdminTasks: () => dispatch(fetchAdminTasks()),
    searchBooking: () => dispatch(searchBooking()),
    enableStore: () => dispatch(enableStore())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingsStoreProvider)