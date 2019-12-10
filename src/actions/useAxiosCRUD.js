import React, { useState, useEffect, useReducer } from "react"
import axios from "axios"

const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue)
}

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isUpdating: false,
        hasErrored: false
      }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: false,
        errorMessage: "",
        data: Object.assign({}, state.data, convertArrayToObject(action.payload, 'id'))
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: true,
        errorMessage: "Data Retrieve Failure"
      }
    case "UPDATE_INIT":
      return {
        ...state,
        isLoading: false,
        isUpdating: true,
        hasErrored: false
      }
    case "POST_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: false,
        errorMessage: "",
        data: Object.assign({}, state.data, convertArrayToObject([action.payload], 'id'))
      }
    case "PUT_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: false,
        errorMessage: "",
        data: Object.assign({}, state.data, action.payload)
      }
    case "DELETE_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: false,
        errorMessage: ""
      }
    case "UPDATE_FAILURE":
      return {
        ...state,
        isLoading: false,
        isUpdating: false,
        hasErrored: true,
        errorMessage: action.errMessage
      }
  
    default:
      throw new Error()
  }
}

const useAxiosCRUD = (initialUrl, initialData, active, method, data, callMe) => {
  const [url] = useState(initialUrl)

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isUpdating: false,
    hasErrored: false,
    errorMessage: "",
    data: initialData
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      try {
        let result = await axios.get(url)
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data })
        }
      } catch (err) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" })
        }
      }
    }

    const createData = async (data) => {
      dispatch({ type: "UPDATE_INIT"})

      const config = {
        method: 'post',
        headers: {"Content-Type": "application/json"},
        url: url,
        data: data
      }

      try {
        let result = await axios(config)
        let bookingId = result.data.booking_id

        if (!didCancel) {
          if (bookingId > 0) {
            let payload = {...data, booking_id: bookingId}
            dispatch({ type: "POST_SUCCESS", payload: payload })
            callMe()
          }
          else {
            alert(result.data.error + ' Please call to resolve this issue.')
          }
        }
      } catch (err) {
        if (!didCancel) {
          dispatch({ type: "POST_FAILURE", errorMessage: err })
        }
      }
    }

    if (active && !state.isLoading && !state.isUpdating) {
      switch (method) {
        case 'get': {
          fetchData()
          break
        }
        case 'post': {
          createData(data)
          break
        }
      }
    }

    return () => {
      didCancel = true
    }
  }, [url, active, method, data])

  return { ...state }
}

export default useAxiosCRUD
