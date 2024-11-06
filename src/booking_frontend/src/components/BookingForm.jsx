import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = ({ venue, onSubmit }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
        venueId: venue.id
      });
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Book {venue.name}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date & Time
          </label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date & Time
          </label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={startDate || new Date()}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !startDate || !endDate}
          className={`w-full py-2 px-4 rounded-md text-white 
            ${loading || !startDate || !endDate 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;