# Blockchain-Based Venue Booking System

A modern, decentralized venue booking platform built with React and Internet Computer Protocol (ICP), featuring NFT tickets, dynamic pricing, and a comprehensive loyalty system.

## 🌟 Features

### Venue Management
- **Virtual Tours**: Immersive virtual venue exploration
- **Smart Capacity Management**: Real-time tracking and management
- **Sustainability Metrics**: Environmental impact scoring
- **Feature Tracking**: Comprehensive amenity management
- **Dynamic Descriptions**: Rich venue information

### Blockchain Integration
- **NFT Tickets**: Unique digital tickets for each booking
- **Verified Transactions**: Blockchain-backed booking security
- **Smart Contracts**: Automated booking management
- **Transparent History**: Immutable booking records

### Intelligent Pricing
- **Dynamic Pricing Engine**: Demand-based price adjustment
- **Seasonal Variations**: Automatic seasonal price modifications
- **Time-Slot Optimization**: Peak and off-peak pricing
- **Multiple Factors**: Comprehensive pricing algorithm including:
  - Demand multiplier
  - Seasonal factors
  - Duration-based pricing
  - Historical booking patterns

### User System
- **Loyalty Program**: Points-based reward system
  - Booking rewards (100 points per booking)
  - Review rewards (50 points)
  - Referral bonuses (200 points)
- **Preference Management**: Customizable user preferences
- **Privacy Controls**: Granular privacy settings
- **Booking History**: Comprehensive transaction tracking

### Booking Features
- **Real-Time Availability**: Instant slot checking
- **Multi-Stage Process**: 
  1. Initial booking creation
  2. Verification
  3. Confirmation
  4. NFT generation
- **Status Tracking**: Multiple booking states
- **Conflict Prevention**: Smart scheduling system

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Internet Computer SDK (DFX)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mirriamnjeri/Booking.git
cd Booking
```

2. Install dependencies:
```bash
npm install
```

3. Deploy the backend canister:
```bash
dfx deploy
```

4. Start the frontend development server:
```bash
npm start
```

## 🏗 Architecture

### Frontend
- React.js
- Tailwind CSS
- ShadCN UI Components
- React Router for navigation

### Backend (Internet Computer)
- Motoko programming language
- Internet Computer Protocol
- Canister-based architecture

### Smart Contract Features
- Booking management
- NFT ticket generation
- Dynamic pricing calculations
- User profile management
- Review system

## 💻 Technical Details

### Booking Flow
1. User selects venue and time slot
2. System checks availability
3. Dynamic price calculation
4. Booking creation
5. User confirmation
6. NFT ticket generation
7. Loyalty points award

### Dynamic Pricing Factors
- Base venue price
- Current demand
- Seasonal multiplier
- Time slot popularity
- Duration

### Security Features
- Blockchain verification
- Privacy settings
- Secure transactions
- Data encryption

## 📝 API Documentation

### Main Endpoints

#### Venues
- `getVenue(venueId: Text)`: Fetch venue details
- `addVirtualTour(venueId: Text, tourUrl: Text)`: Add virtual tour

#### Bookings
- `createBooking(venueId: Text, startTime: Time, endTime: Time)`: Create new booking
- `confirmBooking(bookingId: Nat)`: Confirm existing booking
- `getBooking(bookingId: Nat)`: Fetch booking details

#### Users
- `getUserProfile(userId: Principal)`: Get user profile
- `submitReview(venueId: Text, rating: Nat, comment: Text)`: Submit venue review

## 🔐 Privacy and Security

### User Privacy
- Configurable sharing settings
- Booking history privacy
- Contact information protection
- Preference sharing controls

### Data Security
- Blockchain verification
- Secure transactions
- Encrypted user data
- Protected venue information

## 📊 Business Logic

### Loyalty System
- Points awarded for:
  - Completed bookings
  - Verified reviews
  - Referrals
- Point redemption options
- Status levels

### Review System
- Verified booking reviews
- Rating aggregation
- Review rewards
- Venue ranking

## 📞 Support

For support, please create or pull request an issue in the GitHub repository.