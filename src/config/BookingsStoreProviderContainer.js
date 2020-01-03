import { connect } from 'react-redux'
import { BookingsStoreProvider } from '../components/BookingsStoreProvider'

const mapStateToProps = state => {
  return {
    storeCtrl : state.storeActivation,
    bookingFilter: state.bookingFilter
  }
}

export default connect(mapStateToProps, null)(BookingsStoreProvider)