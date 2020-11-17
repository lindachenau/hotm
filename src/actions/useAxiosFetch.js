import { useState, useEffect, useReducer } from "react"
import axios from "axios"

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, hasErrored: false }
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        hasErrored: false,
        errorMessage: "",
        data: action.payload
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
        isUpdating: false,
        data: state.data.concat([action.payload])
      }
    case "PUT_SUCCESS":
      return {
        ...state,
        isUpdating: false,
        data: state.data.map(obj => obj.id === action.payload.id ? action.payload : obj)
      }
    case "UPDATE_FAILURE":
      return {
        ...state,
        isUpdating: false,
        hasErrored: true,
        errorMessage: action.errorMessage
      }
    default:
      throw new Error()
  }
}

const useAxiosFetch = (initialUrl, initialData, method, data, callMe, trigger) => {
  const [url] = useState(initialUrl)

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isUpdating: false,
    hasErrored: false,
    errorMessage: "",
    data: initialData
  })

  useEffect(() => {

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })
 
      try {
        const config = {
          method: 'get',
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate"
          },
          url: url
        }
        
        let result = await axios(config)
        dispatch({ type: "FETCH_SUCCESS", payload: result.data })
      } catch (err) {
        dispatch({ type: "FETCH_FAILURE" })
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
        const result = await axios(config)
        const error = result.data.error
        if (error) {
          alert(error)
          dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
        }
        else {
          const id = result.data.id
          const payload = {...data, id}
          dispatch({ type: "POST_SUCCESS", payload: payload })
          await callMe()
        }
      } catch (err) {
        alert(err)
        dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
      }
    }

    const updateData = async (data) => {
      dispatch({ type: "UPDATE_INIT"})
      const config = {
        method: 'put',
        headers: {"Content-Type": "application/json"},
        url: url,
        data: data
      }

      try {
        const result = await axios(config)
        const error = result.data.error
        if (error) {
          alert(error)
          dispatch({ type: "UPDATE_FAILURE", errorMessage: error })
        }
        else {
          dispatch({ type: "PUT_SUCCESS", payload: data })
          await callMe()
        }
      } catch (err) {
        alert(err)
        dispatch({ type: "UPDATE_FAILURE", errorMessage: err })
      }
    }

    if (!state.isLoading && !state.isUpdating) {
      switch (method) {
        case 'get': {
          fetchData()
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
        default:
          throw new Error()
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return { ...state }
}

export default useAxiosFetch
