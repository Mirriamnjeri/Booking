import React from 'react';

const VenueFilter = ({ filters, setFilters }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price Range
          </label>
          <div className="mt-2 flex items-center space-x-4">
            <input
              type="number"
              placeholder="Min"
              className="w-24 px-3 py-2 border rounded-md"
              value={filters.minPrice}
              onChange={(e) => setFilters({
                ...filters,
                minPrice: e.target.value
              })}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-24 px-3 py-2 border rounded-md"
              value={filters.maxPrice}
              onChange={(e) => setFilters({
                ...filters,
                maxPrice: e.target.value
              })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Minimum Rating
          </label>
          <select
            className="mt-2 w-full px-3 py-2 border rounded-md"
            value={filters.minRating}
            onChange={(e) => setFilters({
              ...filters,
              minRating: e.target.value
            })}
          >
            <option value="">Any</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Capacity
          </label>
          <input
            type="number"
            placeholder="Minimum capacity"
            className="mt-2 w-full px-3 py-2 border rounded-md"
            value={filters.minCapacity}
            onChange={(e) => setFilters({
              ...filters,
              minCapacity: e.target.value
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default VenueFilter;