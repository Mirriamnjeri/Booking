import React, { useState, useEffect } from 'react';
import VenueCard from '../components/VenueCard';
import VenueFilter from '../components/VenueFilter';
import api from '../services/api';

const VenueListPage = () => {
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minRating: '',
    minCapacity: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        // In a real app, you'd implement this endpoint
        const response = await api.getVenues(filters);
        setVenues(response);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <VenueFilter filters={filters} setFilters={setFilters} />
      </div>
      <div className="md:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </div>
  );
};


export default VenueListPage;