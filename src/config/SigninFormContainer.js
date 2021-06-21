import { connect } from 'react-redux'
import { signinUser } from '../actions/userCreator'
import SigninForm from '../components/SigninForm'

const mapDispatchToProps = dispatch => {
  return {
    signinUser: (apiToken, payload) => dispatch(signinUser(apiToken, payload))
  }
}

export default connect(null, mapDispatchToProps)(SigninForm)