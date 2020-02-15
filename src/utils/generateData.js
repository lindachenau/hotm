let faker = require('faker')
let dates = require('date-arithmetic')
let moment = require('moment')


faker.locale = "en_AU"
function generateData () {
  let clients = []
  for (let id = 1; id <= 50; id++) {
    let name = faker.name.firstName() + ' ' + faker.name.lastName()
    let email = faker.internet.email()
    let phone = faker.phone.phoneNumber()
    let address = faker.address.streetAddress() + ' ' + faker.address.city() + ', ' + faker.address.stateAbbr() + ' ' + faker.address.zipCode()
    clients.push({
      "id": id,
      "name": name,
      "address": address,
      "email": email,
      "phone": phone
    })
  }

  let artists = []
  for (let id = 1; id <= 300; id++) {
    let name = faker.name.firstName() + ' ' + faker.name.lastName()
    let address = faker.address.city() + ', ' + faker.address.stateAbbr() + ' ' + faker.address.zipCode()
    let state = faker.address.stateAbbr()
    let max_travel_distance = Math.ceil(Math.random() * 5) + Math.ceil(Math.random() * 25)
    
    let noItems = Math.ceil(Math.random() * 7)
    let items = []

    for (let i = 0; i < noItems; i++) {
      let item = Math.ceil(Math.random() * 7)
      if (!items.includes(item))
        items.push(item)
    }

    artists.push({
      "id": id,
      "name": name,
      "instagram_handle": "@nadineterens",
      "state" : state,
      "hashtag": "#hotm2unadine",
      "phone": faker.phone.phoneNumber(),
      "email": faker.internet.email(),
      "address": address,
      "bio": faker.lorem.paragraph(),
      "title": faker.lorem.words(),
      "photo": faker.image.avatar(),
      "max_travel_distance": max_travel_distance,
      "services": items.sort()
    })
  }

  let bookings = []
  for (let id = 1; id <= 10; id++) {
 
    let address = faker.address.streetAddress() + ' ' + faker.address.city() + ', ' + faker.address.stateAbbr() + ' ' + faker.address.zipCode()
    let start = faker.date.between('2019-10-01', '2019-12-31')
    let duration = Math.ceil(Math.random() * 5)
    let end = dates.add(start, duration, 'hours')
    let booking_date = moment(start).format("YYYY-MM-DD")
    let booking_time = moment(start).format("HH:mm")
    let booking_end_time = moment(end).format("HH:mm")

    /**
     * Abandon this pair of (start, end) because they are on different date.
     */
    if (!dates.eq(dates.startOf(new Date(start), 'day'), dates.startOf(new Date(end), 'day')))
     {continue;}
      

    let artist = Math.ceil(Math.random() * 300)
    let client = Math.ceil(Math.random() * 50)
    let organic = Math.floor(Math.random() * 2)
    let pensionerRate = Math.floor(Math.random() * 2)
    /**
     * Generate up to 5 random items out of 63 service items. Each item has up to 3 in quantity. No duplication checking for now
     */
    let noItems = Math.ceil(Math.random() * 5)
    let items = []
    let quantity = []

    for (let i = 0; i < noItems; i++) {
      items.push(Math.floor(Math.random() * 63))
      quantity.push(Math.ceil(Math.random() * 3))
    }

    bookings.push({
      "booking_id": id,
      "booking_date": booking_date,
      "booking_time": booking_time,
      "booking_end_time": booking_end_time,
      "event_address": address,
      "artist_id": artist,
      "client_id": client,
      "services": items,
      "quantities": quantity,
      "with_organic": organic,
      "with_pensioner_rate": pensionerRate,
      "total_amount": 0,
      "payment_amount": 0,
      "comment": ""
    })
  }

  let services = [
    {
      "cat": "STYLING",
      "data": [
        {
          "id": 0,
          "description": "Blow dry or GHD Curls",
          "sale_price": 99.0,
          "organic_add_price": 99.0,
          "time_on_site": 45.0
        },
        {
          "id": 1,
          "description": "Blow dry & GHD curls",
          "sale_price": 115.0,
          "organic_add_price": 115.0,
          "time_on_site": 50.0
        },
        {
          "id": 2,
          "description": "Half up Half down",
          "sale_price": 125.0,
          "organic_add_price": 125.0,
          "time_on_site": 55.0
        },
        {
          "id": 3,
          "description": "Up Style",
          "sale_price": 145.0,
          "organic_add_price": 145.0,
          "time_on_site": 60.0
        },
        {
          "id": 4,
          "description": "Womens Style Cut & Blow dry",
          "sale_price": 120.0,
          "organic_add_price": 120.0,
          "time_on_site": 60.0
        },
        {
          "id": 5,
          "description": "Mens Stye Cut",
          "sale_price": 80.0,
          "organic_add_price": 80.0,
          "time_on_site": 45.0
        },
        {
          "id": 6,
          "description": "Children's Hcut",
          "sale_price": 25.0,
          "organic_add_price": 25.0,
          "time_on_site": 25.0
        }
      ]
    },
    {
      "cat": "COLOUR",
      "data": [
        {
          "id": 7,
          "description": "Partical foils ",
          "sale_price": 50.0,
          "organic_add_price": 62.0,
          "time_on_site": 25.15
        },
        {
          "id": 8,
          "description": "T section of foils ",
          "sale_price": 121.0,
          "organic_add_price": 149.0,
          "time_on_site": 60.0
        },
        {
          "id": 9,
          "description": "1/2 Head of Foils ",
          "sale_price": 146.0,
          "organic_add_price": 180.0,
          "time_on_site": 70.0
        },
        {
          "id": 10,
          "description": "3/4 Head of foils ",
          "sale_price": 182.0,
          "organic_add_price": 224.0,
          "time_on_site": 75.0
        },
        {
          "id": 11,
          "description": "Full head of highlights",
          "sale_price": 300.0,
          "organic_add_price": 369.0,
          "time_on_site": 160.0
        },
        {
          "id": 12,
          "description": "Scalp bleach ",
          "sale_price": 120.0,
          "organic_add_price": 148.0,
          "time_on_site": 95.0
        },
        {
          "id": 13,
          "description": "Balayage ends only ",
          "sale_price": 181.0,
          "organic_add_price": 223.0,
          "time_on_site": 80.0
        },
        {
          "id": 14,
          "description": "Colour correction ",
          "sale_price": 300.0,
          "organic_add_price": 369.0,
          "time_on_site": 240.0
        },
        {
          "id": 15,
          "description": "Tint Retouch ",
          "sale_price": 85.0,
          "organic_add_price": 105.0,
          "time_on_site": 70.0
        },
        {
          "id": 16,
          "description": "Tint retouch refresh short",
          "sale_price": 115.0,
          "organic_add_price": 141.0,
          "time_on_site": 75.0
        },
        {
          "id": 17,
          "description": "Tint retouch refresh- Medium",
          "sale_price": 130.0,
          "organic_add_price": 160.0,
          "time_on_site": 75.0
        },
        {
          "id": 18,
          "description": "Tint retouch refresh- Long- ",
          "sale_price": 175.0,
          "organic_add_price": 215.0,
          "time_on_site": 75.0
        },
        {
          "id": 19,
          "description": "Add Tint to colour ",
          "sale_price": 50.0,
          "organic_add_price": 62.0,
          "time_on_site": 75.0
        },
        {
          "id": 20,
          "description": "Structure repair treatment with colour",
          "sale_price": 25.0,
          "organic_add_price": 31.0,
          "time_on_site": 30.0
        },
        {
          "id": 21,
          "description": "Toner ",
          "sale_price": 35.0,
          "organic_add_price": 43.0,
          "time_on_site": 25.0
        }
      ]
    },
    {
      "cat": "MAKEUP",
      "data": [
        {
          "id": 22,
          "description": "Makeup Application",
          "sale_price": 145.0,
          "organic_add_price": 145.0,
          "time_on_site": 60.0
        },
        {
          "id": 23,
          "description": "Specialised Makeup",
          "sale_price": 181.0,
          "organic_add_price": 181.0,
          "time_on_site": 120.0
        },
        {
          "id": 24,
          "description": "Hair and Makeup package 1 Person",
          "sale_price": 266.0,
          "organic_add_price": 270.0,
          "time_on_site": 90.0
        },
        {
          "id": 25,
          "description": "Hair and makeup package 2 people",
          "sale_price": 484.0,
          "organic_add_price": 484.0,
          "time_on_site": 180.0
        },
        {
          "id": 26,
          "description": "Hair and Makeup package 3 people.",
          "sale_price": 687.0,
          "organic_add_price": 690.0,
          "time_on_site": 270.0
        },
        {
          "id": 27,
          "description": "Hair and makeup package 4 people",
          "sale_price": 916.0,
          "organic_add_price": 920.0,
          "time_on_site": 360.0
        },
        {
          "id": 28,
          "description": "Hair and makeup package 5 people",
          "sale_price": 1145.0,
          "organic_add_price": 1150.0,
          "time_on_site": 450.0
        },
        {
          "id": 29,
          "description": "Hair and Makeup artist Half day",
          "sale_price": 550.0,
          "organic_add_price": 500.0,
          "time_on_site": 300.0
        },
        {
          "id": 30,
          "description": "Hair and Makeup artists Full Day",
          "sale_price": 1100.0,
          "organic_add_price": 1000.0,
          "time_on_site": 600.0
        }
      ]
    },
    {
      "cat": "EXTENSIONS",
      "data": [
        {
          "id": 31,
          "description": "Application of own Extensions",
          "sale_price": 181.0,
          "organic_add_price": 223.0,
          "time_on_site": 0.0
        },
        {
          "id": 32,
          "description": "Tape Extensions move up",
          "sale_price": 181.0,
          "organic_add_price": 223.0,
          "time_on_site": 0.0
        },
        {
          "id": 33,
          "description": "Full head -Tape Extensions",
          "sale_price": 750.0,
          "organic_add_price": 923.0,
          "time_on_site": 0.0
        },
        {
          "id": 34,
          "description": "Tape Extensions Half head",
          "sale_price": 400.0,
          "organic_add_price": 492.0,
          "time_on_site": 0.0
        }
      ]
    },
    {
      "cat": "KERATIN TREATMENTS",
      "data": [
        {
          "id": 35,
          "description": "Keratin Treatment Short hair",
          "sale_price": 200.0,
          "organic_add_price": 246.0,
          "time_on_site": 32.0
        },
        {
          "id": 36,
          "description": "Keratin Treatment Medium length hair",
          "sale_price": 275.0,
          "organic_add_price": 290.0,
          "time_on_site": 32.5
        },
        {
          "id": 37,
          "description": "Keratin Treatment- Long hair",
          "sale_price": 350.0,
          "organic_add_price": 350.0,
          "time_on_site": 33.0
        }
      ]
    },
    {
      "cat": "SPRAY TAN",
      "data": [
        {
          "id": 38,
          "description": "Spray Tan 2 or more people",
          "sale_price": 50.0,
          "organic_add_price": 62.0,
          "time_on_site": 20.0
        },
        {
          "id": 39,
          "description": "Spray Tan 1 person",
          "sale_price": 65.0,
          "organic_add_price": 80.0,
          "time_on_site": 40.0
        }
      ]
    },
    {
      "cat": "BRIDAL",
      "data": [
        {
          "id": 40,
          "description": "Bridal Makeup",
          "sale_price": 181.0,
          "organic_add_price": 200.0,
          "time_on_site": 60.0
        },
        {
          "id": 41,
          "description": "Bridal Hair",
          "sale_price": 181.0,
          "organic_add_price": 200.0,
          "time_on_site": 60.0
        },
        {
          "id": 42,
          "description": "Bridesmaids Hair",
          "sale_price": 145.0,
          "organic_add_price": 145.0,
          "time_on_site": 60.0
        },
        {
          "id": 43,
          "description": "Bridesmaid Makeup",
          "sale_price": 145.0,
          "organic_add_price": 145.0,
          "time_on_site": 60.0
        },
        {
          "id": 44,
          "description": "Bridal Hair & Makeup packages",
          "sale_price": 290.0,
          "organic_add_price": 290.0,
          "time_on_site": 2.0
        },
        {
          "id": 45,
          "description": "Bridal Hair & Makeup packages- 2 people",
          "sale_price": 532.0,
          "organic_add_price": 556.0,
          "time_on_site": 3.0
        },
        {
          "id": 46,
          "description": "Bridal Hair and Makeup packages- 3 people",
          "sale_price": 798.0,
          "organic_add_price": 822.0,
          "time_on_site": 5.5
        },
        {
          "id": 47,
          "description": "Bridal Hair & Makeup packages 4 people",
          "sale_price": 1064.0,
          "organic_add_price": 1088.0,
          "time_on_site": 6.5
        },
        {
          "id": 48,
          "description": "Bridal Hair and Makeup package 5 people",
          "sale_price": 1330.0,
          "organic_add_price": 1354.0,
          "time_on_site": 7.5
        },
        {
          "id": 49,
          "description": "Flower girl- Hair & light makeup",
          "sale_price": 85.0,
          "organic_add_price": 85.0,
          "time_on_site": 0.25
        },
        {
          "id": 50,
          "description": "Bridal Hair & Makeup packages with 2 artist- 3 people.",
          "sale_price": 870.0,
          "organic_add_price": 870.0,
          "time_on_site": 3.0
        },
        {
          "id": 51,
          "description": "Bridal Hair & Makeup packages with 2 artist- 4 people.",
          "sale_price": 1160.0,
          "organic_add_price": 1160.0,
          "time_on_site": 4.0
        },
        {
          "id": 52,
          "description": "Bridal Hair & Makeup packages with 2 artist- 5 people.",
          "sale_price": 1450.0,
          "organic_add_price": 1450.0,
          "time_on_site": 5.0
        },
        {
          "id": 53,
          "description": "Bridal Hair & Makeup packages with 2 artist- 6 people.",
          "sale_price": 1740.0,
          "organic_add_price": 1740.0,
          "time_on_site": 6.0
        },
        {
          "id": 54,
          "description": "Bridal Hair & Makeup packages with 2 artist- 7 people.",
          "sale_price": 2030.0,
          "organic_add_price": 2030.0,
          "time_on_site": 7.0
        },
        {
          "id": 55,
          "description": "Bridal Hair & Makeup packages with 4 artist- 8 people.",
          "sale_price": 2320.0,
          "organic_add_price": 2610.0,
          "time_on_site": 4.0
        },
        {
          "id": 56,
          "description": "Bridal Hair & Makeup packages with 4 artist- 9 people.",
          "sale_price": 2610.0,
          "organic_add_price": 2900.0,
          "time_on_site": 5.0
        },
        {
          "id": 57,
          "description": "Bridal Hair & Makeup packages with 4 artist- 10 people.",
          "sale_price": 2900.0,
          "organic_add_price": 3190.0,
          "time_on_site": 5.0
        },
        {
          "id": 58,
          "description": "Bridal Hair & Makeup packages with 4 artist- 11 people.",
          "sale_price": 3190.0,
          "organic_add_price": 3480.0,
          "time_on_site": 5.5
        },
        {
          "id": 59,
          "description": "Bridal Hair & Makeup packages with 4 artist- 12 people.",
          "sale_price": 3480.0,
          "organic_add_price": 3770.0,
          "time_on_site": 6.0
        },
        {
          "id": 60,
          "description": "Bridal Hair & Makeup packages with 4 artist- 13 people.",
          "sale_price": 3770.0,
          "organic_add_price": 4060.0,
          "time_on_site": 6.6
        },
        {
          "id": 61,
          "description": "Bridal Hair & Makeup packages with 4 artist- 14 people.",
          "sale_price": 4060.0,
          "organic_add_price": 4350.0,
          "time_on_site": 7.0
        },
        {
          "id": 62,
          "description": "Bridal Hair & Makeup packages with 4 artist- 15 people.",
          "sale_price": 4350.0,
          "organic_add_price": 4640.0,
          "time_on_site": 8.0
        }
      ]
    }
  ]

  return { 
    "clients": clients,
    "artists": artists,
    "bookings": bookings,
    "services": services
  }
}


module.exports = generateData