import { contact_phone, payment_link_sender, auto_cancellation_timer, sms_reminder_server, delete_sms_reminder, 
  travel_time_url, email_verification_server, clients_url } from '../config/dataLinks'
import moment from 'moment'
import axios from 'axios'
import { localDate } from '../utils/dataFormatter'
import { BOOKING_TYPE } from '../actions/bookingCreator'
import { admin_email } from '../config/dataLinks'

 //Merge arr2 into arr1; If item with the same id exists in arr1, the item in arr2 is dropped.
  export const mergeArrays = (arr1, arr2) => {
    let merged = []
    const arr = arr1.concat(arr2)
    let assoc = {}

    arr.forEach((item) => {
      const id = item.id
      if (!assoc[id]) {
        merged.push(item)
        assoc[id] = true
      }
    })

    return merged
  }

export function startDate(bookingDate)
{
  const y = bookingDate.getFullYear()
  const mon = bookingDate.getMonth() // Jan is 0
  const d = bookingDate.getDate()
  
  return (new Date(y, mon, d, 0, 0)).toISOString()
}

export function endDate(bookingDate)
{
  const y = bookingDate.getFullYear()
  const mon = bookingDate.getMonth() // Jan is 0
  const d = bookingDate.getDate()
  
  return (new Date(y, mon, d, 23, 59)).toISOString()
}

export const sendPaymentLink = async (email, content, cancel=false) => {
  const cancelWarning = cancel ? '<p>The booking will be automatically cancelled if payment is not received within 12 hours.</p>' : ''
  const response = await fetch(payment_link_sender, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email,
      body: `${content}${cancelWarning}`,
      subject: 'Payment link for Hair Beauty Life Co booking',
      source: admin_email  
    })
  })

  const {status} = await response.json()

  return status //success if OK
}

// Returns a function which runs given checkFn against a value.
const createRule = (checkFn, errorMessage) => {
  return async (...values) => await Promise.resolve(checkFn(...values)) ? null : errorMessage
}

// Returns a function which accepts some values to validate and runs all passed rules. Note all rules must have the same number of values.
const defineValidator = (...rules) => {
  return async (...values) => {    		
      for (const rule of rules) {        		
          const errorMessage = await rule(...values)          
          if (errorMessage !== null) {
              return { valid: false, reason: errorMessage }
          }
      }

      return { valid: true, reason: null }
  } 
}

// Define rules
const validPensionerRate = (pensionerRate, bookingTime) => {
  if (pensionerRate && bookingTime.getDay() !== 1) 
    return false

  return true
}

const legalBookingTime = (pensionerRate, bookingTime) => {
  const now = new Date()
  const ahead24hrs = (bookingTime - now) / 3600000 >= 24 
  const bookingHour = bookingTime.getHours()
  const between8And18 = bookingHour >= 8 && bookingHour < 18

  return ahead24hrs && between8And18
}

// Define a validator combining various rules
export const validateClientBooking = defineValidator(
  createRule(validPensionerRate, 'Sorry, pensioner rate is only available on Mondays.'),
  createRule(legalBookingTime, `Please book appointments between 8am to 6pm at least 24 hours in advance. If you need to book outside these hours, please call ${contact_phone}.`)
)

export const validateTherapistBooking = defineValidator(
  createRule(validPensionerRate, 'Sorry, pensioner rate is only available on Mondays.'),
)

export const setCancellationTimer = async(bookingType, bookingId) => {
  const response = await fetch(auto_cancellation_timer, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      bookingType: bookingType,
      bookingId: bookingId
    })
  })

  const {status} = await response.json()

  return status //success if OK
}

export const sendReminder = async (bookingType, bookingId, bookingDate, phoneNumber, name) => {
  try {
    const config = {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      url: sms_reminder_server,
      data: {
        bookingType: bookingType,
        bookingId: bookingId,
        bookingDate: bookingDate,
        localDate: `${moment(bookingDate).format("dddd, DD/MM/YYYY")} ${moment(bookingDate).format('LT')}`,
        phoneNumber: phoneNumber,
        name: name
      }
    }
    return await axios(config)
  }
  catch (error) {
    console.error(error)
  }
}

export const sendReminders = async (bookingType, bookingId, bookingTime, phoneNumber, name) => {
  if (bookingType === BOOKING_TYPE.T) {
    sendReminder(bookingType, bookingId, bookingTime[0], phoneNumber, name)
  } else {
    for (let i = 1; i <= bookingTime.length; i++) {
      sendReminder(bookingType, `${bookingId}-${i}`, bookingTime[i-1], phoneNumber, name)
    }
  }
}

export const deleteReminder = async (bookingType, bookingId) => {
  try {
    const config = {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      url: delete_sms_reminder,
      data: {
        bookingType: bookingType,
        bookingId: bookingId
      }
    }
    return await axios(config)
  }
  catch (error) {
    console.error(error)
  }
}

export const removeReminders = async (bookingType, bookingId, eventList) => {
  if (bookingType === BOOKING_TYPE.T) {
    await deleteReminder(bookingType, bookingId)
  }
  else if (bookingType === BOOKING_TYPE.P) {
    let bTimes = []
    for (const e of eventList) {
      const time = localDate(e.booking_date, e.booking_start_time).getTime()
      if (!bTimes.includes(time))
        bTimes.push(time)
    }
    for (let i = 1; i <= bTimes.length; i++) {
      await deleteReminder(bookingType, `${bookingId}-${i}`)
    }        
  }
}

export const travelTime = async (apiToken, artistId, address, bookingValue) => {
  try {
    const config = {
      method: 'get',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`
      },
      url: `${travel_time_url}?artist_id=${artistId}&event_location=${address}&total_amount=${bookingValue}`
    }
    return await axios(config)
  }
  catch (error) {
    console.error(error)
  }
}

export const sendVerification = async (email, setKey) => {
  try {
    const reqConfig = {
      method: 'post',
      headers: {"Content-Type": "application/json"},
      url: email_verification_server,
      data: {
        email: email
      }
    }

    const sendRes = await axios(reqConfig)
    setKey(sendRes.data.code)
    return true
  }
  catch (error) {
    alert(error)
    return false
  }
}

export const getClientByName = (apiToken, name) => {
  const config = {
    method: 'get',
    headers: { 'Authorization': `Bearer ${apiToken}` },
    url: `${clients_url}?name=${name}`
  }
  return axios(config)
}

export const getClientById = (apiToken, id) => {
  const config = {
    method: 'get',
    headers: { 'Authorization': `Bearer ${apiToken}` },
    url: `${clients_url}?id=${id}`
  }
  return axios(config)
}