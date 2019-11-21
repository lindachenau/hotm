import { connect } from 'react-redux'
import { BookingsStoreProvider } from './BookingsStoreProvider'

const mapStateToProps = state => {
  return {
    storeCtrl : state.storeActivation
  }
}

export default connect(mapStateToProps, null)(BookingsStoreProvider)