import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../../../declarations/booking_backend';

const agent = new HttpAgent({
  host: process.env.REACT_APP_IC_HOST || 'http://localhost:8000',
});

if (process.env.NODE_ENV !== 'production') {
  agent.fetchRootKey().catch(console.error);
}

const venueBookingActor = Actor.createActor(idlFactory, {
  agent,
  canisterId: 'bkyz2-fmaaa-aaaaa-qaaaq-cai' ,
});

export const api = {
  // Venue-related functions
  async getVenue(venueId) {
    return await venueBookingActor.getVenue(venueId);
  },

  async getVenueReviews(venueId) {
    return await venueBookingActor.getVenueReviews(venueId);
  },

  // Booking-related functions
  async createBooking(venueId, startTime, endTime) {
    return await venueBookingActor.createBooking(venueId, startTime, endTime);
  },

  async confirmBooking(bookingId) {
    return await venueBookingActor.confirmBooking(bookingId);
  },

  async getBooking(bookingId) {
    return await venueBookingActor.getBooking(bookingId);
  },

  // User-related functions
  async getUserProfile(userId) {
    return await venueBookingActor.getUserProfile(userId);
  },

  async submitReview(venueId, rating, comment) {
    return await venueBookingActor.submitReview(venueId, rating, comment);
  },
};

export default api;