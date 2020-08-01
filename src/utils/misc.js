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