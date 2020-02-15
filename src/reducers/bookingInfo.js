import {
  CHANGE_ORGANIC,
  CHANGE_PENSIONER_RATE,
  CHANGE_BOOKING_STAGE,
  SET_SELECTED_ARTIST,
  INC_ITEM_QTY,
  DEC_ITEM_QTY,
  SUBMIT_BOOKING,
  GET_AVAIL_ARTISTS,
  RECEIVE_AVAIL_ARTISTS,
  ERROR_AVAIL_ARTISTS,
  ACTIVATE_BOOKINGS,
  SEARCH_BOOKING,
  ADD_BOOKING,
  SAVE_BOOKING,
  UPDATE_BOOKING,
  RESET_BOOKING,
  ASSIGN_ARTISTS,
  ASSIGN_CLIENT,
  LOAD_BOOKING,
  SET_FROM_DATE,
  SET_TO_DATE,
  SET_ARTIST,
  SET_CLIENT
} from '../actions/bookingCreator'

const initPriceFactors = {
  organic: false,
  pensionerRate: false
}

export function priceFactors(state = initPriceFactors, action) {
  switch (action.type) {
    case CHANGE_ORGANIC: {
      return Object.assign({}, state, {
        organic: !state.organic
      })
    }
    case CHANGE_PENSIONER_RATE: {
      return Object.assign({}, state, {
        pensionerRate: !state.pensionerRate
      })
    }
    case LOAD_BOOKING: {
      return Object.assign({}, {
        organic: action.booking.with_organic === 1 ? true : false,
        pensionerRate: action.booking.with_pensioner_rate === 1 ? true : false
      })
    }
    case RESET_BOOKING: {
      return initPriceFactors
    }
    default:
      return state
  }
}

const initDateAddr = {
  bookingDate: null,
  bookingEnd: null,
  bookingAddr: ''
}

export function bookingDateAddr(state = initDateAddr, action) {
  switch (action.type) {
    case SUBMIT_BOOKING: {
      return {
        bookingDate: action.bookingDate,
        bookingEnd: action.bookingEnd,
        bookingAddr: action.bookingAddr
      }
    }
    case LOAD_BOOKING: {
      const booking = action.booking
      return {
        bookingDate: new Date(booking.booking_date + ' ' + booking.booking_time + ':00'),
        bookingEnd: new Date(booking.booking_date + ' ' + booking.booking_end_time + ':00'),
        bookingAddr: booking.event_address
      }
    }
    case RESET_BOOKING: {
      return initDateAddr
    }
    default:
      return state
  }
}

export function bookingStage(state = {stage: 0}, action) {
  switch (action.type) {
    case CHANGE_BOOKING_STAGE: {
      return Object.assign({}, state, {
        stage: action.stage
      })
    }
    case RESET_BOOKING: {
      return {stage: 0}
    }
    default:
      return state
  }
}

/*
 * A list of artists assigned to a job. Only use non-mutating array methods.
 */
export function assignedArtists(state = [], action) {
  switch (action.type) {
    case ASSIGN_ARTISTS: {
      return action.artistIds
    }
    case LOAD_BOOKING: {
      return action.booking.artist_id_list
    }
    case RESET_BOOKING: {
      return []
    }
    default:
      return state
  }
}

const initClientInfo = {
  client: null,
  comment: '',
  balance: null,
  paidDeposit: null,
  bookingId : null
}
export function clientInfo(state = initClientInfo, action) {
  switch (action.type) {
    case LOAD_BOOKING: { 
      return Object.assign({}, {
        client: action.booking.client,
        comment: action.booking.comment,
        balance: action.booking.total_amount - action.booking.paid_deposit_total,
        paidDeposit: action.booking.paid_deposit_total,
        bookingId: action.booking.booking_id
      })
    }
    case ASSIGN_CLIENT: {
      return Object.assign({}, state, {
        client: action.client
      })
    }
    case RESET_BOOKING: {
      return initClientInfo
    }
    default:
      return state
  }
}

/*
 * Client selected single artist
 */
export function selectedArtist(state = {order: 0}, action) {
  switch (action.type) {
    case SET_SELECTED_ARTIST: { 
      return Object.assign({}, state, {
        order: action.order
      })
    }
    case RESET_BOOKING: {
      return {order: 0}
    }
    default:
      return state
  }
}

const initAvailArtists = {
  ids: [],
  recs: [],
  isLoading: false,
  hasErr: false
}
export function availArtists(state = initAvailArtists, action) {
  switch (action.type) {
    case GET_AVAIL_ARTISTS: {
      return Object.assign({}, state, {
        ids: [],
        recs: [],
        isLoading: true,
        hasErr: false
      })
    }
    case RECEIVE_AVAIL_ARTISTS: {
      let list = []
      let recs = action.payload

      for (let rec of recs) {
        list.push(rec.artist_id_list[0])
      }
  
      return Object.assign({}, state, {
        isLoading: false,
        hasErr: false,
        ids: list,
        recs: recs
      })
    }
    case ERROR_AVAIL_ARTISTS: {
      return Object.assign({}, state, {
        ids: [],
        recs: [],
        isLoading: false,
        hasErr: true
      })
    }
    case RESET_BOOKING: {
      return initAvailArtists
    }
    default:
      return state
  }
}

export function itemQty(state = {}, action) {
  let qty = 0
  let id = action.itemId
  if (id in state) {
    qty = state[id]
  }

  switch (action.type) {
    case INC_ITEM_QTY: {
      qty += 1
      return Object.assign({}, state, {
        [id]: qty
      })
    }
    case DEC_ITEM_QTY: {
      if (qty > 0) {
        qty -= 1
      }      
      
      if (qty > 0) {
        return Object.assign({}, state, {
          [id]: qty
        })
      } else {
        let temp = Object.assign({}, state)
        //remove the empty item
        delete temp[id]
        return Object.assign({}, temp)
      }
    }
    case LOAD_BOOKING: {
      const services = action.booking.services
      const quantities = action.booking.quantities
      let temp = {}

      for (let i = 0; i < services.length; i++ ) {
        temp[services[i].toString()] = quantities[i]
      }
      return Object.assign({}, temp)
    }
    case RESET_BOOKING: {
      return {}
    }
    default:
      return state
  }
}

const initActivation = {
  servicesActive: true,
  artistsActive: true,
  bookingTrigger: false,
  requestMethod: 'get',
  data: {},
  callMe: null,
  bookingData: {}
}

export function storeActivation(state = initActivation, action) {
  switch (action.type) {
    case SEARCH_BOOKING: {
      return Object.assign({}, state, {
        requestMethod: 'get',
        bookingTrigger: !state.bookingTrigger
      })
    }
    //create a new booking on the server
    case ADD_BOOKING: {
      return Object.assign({}, state, {
        requestMethod: 'post',
        data: action.payload,
        bookingTrigger: !state.bookingTrigger,
        callMe: action.callMe
      })
    }
    //modify an existing booking on the server
    case UPDATE_BOOKING: {
      return Object.assign({}, state, {
        requestMethod: 'put',
        data: action.payload,
        bookingTrigger: !state.bookingTrigger,
        callMe: action.callMe
      })
    }
    /*
     * Save booking information in an object as required by submission format for later use.
     * This is different from LOAD_BOOKING which initializes the booking state from an existing booking.
     */
    case SAVE_BOOKING: {
      return Object.assign({}, state, {
        bookingData: action.payload
      })
    }
    case RESET_BOOKING: {
      return Object.assign({}, state, {
        data: {},
        callMe: null,
        bookingData: {}
      })
    }
    default:
      return state
  }
}

const today = new Date()

const initBookingFilter = {
  fromDate: new Date(),
  toDate: today.setDate(today.getDate() + 7),
  artist: null,
  client: null
}

export function bookingFilter(state = initBookingFilter, action) {
  switch (action.type) {
    case SET_FROM_DATE: {
      return Object.assign({}, state, {
        fromDate: action.val
      })
    }
    case SET_TO_DATE: {
      return Object.assign({}, state, {
        toDate: action.val
      })
    }
    case SET_ARTIST: {
      return Object.assign({}, state, {
        artist: action.val
      })
    }
    case SET_CLIENT: {
      return Object.assign({}, state, {
        client: action.val
      })
    }
    default:
      return state
  }
}