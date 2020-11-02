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
  FETCH_CLIENT,
  RECEIVE_CLIENT,
  ERROR_CLIENT,
  ENABLE_STORE,
  FETCH_SERVICES,
  FETCH_ARTISTS,
  FETCH_CORP_CARDS,
  FETCH_ADMIN_TASKS,
  SEARCH_BOOKING,
  ADD_BOOKING,
  UPDATE_BOOKING,
  CANCEL_BOOKING,
  RESET_BOOKING,
  ASSIGN_ARTISTS,
  LOAD_BOOKING,
  SET_FROM_DATE,
  SET_TO_DATE,
  SET_BOOKING_TYPE,
  SET_ARTIST,
  SET_CLIENT,
  SET_CORPORATE,
  BOOKING_TYPE
} from '../actions/bookingCreator'

import { email_reminder_server } from '../config/dataLinks'
import axios from 'axios'

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
  artistStart: null,
  bookingDate: null,
  bookingEnd: null,
  bookingAddr: ''
}

export function bookingDateAddr(state = initDateAddr, action) {
  switch (action.type) {
    case SUBMIT_BOOKING: {
      return {
        artistStart: action.artistStart,
        bookingDate: action.bookingDate,
        bookingEnd: action.bookingEnd,
        bookingAddr: action.bookingAddr
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

export function client(state = {}, action) {
  switch (action.type) {
    case FETCH_CLIENT: {
      return {}
    }
    case RECEIVE_CLIENT: {
      return Object.assign({}, state, action.payload)
    }
    case ERROR_CLIENT: {
      return {}
    }
    case RESET_BOOKING: {
      return {}
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
  storeEnabled: false,
  servicesTrigger: true,
  artistsTrigger: true,
  corpCardsTrigger: true,
  adminTasksTrigger: true,
  bookingTrigger: false,
  requestMethod: 'get',
  bookingTypeName: BOOKING_TYPE.T,
  data: {},
  callMe: null,
  bookingData: {},
  checkout: false
}

export function storeActivation(state = initActivation, action) {
  switch (action.type) {
    case ENABLE_STORE: {
      return Object.assign({}, state, {
        storeEnabled: true
      })
    }
    case FETCH_SERVICES: {
      return Object.assign({}, state, {
        servicesTrigger: !state.servicesTrigger
      })
    }
    case FETCH_ARTISTS: {
      return Object.assign({}, state, {
        artistsTrigger: !state.artistsTrigger
      })
    }
    case FETCH_CORP_CARDS: {
      return Object.assign({}, state, {
        corpCardsTrigger: !state.corpCardsTrigger
      })
    }
    case FETCH_ADMIN_TASKS: {
      return Object.assign({}, state, {
        adminTasksTrigger: !state.adminTasksTrigger
      })
    }       
    case SEARCH_BOOKING: {
      return Object.assign({}, state, {
        requestMethod: 'get',
        bookingTrigger: !state.bookingTrigger,
        checkout: false
      })
    }
    //create a new booking on the server
    case ADD_BOOKING: {
      return Object.assign({}, state, {
        requestMethod: 'post',
        data: action.payload,
        bookingTypeName: action.bookingTypeName,
        bookingTrigger: !state.bookingTrigger,
        callMe: action.callMe,
        checkout: false
      })
    }
    //modify an existing booking on the server
    case UPDATE_BOOKING: {
      return Object.assign({}, state, {
        requestMethod: 'put',
        data: action.payload,
        bookingTypeName: action.bookingTypeName,
        bookingTrigger: !state.bookingTrigger,
        callMe: action.callMe,
        checkout: action.checkout
      })
    }
    //delete an existing booking on the server
    case CANCEL_BOOKING: {
      return Object.assign({}, state, {
        requestMethod: 'delete',
        data: action.payload,
        bookingTrigger: !state.bookingTrigger,
        callMe: null,
        checkout: false
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
  bookingType: {
    name: BOOKING_TYPE.T
  },
  artist: null,
  client: null,
  corporate: null
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
    case SET_BOOKING_TYPE: {
      return Object.assign({}, state, {
        bookingType: action.val
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
    case SET_CORPORATE: {
      return Object.assign({}, state, {
        corporate: action.val
      })
    }    
    default:
      return state
  }
}

const sendReminder = async (clientEmail, bookingDate) => {
  try {
    const config = {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      url: email_reminder_server,
      data: {
        email: clientEmail,
        appointmentDate: bookingDate
      }
    }
    await axios(config)
  }
  catch (error) {
    console.error(error)
  }
}

export default sendReminder