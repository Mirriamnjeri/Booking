import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookingList from '../components/BookingList';
import api from '../services/api';

const UserProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status) => {
    const colors = {
      '#pending': 'rgb(234 179 8)',    // yellow-600
      '#confirmed': 'rgb(22 163 74)',   // green-600
      '#cancelled': 'rgb(239 68 68)',   // red-600
      '#completed': 'rgb(59 130 246)',  // blue-600
      '#disputed': 'rgb(236 72 153)'    // pink-600
    };
    return colors[status] || 'rgb(107 114 128)'; // gray-600 default
  };
  
  const formatStatus = (status) => {
    return status.replace('#', '').charAt(0).toUpperCase() + 
           status.slice(2).toLowerCase();
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userProfile = await api.getUserProfile(user);
        if (userProfile) {
          setProfile(userProfile);
          // Fetch all bookings in parallel
          const bookingPromises = userProfile.bookingHistory.map(id => 
            api.getBooking(id)
          );
          const bookingResults = await Promise.all(bookingPromises);
          setBookings(bookingResults.filter(booking => booking !== null));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-600">Loyalty Points</h3>
              <p className="text-xl font-semibold">{profile.loyaltyPoints}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Preferences</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.preferences.map((pref) => (
                  <span
                    key={pref}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Privacy Settings</h3>
              <div className="space-y-2 mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.privacySettings.shareBookingHistory}
                    onChange={() => {/* Implement privacy toggle */}}
                    className="mr-2"
                  />
                  Share Booking History
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.privacySettings.sharePreferences}
                    onChange={() => {/* Implement privacy toggle */}}
                    className="mr-2"
                  />
                  Share Preferences
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.privacySettings.shareContact}
                    onChange={() => {/* Implement privacy toggle */}}
                    className="mr-2"
                  />
                  Share Contact Information
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Booking History</h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.venueId}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.startTime / 1000000).toLocaleString()} - 
                      {new Date(booking.endTime / 1000000).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-3 py-1 rounded-full text-sm font-medium mb-2"
                          style={{
                            backgroundColor: getStatusColor(booking.status),
                            color: 'white'
                          }}>
                      {formatStatus(booking.status)}
                    </span>
                    {booking.nftTicketId && (
                      <span className="text-sm text-blue-600">
                        NFT: {booking.nftTicketId}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-lg font-medium">
                    ${(booking.price / 100).toFixed(2)}
                  </span>
                  {booking.status === '#pending' && (
                    <button
                      onClick={() => handleConfirmBooking(booking.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Confirm Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;