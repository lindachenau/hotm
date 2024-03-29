/*
 * Hair Beauty Life Co Home page
 */
export const hblc_url = process.env.REACT_APP_HBLC_URL
export const home_url = process.env.REACT_APP_HOTM_BACKEND
export const corporate_url = `${home_url}/contact-us/`
export const contact_phone = "1300 849 777"
export const payment_link_base = process.env.REACT_APP_PAYMENT_LINK_BASE

/*
 * The active custom booking api
 */
const HOTM_BOOKING_API = `${home_url}/hotm_booking/api/release`
export const services_url = `${HOTM_BOOKING_API}/services`
export const artists_url = `${HOTM_BOOKING_API}/artists`
export const bookings_url = `${HOTM_BOOKING_API}/bookings`
export const corporate_cards_url = `${HOTM_BOOKING_API}/corporate/cards`
export const admin_tasks_url = `${HOTM_BOOKING_API}/admin/tasks`
export const admin_bookings_url = `${HOTM_BOOKING_API}/admin/bookings`
export const available_artists_url = `${HOTM_BOOKING_API}/get_available_artists.php`
export const calendar_events_url = `${HOTM_BOOKING_API}/calendar_events`
export const booking_events_url = `${HOTM_BOOKING_API}/booking_events`
export const clients_url = `${HOTM_BOOKING_API}/clients`
export const reset_password_url = `${HOTM_BOOKING_API}/reset_psw.php`
export const travel_time_url = `${HOTM_BOOKING_API}/travel_time`
export const api_token_login = `${HOTM_BOOKING_API}/login`

/*
 * HBLC logo 120x120 hosted in the live website for payment link embedded logo
 */
export const hblc_logo = 'https://hairbeautylifeco.com/wp-content/uploads/2021/06/HBLC-logo-120.png'

export const booking_website = 'https://hblc1.vercel.app'

export const admin_email = 'admin@hairbeautylifeco.com'

/*
 * JSON API Auth & JSON API User Plugin
 */
export const register_nonce_url = `${home_url}/api/get_nonce/?controller=user&method=register`
export const register_url = `${home_url}/api/user/register`
export const update_user_meta_url = `${home_url}/api/user/update_user_meta_vars`
export const auth_url = `${home_url}/api/auth/generate_auth_cookie`
export const reset_pw_url = `${home_url}/api/user/retrieve_password/?user_login=`

/*
 * Instagram root for artists
 */
export const instagram_url = "https://www.instagram.com/explore/tags/"

/*
 * Hair Beauty Life Co Terms & Conditions
 */
export const term_url = `${hblc_url}/terms-conditions/`

/*
 * Stripe payment link sender running on Node.js deployed to AWS lambda
 */
export const payment_link_sender = `${process.env.REACT_APP_HOTM_SERVER}/sendemail`

/*
 * Stripe charge server running on Node.js deployed to AWS lambda
 */
export const stripe_charge_server = `${process.env.REACT_APP_HOTM_SERVER}/charge`

/*
 * Stripe refund server running on Node.js deployed to AWS lambda
 */
export const stripe_refund_server = `${process.env.REACT_APP_HOTM_SERVER}/refund`

/*
 * Email verification server running on Node.js deployed to AWS lambda
 */
export const email_verification_server = `${process.env.REACT_APP_HOTM_SERVER}/send`

/*
 * SMS reminder server running on Node.js deployed to AWS lambda
 */
export const sms_reminder_server = `${process.env.REACT_APP_HOTM_SERVER}/schedule`

/*
 * SMS reminder deletion running on Node.js deployed to AWS lambda
 */
export const delete_sms_reminder = `${process.env.REACT_APP_HOTM_SERVER}/deletereminder`

/*
 * 12 hours auto cancellation timer running on Node.js deployed to AWS lambda
 */
export const auto_cancellation_timer = `${process.env.REACT_APP_HOTM_SERVER}/cancellation-timer`