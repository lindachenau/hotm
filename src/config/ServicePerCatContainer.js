import { connect } from 'react-redux'
import { incItemQty, decItemQty } from '../actions/bookingCreator'
import ServicePerCat from '../components/ServicePerCat'

const mapStateToProps = state => {
  return {
    itemQty: state.itemQty
  }
}

const mapDispatchToProps = dispatch => {
    return {
      incItemQty: id => dispatch(incItemQty(id)),
      decItemQty: id => dispatch(decItemQty(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServicePerCat)
