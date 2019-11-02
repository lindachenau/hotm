let faker = require('faker')
let dates = require('date-arithmetic')

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
  for (let id = 1; id <= 50; id++) {
    let name = faker.name.firstName() + ' ' + faker.name.lastName()
    let address = faker.address.streetAddress() + ' ' + faker.address.city() + ', ' + faker.address.stateAbbr() + ' ' + faker.address.zipCode()
    artists.push({
      "id": id,
      "name": name,
      "address": address,
      "email": faker.internet.email(),
      "phone": faker.phone.phoneNumber(),
      "avatar": faker.image.avatar(),
      "skill": faker.lorem.words(),
      "profile": faker.lorem.paragraph()
    })
  }

  let bookings = []
  for (let id = 1; id <= 300; id++) {
 
    let address = faker.address.streetAddress() + ' ' + faker.address.city() + ', ' + faker.address.stateAbbr() + ' ' + faker.address.zipCode()
    let start = faker.date.between('2019-10-01', '2019-12-31')
    let duration = Math.ceil(Math.random() * 5)
    let end = dates.add(start, duration, 'hours')

    /**
     * Abandon this pair of (start, end) because they are on different date.
     */
    if (!dates.eq(dates.startOf(new Date(start), 'day'), dates.startOf(new Date(end), 'day')))
     {continue;}
      

    let artist = Math.ceil(Math.random() * 50)
    let client = Math.ceil(Math.random() * 50)
    /**
     * Generate up to 5 random items out of 25 service items. Each item has up to 3 in quantity. No duplication checking for now
     */
    let noItems = Math.ceil(Math.random() * 5)
    let items = []
    let quantity = []

    for (let i = 0; i < noItems; i++) {
      items.push(Math.ceil(Math.random() * 25))
      quantity.push(Math.ceil(Math.random() * 3))
    }

    bookings.push({
      "id": id,
      "start": start,
      "end": end,
      "address": address,
      "artist": artist,
      "client": client,
      "items": items,
      "quantity": quantity
    })
  }

  let services = [
    {
      "id": 1,
      "description": "Womens Style Cut & Blow dry",
      "price": 120
    },
    {
      "id": 2,
      "description": "Mens Stye Cut",
      "price": 77
    },
    {
      "id": 3,
      "description": "Children's Hcut",
      "price": 25
    }, 
    {
      "id": 4,
      "description": "Blow dry or GHD Curls",
      "price": 99
    }, 
    {
      "id": 5,
      "description": "Half up Half down",
      "price": 125
    }, 
    {
      "id": 6,
      "description": "Up Style",
      "price": 145
    },
    {
      "id": 7,
      "description": "T section of foils, toner & blow dry",
      "price": 188
    },
    {
      "id": 8,
      "description": "T section of foils, toner & hair cut",
      "price": 228
    },
    {
      "id": 9,
      "description": "T section of foils, add tint, toner & blow dry",
      "price": 236
    }, 
    {
      "id": 10,
      "description": "T section of foils, add tint, toner & hair cut",
      "price": 276
    }, 
    {
      "id": 11,
      "description": "1/2 head foils, toner & Hair cut",
      "price": 252
    },
    {
      "id": 12,
      "description": "1/2 Head of Foils , Toner & Blow dry",
      "price": 212
    },
    {
      "id": 13,
      "description": "1/2 Head of Foils ,add tint ,toner & Blow dry",
      "price": 260
    },  
    {
      "id": 14,
      "description": "Makeup Application",
      "price": 145
    },
    {
      "id": 15,
      "description": "Specialised Makeup",
      "price": 181
    },
    {
      "id": 16,
      "description": "Keratin Treatment Short hair",
      "price": 275
    },
    {
      "id": 17,
      "description": "Full head - Tape Extensions",
      "price": 750
    },
    {
      "id": 18,
      "description": "Apply and style of your own extensions",
      "price": 181
    },
    {
      "id": 19,
      "description": "Spray Tan 1 person",
      "price": 65
    },
    {
      "id": 20,
      "description": "Hair and Makeup package 1 Person",
      "price": 266
    },
    {
      "id": 21,
      "description": "Hair and makeup package 2 people",
      "price": 532
    },
    {
      "id": 22,
      "description": "Hair and makeup package 3 people",
      "price": 687
    },
    {
      "id": 23,
      "description": "Hair and makeup package 4 people",
      "price": 916
    },
    {
      "id": 24,
      "description": "Flower girl - Hair & light makeup",
      "price": 85
    },
    {
      "id": 25,
      "description": "Bridal Hair & Makeup packages - Bride",
      "price": 280
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