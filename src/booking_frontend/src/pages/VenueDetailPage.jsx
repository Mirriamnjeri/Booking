import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import api from '../services/api';

const VenueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const [venueData, reviewsData] = await Promise.all([
          api.getVenue(id),
          api.getVenueReviews(id),
        ]);
        setVenue(venueData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching venue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [id]);

  const handleBooking = async (bookingData) => {
    try {
      const result = await api.createBooking(
        bookingData.venueId,
        bookingData.startTime,
        bookingData.endTime
      );
      if (result.ok) {
        navigate(`/booking/${result.ok}`);
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Booking error:', error);
      // Handle error (show notification, etc.)
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-video bg-gray-200">
            {venue.virtualTourUrl ? (
              <iframe
                src={venue.virtualTourUrl}
                className="w-full h-full"
                title={`Virtual tour of ${venue.name}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">No virtual tour available</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-600">Capacity</h3>
                <p className="text-lg">{venue.capacity} people</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Base Price</h3>
                <p className="text-lg">${venue.basePrice} / hour</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Rating</h3>
                <p className="text-lg">★ {venue.currentRating.toFixed(1)}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">Sustainability Score</h3>
                <p className="text-lg">{venue.sustainabilityScore}/100</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {venue.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={`${review.userId}-${review.timestamp}`}
                className="border-b border-gray-200 pb-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="text-yellow-400 mr-2">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                    {review.verified && (
                      <span className="text-green-600 text-sm">
                        Verified Booking
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="sticky top-6">
          <BookingForm venue={venue} onSubmit={handleBooking} />
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;