import { connect } from 'react-redux'
import { toggleOrganic, togglePensionerRate } from '../actions/bookingCreator'
import ServiceMenu from '../components/ServiceMenu'

const mapStateToProps = state => {
  return {
    organic: state.priceFactors.organic,
    pensionerRate: state.priceFactors.pensionerRate
  }
}

const mapDispatchToProps = dispatch => {
    return {
      toggleOrganic: () => dispatch(toggleOrganic()),
      togglePensionerRate: () => dispatch(togglePensionerRate())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceMenu)
