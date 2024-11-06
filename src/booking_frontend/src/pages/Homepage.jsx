import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Perfect Venue
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Secure, transparent, and easy venue booking with blockchain verification
        </p>
        <Link
          to="/venues"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700"
        >
          Browse Venues
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'Verified Bookings',
            description: 'Every booking is verified on the blockchain for security',
            icon: '🔒',
          },
          {
            title: 'NFT Tickets',
            description: 'Receive unique NFT tickets for your bookings',
            icon: '🎫',
          },
          {
            title: 'Virtual Tours',
            description: 'Explore venues virtually before booking',
            icon: '🏛️',
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="text-center p-6 bg-white rounded-lg shadow-md"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;