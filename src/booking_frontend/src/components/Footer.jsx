import { Link } from "react-router-dom";

const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-300">
                We provide a seamless venue booking experience with blockchain-powered
                verification and NFT tickets.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/venues" className="text-gray-300 hover:text-white">
                    Browse Venues
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-gray-300 hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-gray-300 hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Email: support@venuebooking.com</li>
                <li>Phone: (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            © {new Date().getFullYear()} VenueBooking. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;