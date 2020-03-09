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
export const FETCH_ARTISTS = 'FETCH_ARTISTS'
export const FETCH_SERVICES = 'FETCH_SERVICES'
export const RESET_BOOKING = 'RESET_BOOKING'
export const MAKE_BOOKING = 'MAKE_BOOKING'
export const SEARCH_BOOKING = 'SEARCH_BOOKING'
export const ADD_BOOKING = 'ADD_BOOKING'
export const SAVE_BOOKING = 'SAVE_BOOKING'
export const UPDATE_BOOKING = 'UPDATE_BOOKING'
export const CANCEL_BOOKING = 'CANCEL_BOOKING'
export const ASSIGN_ARTISTS = 'ASSIGN_ARTISTS'
export const ASSIGN_CLIENT = 'ASSIGN_CLIENT'
export const LOAD_BOOKING = 'LOAD_BOOKING'
export const SET_FROM_DATE = 'SET_FROM_DATE'
export const SET_TO_DATE = 'SET_TO_DATE'
export const SET_ARTIST = 'SET_ARTIST'
export const SET_CLIENT = 'SET_CLIENT'

export const toggleOrganic = () => ({
  type: CHANGE_ORGANIC
})

export const togglePensionerRate = () => ({
  type: CHANGE_PENSIONER_RATE
})

export const submitBooking = (date, bookingEnd, addr) => ({
  type: SUBMIT_BOOKING,
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

export const resetBooking = () => ({
  type: RESET_BOOKING,
})

export const searchBooking = () => ({
  type : SEARCH_BOOKING
})

export const addBooking = (bookingInfo, callMe) => ({
  type: ADD_BOOKING,
  payload: bookingInfo,
  callMe
})

export const updateBooking = (bookingInfo, callMe) => ({
  type: UPDATE_BOOKING,
  payload: bookingInfo,
  callMe
})

export const cancelBooking = (bookingInfo) => ({
  type: CANCEL_BOOKING,
  payload: bookingInfo
})

export const saveBooking = (bookingData) => ({
  type: SAVE_BOOKING,
  payload: bookingData,
})

export const assignArtists = (artistIds) => ({
  type: ASSIGN_ARTISTS,
  artistIds
})

export const assignClient = (client) => ({
  type: ASSIGN_CLIENT,
  client
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