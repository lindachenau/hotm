import { miniOrangeAccessKey } from '../ApiKeys'
/*
 * Hair On the Move 2 U Home page
 */
export const home_url = "https://procomhost.com"
// export const home_url = "https://appvelation.app"


/*
 * The active custom booking api
 */
const HOTM_BOOKING_API = home_url + "/hotm_booking/api/v0.8"
export const services_url = HOTM_BOOKING_API + "/services"
export const artists_url = HOTM_BOOKING_API + "/artists"
export const bookings_url = HOTM_BOOKING_API + "/bookings"
export const available_artists_url = HOTM_BOOKING_API + '/get_available_artists.php'

/*
 * Simulated data for testing
 */
// export const artists_url = 'http://localhost:5000/artists'
// export const bookings_url = 'http://localhost:5000/bookings'

/*
 * JSON API Auth & JSON API User Plugin
 */
export const register_nonce_url = home_url + "/api/get_nonce/?controller=user&method=register"
export const register_url = home_url + "/api/user/register"
export const update_user_meta_url = home_url + "/api/user/update_user_meta_vars"
export const auth_url = home_url + "/api/auth/generate_auth_cookie"
export const reset_pw_url = home_url + "/api/user/retrieve_password/?user_login="

/*
 * miniOrange API Authentication
 */
// export const user_url = home_url + "/wp-json/wp/v2/users"
// Use relative path in development mode to make use of proxy
export const user_url = "/wp-json/wp/v2/users"
// Username : Password authentication
// export const access_token = "Basic YmxhY2tjYXQ6QEdhdmluJlMwMHR5"
// Client-ID : Client-Secret authentication
export const access_token = miniOrangeAccessKey

/*
 * Instagram root for artists
 */
export const instagram_url = "https://www.instagram.com/explore/tags/"

/*
 * Hair On the Move 2 U Terms & Conditions
 */
export const term_url = home_url + "/terms-conditions/"