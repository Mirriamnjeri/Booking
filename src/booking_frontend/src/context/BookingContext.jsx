import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);

  const addBooking = (booking) => {
    setBookings([...bookings, booking]);
  };

  const updateBooking = (bookingId, updatedBooking) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? updatedBooking : booking
    ));
  };

  return (
    <BookingContext.Provider value={{ 
      bookings, 
      activeBooking, 
      addBooking, 
      updateBooking, 
      setActiveBooking 
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);