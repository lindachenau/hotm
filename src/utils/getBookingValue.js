export const getBookingValue = (items, priceFactors, itemQty) => {
  let total = 0
  let organic = priceFactors.organic
  let pensioner = priceFactors.pensionerRate

  for (let id of Object.keys(itemQty)) {
    let qty = itemQty[id]
    total += (organic ? items[id].organicPrice : items[id].price) * (pensioner ? 0.8 : 1) * qty
  }
  
  return total.toFixed(2)
}

export const getDepositPayable = (itemQty, totalBookingValue) => {
  const isPackageBooking = Object.keys(itemQty).filter(id => parseInt(id) >= 44).length > 0
  return isPackageBooking ? totalBookingValue/2 : 50
}
