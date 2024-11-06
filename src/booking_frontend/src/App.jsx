import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Homepage';
import VenueListPage from './pages/VenueListPage';
import VenueDetailPage from './pages/VenueDetailPage';
import BookingPage from './pages/BookingPage';
import UserProfilePage from './pages/UserProfilePage';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

const App = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/venues" element={<VenueListPage />} />
                <Route path="/venues/:id" element={<VenueDetailPage />} />
                <Route path="/booking/:venueId" element={<BookingPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;