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

export const getDepositPayable = (totalBookingValue) => {
  return (totalBookingValue * 0.3).toFixed(2)
}
