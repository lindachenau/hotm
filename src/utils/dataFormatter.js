import { getBookingValue } from './getBookingValue'

export function normaliseArtists(artistArr)
{
  let artists = {}

  const validStates = ['NSW', 'VIC', 'TAS', 'QLD', 'SA', 'WA']
  
  for (let i = 0; i < artistArr.length; i++ ) {
    //Filter out invalid entries so that artist selection can display the list properly
    let state = artistArr[i].state.toUpperCase()
    if (validStates.includes(state) && artistArr[i].name) {
      artists[artistArr[i].id.toString()] = {
        id: artistArr[i].id,
        name: artistArr[i].name,
        state: state,
        photo: artistArr[i].photo,
        title: artistArr[i].title,
        bio: artistArr[i].bio,
        hashtag: artistArr[i].hashtag ? artistArr[i].hashtag.replace('#', '') : "haironthemove2u"
      }
    }
  }
  
  return artists
}

export function normaliseClients(clientArr)
{
  let clients = {}
  
  for (let i = 0; i < clientArr.length; i++ ) {
    clients[clientArr[i].id.toString()] = {
      id: clientArr[i].id,
      name: clientArr[i].name,
      phone: clientArr[i].phone
    }
  }

  return clients
}

export function normaliseServices(serviceArr)
{
  let services = {}
  let cats = []
  
  for (let i = 0; i < serviceArr.length; i++ ) {
    let items = Object.values(serviceArr[i].data)
    let list = []
    for (let j = 0; j < items.length; j++ ) {
      let id = items[j].id.toString()
      list.push(id)
      services[id] = {
        cat: i,
        description: items[j].description,
        price: items[j].sale_price,
        organicPrice: items[j].organic_add_price,
        timeOnsite: items[j].time_on_site,
        onlineBooking: items[j].online_booking === 1 ? true : false
      }
    }
    cats.push({
      "name": serviceArr[i].cat,
      "list": list
    })
  }
  return { 
    "items": services, 
    "cats": cats
  }
}

function localDate(bookingDate, bookingTime)
{
  const y = bookingDate.slice(0, 4)
  const mon = bookingDate.slice(5, 7) - 1 // Jan is 0
  const d = bookingDate.slice(8)
  const h = bookingTime.slice(0, 2)
  const min = bookingTime.slice(3)

  return new Date(y, mon, d, h, min)
}
export function getEvents(bookings, artists, clients, servicesMenu)
{
  let events = []

  for (let id in bookings) {
    let serviceItems = []
    let total = 0
    let booking = bookings[id]
    let complete = (booking.total_amount - booking.paid_checkout_total - booking.paid_deposit_total) < 0.01

    //artist && client still exist
    if (artists[booking.artist_id_list[0]] && clients[booking.client_id]) {
      let itemQty = {}
      let priceFactors = {
        organic: booking.with_organic,
        pensionerRate: booking.with_pensioner_rate
      }
      for (let j = 0; j < booking.services.length; j++) {
        //Don't know why services contain invalid id. The random id is constrained to a valid range.
        if (servicesMenu[booking.services[j]]) {
          serviceItems.push(`${servicesMenu[booking.services[j]].description} Qty ${booking.quantities[j]}`)
          itemQty[booking.services[j]] = booking.quantities[j]
        }
      }

      if (complete)
        total = booking.total_amount
      else
        total = getBookingValue(servicesMenu, priceFactors, itemQty)

      /*
      * new Date(`${booking.booking_date}T${booking.booking_time}:00`) returns the local time zone on Chrome and Firefox
      * but returns the value based on the UTC standard
      */

      events.push({
        id: booking.booking_id,
        start: localDate(booking.booking_date, booking.booking_time),
        end: localDate(booking.booking_date, booking.booking_end_time),
        address: booking.event_address,
        artists: booking.artist_id_list.map(id => artists[id]),
        artistNames: booking.artist_id_list.map(id => artists[id].name).join(', '),
        client: clients[booking.client_id],
        organic: booking.with_organic,
        serviceItems: serviceItems,
        depositPaid: booking.paid_deposit_total,
        complete: complete,
        comment: booking.comment,
        total: total
      })
    }
  }

  return events
}