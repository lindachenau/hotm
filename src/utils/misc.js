import { contact_phone, payment_link_sender } from '../config/dataLinks'

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

export const sendPaymentLink = async (email, link, message) => {
  const response = await fetch(payment_link_sender, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email,
      body: `<h3>Please click the link below for payment.</h3>
      <a href=${link}>${message}</a>`,
      subject: 'Payment link for Hair Beauty Life Co booking',
      source: "cmobileapp0@gmail.com"   
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