import { connect } from 'react-redux'
import { addCorpCards, updateCorpCards, addAdminTasks, updateAdminTasks } from '../actions/bookingCreator'
import Admin from '../pages/Admin'

const mapDispatchToProps = dispatch => {
  return {
    addCorpCards: (data, callMe) => dispatch(addCorpCards(data, callMe)),
    updateCorpCards: (data, callMe) => dispatch(updateCorpCards(data, callMe)),
    addAdminTasks: (data, callMe) => dispatch(addAdminTasks(data, callMe)),
    updateAdminTasks: (data, callMe) => dispatch(updateAdminTasks(data, callMe))
  }
}

export default connect(null, mapDispatchToProps)(Admin)