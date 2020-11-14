import { useEffect, useReducer } from "react"
import axios from "axios"
import { bookings_url, admin_bookings_url, contact_phone } from '../config/dataLinks'
import { BOOKING_TYPE } from '../actions/bookingCreator'

const convertArrayToObject = (array, key) => {
  const initialValue = {}
  return array.reduce((obj, item) => {
    if (item && item[key]) {
      return {
        ...obj,
        [item[key].toString()]: item,
      }
    } else {
      return {}
    }
  }, initialValue)
}

const removeDeletedBooking = (bookings, id) => {
  delete bookings[id.toString()]
  return bookings
}

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isUpdating: false,
        hasErrored: false,
        errorMessage: ""
      }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        // data: Object.assign({}, state.data, convertArrayToObject(action.payload, 'booking_id'))
        // Reload all bookings based on the new filter so the new booking list reflects the search results 
        data: Object.assign({}, convertArrayToObject(action.payload, 'booking_id'))
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        hasErrored: true,
        errorMessage: "Data Retrieve Failure"
      }
    case "UPDATE_INIT":
      return {
        ...state,
        isLoading: false,
        isUpdating: true,
        hasErrored: false,
        errorMessage: ""
      }
    case "POST_SUCCESS":
      return {
        ...state,
        isUpdating: false
      }
    case "PUT_SUCCESS":
      return {
        ...state,
        isUpdating: false,
        data: Object.assign({}, state.data, convertArrayToObject([action.payload], 'booking_id'))
      }
    case "DELETE_SUCCESS":
      return {
        ...state,
        isUpdating: false,
        data: Object.assign({}, removeDeletedBooking(state.data, action.payload.id))
      }
    case "UPDATE_FAILURE":
      return {
        ...state,
        isUpdating: false,
        hasErrored: true,
        errorMessage: action.errorMessage
      }
    case "CHARGE_START":
      return {
        ...state,
        bookingInProgress: true
      }
    case "CHARGE_END":
        return {
          ...state,
          bookingInProgress: false
        }
  
    default:
      throw new Error()
  }
}

const useAxiosCRUD = (url, initialData, method, bookingTypeName, data, callMe, bookingTrigger, storeEnabled) => {

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isUpdating: false,
    hasErrored: false,
    errorMessage: "",
    data: initialData,
    bookingInProgress: false //To enable the circular progress indicator after PAY button is pressed 
  })

  useEffect(() => {
    if (!storeEnabled)
      return

    const requestData = async () => {
      dispatch({ type: "FETCH_INIT" })

      /*
       * Do not cache booking query response because booking update only changes
       * individual booking which will have different url from the query url. If the
       * queried url is cached followed by a booking update, retrieval from the same
       * query will have stale info from cache.
       */
      const config = {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        url: url
      }

      try {
        let result = await axios(config)
        dispatch({ type: "FETCH_SUCCESS", payload: result.data })
      } catch (err) {
        dispatch({ type: "FETCH_FAILURE" })
      }
    }

    const readBack = async (url, id) => {
      const config = {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        url: `${url}?id=${id}`
      }

      try {
        let result = await axios(config)
        return result.data
      } catch (err) {
        return {}  
      }
    }

    const createData = async (data) => {
      dispatch({ type: "UPDATE_INIT"})
      const url = bookingTypeName === BOOKING_TYPE.T ? bookings_url : admin_bookings_url
      const config = {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        url: url,
        data: data
      }

      dispatch({ type: "CHARGE_START" })
      try {
        const result = await axios(config)
        const error = result.data.error
        if (error) {
          alert(`${error}. ${data.payment_amount ? "Your card is NOT charged." : ''} Please call ${contact_phone} to resolve this issue.`)
          dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
        }
        else {
          const bookingId = result.data.booking_id
          dispatch({ type: "POST_SUCCESS" })

          //Now charge
          if (callMe)
            callMe(bookingId)
        }
      } catch (err) {
        alert(`${err}. ${data.payment_amount ? "Your card is NOT charged." : ''} Please call ${contact_phone} to resolve this issue.`)
        dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
      }
      dispatch({ type: "CHARGE_END" })
    }

    const updateData = async (data) => {
      dispatch({ type: "UPDATE_INIT"})
      const url = bookingTypeName === BOOKING_TYPE.T ? bookings_url : admin_bookings_url
      const config = {
        method: 'put',
        headers: {"Content-Type": "application/json"},
        url: url,
        data: data
      }

      dispatch({ type: "CHARGE_START" })
      try {
        const result = await axios(config)
        const error = result.data.error
        if (error) {
          alert(`${error}. ${data.payment_amount ? "Your card is NOT charged." : ''} Please call ${contact_phone} to resolve this issue.`)
          dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
        }
        else {
          // Read back the data to get fields inserted by the backend. The updated data will be merged back to state.data so that users can see 
          // booking cards when they are updated.
          const payload = await readBack(url, data.booking_id)
          dispatch({ type: "PUT_SUCCESS", payload: payload })

          if (callMe)
            callMe()
        }
      } catch (err) {
        alert(`${err}. ${data.payment_amount ? "Your card is NOT charged." : ''} Please call ${contact_phone} to resolve this issue.`)
        dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
      }
      dispatch({ type: "CHARGE_END" })
    }

    const deleteData = async (data) => {
      dispatch({ type: "UPDATE_INIT"})
      const url = bookingTypeName === BOOKING_TYPE.T ? bookings_url : admin_bookings_url
      const config = {
        method: 'delete',
        headers: {"Content-Type": "application/json"},
        url: url,
        data: data
      }

      try {
        const result = await axios(config)
        const error = result.data.error
        /*
        * No need to do anything if no error as data hasn't been written into local Booking Store yet.
        */ 
        if (error) {
          alert(`${error}. ${data.payment_amount ? "Your card is NOT charged." : ''} Please call ${contact_phone} to resolve this issue.`)
          dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
        } else {
          dispatch({ type: "DELETE_SUCCESS", payload: {id: data.booking_id}})
        }
      } catch (err) {
        alert(`${err}. ${data.payment_amount ? "Your card is NOT charged." : ''} Please call ${contact_phone} to resolve this issue.`)
        dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
      }
    }

    if (!state.isLoading && !state.isUpdating) {
      switch (method) {
        case 'get': {
          requestData()
          break
        }
        case 'post': {
          createData(data)
          break
        }
        case 'put': {
          updateData(data)
          break
        }
        case 'delete': {
          deleteData(data)
          break
        }
        default:
          throw new Error()
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [bookingTrigger])

  return { ...state }
}

export default useAxiosCRUD
