import React from 'react';
import { Link } from 'react-router-dom';

const VenueCard = ({ venue }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
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
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
        <div className="flex items-center mb-2">
          <div className="text-yellow-400">
            ★ {venue.currentRating.toFixed(1)}
          </div>
          <div className="ml-2 text-sm text-gray-600">
            Capacity: {venue.capacity}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-green-600 font-semibold">
            ${venue.basePrice} / hour
          </div>
          <Link 
            to={`/venues/${venue.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;