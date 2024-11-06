import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthClient } from '@dfinity/auth-client';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);

    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    if (isAuthenticated) {
      const identity = client.getIdentity();
      setIdentity(identity);
    }
  };

  const handleLogin = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: process.env.II_URL || 'https://identity.ic0.app/',
        onSuccess: () => {
          setIsAuthenticated(true);
          setIdentity(authClient.getIdentity());
        },
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            VenueBooking
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/venues" className="text-gray-700 hover:text-blue-600">
              Venues
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Internet Identity
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;