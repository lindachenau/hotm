import { user_url, access_token } from '../config/dataLinks'
import axios from 'axios'
export const CHANGE_ORGANIC = 'CHANGE_ORGANIC'
export const CHANGE_PENSIONER_RATE = 'CHANGE_PENSIONER_RATE'
export const SUBMIT_BOOKING = 'SUBMIT_BOOKING'
export const CHANGE_BOOKING_STAGE = 'CHANGE_BOOKING_STAGE'
export const SET_SELECTED_ARTIST = 'SET_SELECTED_ARTIST'
export const INC_ITEM_QTY = 'INC_ITEM_QTY'
export const DEC_ITEM_QTY = 'DEC_ITEM_QTY'
export const GET_AVAIL_ARTISTS = 'GET_AVAIL_ARTISTS'
export const RECEIVE_AVAIL_ARTISTS = 'RECEIVE_AVAIL_ARTISTS'
export const ERROR_AVAIL_ARTISTS = 'ERROR_AVAIL_ARTISTS'
export const FETCH_CLIENT = 'FETCH_CLIENT'
export const RECEIVE_CLIENT = 'RECEIVE_CLIENT'
export const ERROR_CLIENT = 'ERROR_CLIENT'
export const FETCH_ARTISTS = 'FETCH_ARTISTS'
export const FETCH_SERVICES = 'FETCH_SERVICES'
export const FETCH_CORP_CARDS = 'FETCH_CORP_CARDS'
export const FETCH_ADMIN_TASKS = 'FETCH_ADMIN_TASKS'
export const RESET_BOOKING = 'RESET_BOOKING'
export const MAKE_BOOKING = 'MAKE_BOOKING'
export const SEARCH_BOOKING = 'SEARCH_BOOKING'
export const ADD_BOOKING = 'ADD_BOOKING'
export const UPDATE_BOOKING = 'UPDATE_BOOKING'
export const CANCEL_BOOKING = 'CANCEL_BOOKING'
export const LOAD_BOOKING = 'LOAD_BOOKING'
export const SET_FROM_DATE = 'SET_FROM_DATE'
export const SET_TO_DATE = 'SET_TO_DATE'
export const SET_ARTIST = 'SET_ARTIST'
export const SET_CLIENT = 'SET_CLIENT'
export const SET_CORPORATE = 'SET_CORPORATE'
export const SET_BOOKING_TYPE = 'SET_BOOKING_TYPE'
export const BOOKING_TYPE = {
  C: 'corporate',
  P: 'package',
  T: 'therapist'
}

export const PUT_OPERATION = {
  UPDATE: 0,
  CHECKOUT: 1,
  PAYMENT: 2,
  CHECKOUT_PAYMENT: 3
}

export const toggleOrganic = () => ({
  type: CHANGE_ORGANIC
})

export const togglePensionerRate = () => ({
  type: CHANGE_PENSIONER_RATE
})

export const submitBooking = (artistStart, date, bookingEnd, addr) => ({
  type: SUBMIT_BOOKING,
  artistStart: artistStart,
  bookingDate: date,
  bookingEnd: bookingEnd,
  bookingAddr: addr
})

export const changeBookingStage = stage => ({
  type: CHANGE_BOOKING_STAGE,
  stage
})

export const changeSelectedArtist = order => ({
  type: SET_SELECTED_ARTIST,
  order
})

export function getAvailArtist(url) {
  return async function(dispatch) {
    dispatch({
      type: GET_AVAIL_ARTISTS
    })

    try {
      const result = await fetch(url)
      const data = await result.json()
      dispatch({
        type: RECEIVE_AVAIL_ARTISTS,
        payload: data
      })
    } catch (err) {
      console.log("Artists fetching error")
      dispatch({
        type: ERROR_AVAIL_ARTISTS
      })
    }
  }
}

export function getClient(clientId) {
  return async function(dispatch) {
    dispatch({
      type: FETCH_CLIENT
    })

    try {
      const config = {
        method: 'get',
        headers: { 'Authorization': access_token },
        url: `${user_url}/${clientId}`
      }

      const result = await axios(config)
      const client = {
        id: result.data.id,
        name: result.data.name,
        phone: result.data.meta.billing_phone[0],
        email: "lindachenau@gmail.com"
      }
      dispatch({
        type: RECEIVE_CLIENT,
        payload: client
      })
    } catch (err) {
      console.log("Client fetching error")
      dispatch({
        type: ERROR_CLIENT
      })
    }
  }
}

export const incItemQty = id => ({
  type: INC_ITEM_QTY,
  itemId: id
})

export const decItemQty = id => ({
  type: DEC_ITEM_QTY,
  itemId: id
})

export const fetchArtists = () => ({
  type: FETCH_ARTISTS,
})

export const fetchServices = () => ({
  type: FETCH_SERVICES,
})

export const fetchCorpCards = () => ({
  type: FETCH_CORP_CARDS,
})

export const fetchAdminTasks = () => ({
  type: FETCH_ADMIN_TASKS,
})

export const resetBooking = () => ({
  type: RESET_BOOKING,
})

export const searchBooking = () => ({
  type : SEARCH_BOOKING
})

export const addBooking = (bookingInfo, bookingTypeName, callMe) => ({
  type: ADD_BOOKING,
  payload: bookingInfo,
  bookingTypeName: bookingTypeName,
  callMe
})

export const updateBooking = (bookingInfo, bookingTypeName, callMe, checkout=false) => ({
  type: UPDATE_BOOKING,
  payload: bookingInfo,
  bookingTypeName: bookingTypeName,
  callMe,
  checkout
})

export const cancelBooking = (bookingInfo, bookingTypeName, callMe=null) => ({
  type: CANCEL_BOOKING,
  payload: bookingInfo,
  bookingTypeName: bookingTypeName,
  callMe
})

export const loadBooking = (booking) => ({
  type: LOAD_BOOKING,
  booking
})

export const setFromDate = (val) => ({
  type: SET_FROM_DATE,
  val
})

export const setToDate = (val) => ({
  type: SET_TO_DATE,
  val
})

export const setClient = (val) => ({
  type: SET_CLIENT,
  val
})

export const setArtist = (val) => ({
  type: SET_ARTIST,
  val
})

export const setCorporate = (val) => ({
  type: SET_CORPORATE,
  val
})

export const setBookingType = (val) => ({
  type: SET_BOOKING_TYPE,
  val
})