import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const bookingData = await api.getBooking(bookingId);
        if (bookingData) {
          setBooking(bookingData);
          const venueData = await api.getVenue(bookingData.venueId);
          setVenue(venueData);
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const result = await api.confirmBooking(bookingId);
      if (result.ok) {
        // Refresh booking data to get NFT ticket
        const updatedBooking = await api.getBooking(bookingId);
        setBooking(updatedBooking);
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!booking || !venue) {
    return <div>Booking not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Booking Confirmation</h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-gray-600">Venue</h3>
              <p className="text-lg font-medium">{venue.name}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Status</h3>
              <p className="text-lg font-medium">{formatStatus(booking.status)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Start Time</h3>
              <p className="text-lg">
                {new Date(booking.startTime / 1000000).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">End Time</h3>
              <p className="text-lg">
                {new Date(booking.endTime / 1000000).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Price</h3>
              <p className="text-lg font-medium">
                ${(booking.price / 100).toFixed(2)}
              </p>
            </div>
            {booking.nftTicketId && (
              <div>
                <h3 className="text-sm text-gray-600">NFT Ticket</h3>
                <p className="text-lg text-blue-600">{booking.nftTicketId}</p>
              </div>
            )}
          </div>

          {booking.status === '#pending' && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {confirming ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;