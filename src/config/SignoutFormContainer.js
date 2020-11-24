import { connect } from 'react-redux'
import { signoutUser } from '../actions/userCreator'
import { resetBooking } from '../actions/bookingCreator'
import SignoutForm from '../components/SignoutForm'

const mapStateToProps = state => {
  return {
    name: state.userInfo.name,
    email: state.userInfo.email
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signoutUser: () => dispatch(signoutUser()),
    resetBooking: () => dispatch(resetBooking())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignoutForm)