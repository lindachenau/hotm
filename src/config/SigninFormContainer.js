import { connect } from 'react-redux'
import { signinUser } from '../actions/userCreator'
import SigninForm from '../components/SigninForm'

const mapDispatchToProps = dispatch => {
  return {
    signinUser: (payload) => dispatch(signinUser(payload))
  }
}

export default connect(null, mapDispatchToProps)(SigninForm)