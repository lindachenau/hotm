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