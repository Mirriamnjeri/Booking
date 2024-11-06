import React from 'react';

const BookingList = ({ bookings }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div 
          key={booking.id} 
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{booking.venue.name}</h4>
              <p className="text-sm text-gray-600">
                {new Date(booking.startTime).toLocaleString()} - 
                {new Date(booking.endTime).toLocaleString()}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>
          {booking.nftTicketId && (
            <div className="mt-2 text-sm text-gray-600">
              NFT Ticket: {booking.nftTicketId}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingList;