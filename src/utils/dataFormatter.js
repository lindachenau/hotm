import { getBookingValue } from './getBookingValue'
import { BOOKING_TYPE } from '../actions/bookingCreator'

export const BOOKING_STATUS = {
  OPEN: 0,
  COMPLETED: 1, //Fully paid
  DELETED: 2, 
  CHECKEDOUT: 3 //Checked out but balance is unpaid
}

function offDays(workingDays) 
{
  const week = [0, 1, 2, 3, 4, 5, 6]
  const workingDaysInt = workingDays.split(",").map(day => parseInt(day))
  const offDays = week.filter(day => !workingDaysInt.includes(day))
  return offDays
}

export function normaliseArtists(artistArr)
{
  let artists = {}

  const validStates = ['NSW', 'VIC', 'TAS', 'QLD', 'SA', 'WA']
  // const validEmails = ['info@lyndlerichards.com', 'lindachenau@gmail.com', 'we@connectmobileapps.com.au', 'grace@connectmobileapps.com.au', 
  // 'cmobileapp0@gmail.com', 'jeongjen@gmail.com', 'hello@connectmobilephoneapps.page', 'sootyyu@gmail.com', 'monica@gmail.com']
  
  for (let i = 0; i < artistArr.length; i++ ) {
    //Filter out invalid entries so that artist selection can display the list properly
    let state = artistArr[i].state.toUpperCase()
    // if (validStates.includes(state) && artistArr[i].name && validEmails.includes(artistArr[i].email)) {
    if (validStates.includes(state) && artistArr[i].name && artistArr[i].email !== 'tttttt') {
      const id = artistArr[i].id
      artists[id.toString()] = {
        id: id,
        name: artistArr[i].name,
        email: artistArr[i].email,
        state: state,
        photo: artistArr[i].photo,
        title: artistArr[i].title,
        offDays: offDays(artistArr[i].working_days),
        bio: artistArr[i].bio,
        skills: artistArr[i].skill_categories.split(",").map(x => parseInt(x)),
        hashtag: artistArr[i].hashtag ? artistArr[i].hashtag.replace('#', '') : "haironthemove2u"
      }
    }
  }
  
  return artists
}

export function normaliseCorpCards(corpCardsArr)
{
  let corpCards = {}
  
  for (let i = 0; i < corpCardsArr.length; i++ ) {
    const id = corpCardsArr[i].id
    const card = {
      id: id,
      name: corpCardsArr[i].corporate_name,
      address: corpCardsArr[i].event_address,
      contactPerson: corpCardsArr[i].contact_name,
      contactPhone: corpCardsArr[i].contact_phone,
      contactEmail: corpCardsArr[i].contact_email,
      hblcRate: corpCardsArr[i].hotm_rate,
      therapistRate: corpCardsArr[i].artist_rate
    }
    corpCards[id.toString()] = card
  }

  return corpCards
}

export function normaliseAdminTasks(adminTasksArr)
{
  let adminTasks = []
  
  for (let i = 0; i < adminTasksArr.length; i++ ) {
    const task = {
      id: adminTasksArr[i].id,
      name: adminTasksArr[i].description
    }
    adminTasks.push(task)
  }

  return adminTasks
}

export function normaliseClients(clientArr)
{
  let clients = {}
  
  for (let i = 0; i < clientArr.length; i++ ) {
    const id = clientArr[i].id
    clients[id.toString()] = {
      id: id,
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
        id: items[j].id,
        cat: i,
        description: items[j].description,
        price: items[j].sale_price,
        organicPrice: items[j].organic_add_price,
        timeOnsite: items[j].time_on_site,
        onlineBooking: items[j].online_booking === 1 ? true : false
      }
    }
    cats.push({
      name: serviceArr[i].cat,
      list: list,
      catId : i + 1
    })
  }
  return { 
    items: services, 
    cats: cats
  }
}

export function localDate(bookingDate, bookingTime)
{
  const y = bookingDate.slice(0, 4)
  const mon = bookingDate.slice(5, 7) - 1 // Jan is 0
  const d = bookingDate.slice(8)
  const h = bookingTime.slice(0, 2)
  const min = bookingTime.slice(3)

  return new Date(y, mon, d, h, min)
}

export function getAdminBookings(bookingTypeName, bookings, artists, clients, servicesMenu, corpCards)
{
  let adminBookings = []
  const deletedClient = {
    name: "Deleted Client",
    phone: "",
    email: "",
    address: ""
  }

  for (const id in bookings) {
    const booking = bookings[id]
    const cId = booking.card_or_client_id.toString()
    const title = bookingTypeName === BOOKING_TYPE.C ? corpCards[cId].name : `${servicesMenu[booking.service_item.toString()].description}`
    const contact = bookingTypeName === BOOKING_TYPE.C ? `${corpCards[cId].contactPerson} - ${corpCards[cId].contactPhone}` : `${clients[cId].name} - ${clients[cId].phone}`
    const email = bookingTypeName === BOOKING_TYPE.C ? corpCards[cId].contactEmail : clients[cId].email
    let status = BOOKING_STATUS.OPEN
    
    if (booking.deleted) 
      status = BOOKING_STATUS.DELETED
    else if ((booking.total_amount - booking.paid_amount) < 0.01)
      status = BOOKING_STATUS.COMPLETED

    let eventList = []
    booking.event_list.forEach(event => {
      if (artists[event.artist_id]) {
        const eventDetail = `${event.booking_date} / ${artists[event.artist_id].name} / ${event.job_description}`
        eventList.push(eventDetail)
      }
    })
    adminBookings.push({
      id: booking.booking_id,
      title: title,
      contact: contact,
      email: email,
      total: booking.total_amount,
      paidAmount: booking.paid_amount,
      stripeId: booking.stripe_id,
      totalHours: booking.total_hours_booked,
      serviceItem: booking.service_item,
      eventList: eventList,
      cId: booking.card_or_client_id,
      client: clients[booking.card_or_client_id] ? clients[booking.card_or_client_id] : deletedClient,
      origEventList: booking.event_list,
      status: status
    })
  }

  //sort in ascending order
  return adminBookings.sort(function(a, b) {return a.eventList[0] - b.eventList[0]})
}

export function getEvents(bookings, artists, clients, servicesMenu)
{
  let events = []
  const deletedClient = {
    name: "Deleted Client",
    phone: "",
    email: "",
    address: ""
  }

  for (let id in bookings) {
    let serviceItems = []
    let total = 0
    let booking = bookings[id]
    let status = BOOKING_STATUS.OPEN
    
    if (booking.deleted) 
      status = BOOKING_STATUS.DELETED
    else if ((booking.total_amount - booking.paid_amount) < 0.01)
      status = BOOKING_STATUS.COMPLETED
    else if (booking.status === 'checkout')
      status = BOOKING_STATUS.CHECKEDOUT

    //artist exists
    if (artists[booking.artist_id_list[0]]) {
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

      if (status === BOOKING_STATUS.COMPLETED)
        total = booking.total_amount
      else
        total = getBookingValue(servicesMenu, priceFactors, itemQty)

      /*
      * new Date(`${booking.booking_date}T${booking.booking_start_time}:00`) returns the local time zone on Chrome and Firefox
      * but returns the value based on the UTC standard
      */

      events.push({
        id: booking.booking_id,
        type: 'hotm',
        start: localDate(booking.booking_date, booking.artist_start_time),
        bookingTime: localDate(booking.booking_date, booking.booking_start_time),
        end: localDate(booking.booking_date, booking.booking_end_time),
        address: booking.event_address,
        artists: booking.artist_id_list.map(id => artists[id]),
        artistName: booking.artist_id_list.map(id => artists[id].name).join(', '),
        client: clients[booking.client_id] ? clients[booking.client_id] : deletedClient,
        organic: booking.with_organic,
        serviceItems: serviceItems,
        paidAmount: booking.paid_amount,
        stripeId: booking.stripe_id,
        status: status,
        comment: booking.comment,
        actualStart: booking.actual_start_time ? localDate(booking.booking_date, booking.actual_start_time) : null,
        actualEnd: booking.actual_end_time ? localDate(booking.booking_date, booking.actual_end_time) : null,
        total: total,
        origBooking: booking
      })
    }
  }

  //sort in ascending order
  return events.sort(function(a, b) {return a.start - b.start})
}