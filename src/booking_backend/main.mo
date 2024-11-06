import Principal "mo:base/Principal";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Float "mo:base/Float";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

actor VenueBookingSystem {
    // Types
    type BookingId = Nat;
    type UserId = Principal;
    type VenueId = Text;
    type TokenAmount = Nat;
    
    type Booking = {
        id: BookingId;
        userId: UserId;
        venueId: VenueId;
        startTime: Time.Time;
        endTime: Time.Time;
        status: BookingStatus;
        price: TokenAmount;
        nftTicketId: ?Text;
        isVerified: Bool;
    };

    type Venue = {
        id: VenueId;
        name: Text;
        capacity: Nat;
        basePrice: TokenAmount;
        virtualTourUrl: ?Text;
        sustainabilityScore: Nat;  // 0-100
        availableDates: [Time.Time];
        features: [Text];
        currentRating: Float;
    };

    type Review = {
        userId: UserId;
        venueId: VenueId;
        rating: Nat;  // 1-5
        comment: Text;
        timestamp: Time.Time;
        verified: Bool;
    };

    type UserProfile = {
        id: UserId;
        bookingHistory: [BookingId];
        loyaltyPoints: Nat;
        preferences: [Text];
        privacySettings: UserPrivacySettings;
    };

    type UserPrivacySettings = {
        shareBookingHistory: Bool;
        sharePreferences: Bool;
        shareContact: Bool;
    };

    type BookingStatus = {
        #pending;
        #confirmed;
        #cancelled;
        #completed;
        #disputed;
    };

    // State Variables
    private stable var nextBookingId: BookingId = 0;

    // Custom hash function for Nat
    private func natHash(n: Nat) : Hash.Hash {
        Text.hash(Nat.toText(n))
    };
    
    private var bookings = HashMap.HashMap<BookingId, Booking>(0, Nat.equal, natHash);
    private var venues = HashMap.HashMap<VenueId, Venue>(0, Text.equal, Text.hash);
    private var reviews = HashMap.HashMap<Text, Review>(0, Text.equal, Text.hash);
    private var userProfiles = HashMap.HashMap<UserId, UserProfile>(0, Principal.equal, Principal.hash);
    private var escrowBalances = HashMap.HashMap<BookingId, TokenAmount>(0, Nat.equal, natHash);

    // System Configuration
    private let MINIMUM_BOOKING_DURATION: Int = 3600; // 1 hour in seconds
    private let LOYALTY_POINTS_PER_BOOKING: Nat = 100;
    private let REVIEW_REWARD_POINTS: Nat = 50;
    private let REFERRAL_REWARD_POINTS: Nat = 200;

    // Safe conversion from Int to Nat
    private func intToNat(x: Int) : Nat {
        if (x < 0) {
            return 0;
        };
        let nat: Nat = Int.abs(x);
        return nat;
    };

    // NFT Related Functions
    private func _generateNFTTicket(bookingId: BookingId) : async Text {
        // Generate a unique NFT ID based on booking details
        let nftId = Text.concat(
            Text.concat("#NFT-", Nat.toText(bookingId)),
            "-" # Principal.toText(Principal.fromActor(VenueBookingSystem))
        );
        
        // Here you would implement actual NFT minting logic
        // For now, we'll return the generated ID
        return nftId;
    };

    // Booking Verification
    private func _verifyBookingHistory(userId: UserId, venueId: VenueId) : async Bool {
        switch (userProfiles.get(userId)) {
            case null { return false };
            case (?profile) {
                for (bookingId in profile.bookingHistory.vals()) {
                    switch (bookings.get(bookingId)) {
                        case (?booking) {
                            if (booking.venueId == venueId and booking.status == #completed) {
                                return true;
                            };
                        };
                        case null { };
                    };
                };
                return false;
            };
        };
    };

    // Rating System
    private func _updateVenueRating(venueId: VenueId) : async () {
        var totalRating : Float = 0;
        var count : Nat = 0;
        
        for ((_, review) in reviews.entries()) {
            if (review.venueId == venueId and review.verified) {
                totalRating += Float.fromInt(review.rating);
                count += 1;
            };
        };

        if (count > 0) {
            let averageRating = totalRating / Float.fromInt(count);
            switch (venues.get(venueId)) {
                case (?venue) {
                    let updatedVenue = {
                        venue with
                        currentRating = averageRating;
                    };
                    venues.put(venueId, updatedVenue);
                };
                case null { };
            };
        };
    };

    // Loyalty Points System
    private func _awardLoyaltyPoints(userId: UserId, points: Nat) : async () {
        switch (userProfiles.get(userId)) {
            case (?profile) {
                let updatedProfile = {
                    profile with
                    loyaltyPoints = profile.loyaltyPoints + points;
                };
                userProfiles.put(userId, updatedProfile);
            };
            case null {
                let newProfile : UserProfile = {
                    id = userId;
                    bookingHistory = [];
                    loyaltyPoints = points;
                    preferences = [];
                    privacySettings = {
                        shareBookingHistory = false;
                        sharePreferences = false;
                        shareContact = false;
                    };
                };
                userProfiles.put(userId, newProfile);
            };
        };
    };

    // Dynamic Pricing Functions
    private func _calculateDemandMultiplier(venueId: VenueId, startTime: Time.Time) : Float {
        // Base multiplier
        var multiplier : Float = 1.0;
        var bookingsCount : Nat = 0;
        
        // Count bookings for the same day
        let startOfDay = _getStartOfDay(startTime);
        let endOfDay = startOfDay + 24 * 3600 * 1000000000; // Add 24 hours in nanoseconds

        for ((_, booking) in bookings.entries()) {
            if (booking.venueId == venueId and 
                booking.startTime >= startOfDay and 
                booking.startTime < endOfDay) {
                bookingsCount += 1;
            };
        };

        // Adjust multiplier based on booking count
        if (bookingsCount > 5) {
            multiplier := 1.5;
        } else if (bookingsCount > 3) {
            multiplier := 1.25;
        };

        return multiplier;
    };

    // New helper function for calculating start of day
    private func _getStartOfDay(timestamp: Time.Time) : Time.Time {
        // Convert to seconds and round down to start of day
        let secondsInDay = 24 * 3600 * 1000000000;
        let timestampDays = timestamp / secondsInDay;
        return timestampDays * secondsInDay;
    };

    // Add missing _calculateSeasonMultiplier function
    private func _calculateSeasonMultiplier(startTime: Time.Time) : Float {
        // Simple season-based pricing
        let month = _getMonth(startTime);
        
        // Peak season (summer months)
        if (month >= 6 and month <= 8) {
            return 1.3;
        };
        
        // Holiday season
        if (month == 12 or month == 1) {
            return 1.2;
        };
        
        // Off-season
        return 1.0;
    };

    // Helper function to get month from timestamp
    private func _getMonth(timestamp: Time.Time) : Nat {
        let secondsSinceEpoch = timestamp / 1000000000;
        let daysSinceEpoch = intToNat(secondsSinceEpoch / (24 * 3600));
        let monthApprox = intToNat((daysSinceEpoch % 365) / 30) + 1;
        
        if (monthApprox > 12) return 12;
        if (monthApprox < 1) return 1;
        return monthApprox;
    };

    // Main Booking Functions
    public shared(msg) func createBooking(
        venueId: VenueId, 
        startTime: Time.Time, 
        endTime: Time.Time
    ) : async Result.Result<BookingId, Text> {
        let caller = msg.caller;
        
        // Validation checks
        if (not _isValidBookingTime(startTime, endTime)) {
            return #err("Invalid booking time range");
        };

        switch (venues.get(venueId)) {
            case null { return #err("Venue not found") };
            case (?venue) {
                if (not _isVenueAvailable(venueId, startTime, endTime)) {
                    return #err("Venue not available for selected time range");
                };

                let price = _calculatePrice(venue, startTime, endTime);
                let bookingId = nextBookingId;
                
                let newBooking: Booking = {
                    id = bookingId;
                    userId = caller;
                    venueId = venueId;
                    startTime = startTime;
                    endTime = endTime;
                    status = #pending;
                    price = price;
                    nftTicketId = null;
                    isVerified = false;
                };

                bookings.put(bookingId, newBooking);
                nextBookingId += 1;

                // Update user profile
                _updateUserBookingHistory(caller, bookingId);

                return #ok(bookingId);
            };
        };
    };

    public shared(msg) func confirmBooking(bookingId: BookingId) : async Result.Result<(), Text> {
        switch (bookings.get(bookingId)) {
            case null { return #err("Booking not found") };
            case (?booking) {
                if (booking.userId != msg.caller) {
                    return #err("Unauthorized");
                };

                if (booking.status != #pending) {
                    return #err("Invalid booking status");
                };

                let updatedBooking = {
                    booking with
                    status = #confirmed;
                };

                bookings.put(bookingId, updatedBooking);
                
                // Generate NFT ticket
                let nftId = await _generateNFTTicket(bookingId);
                
                // Award loyalty points
                await _awardLoyaltyPoints(booking.userId, LOYALTY_POINTS_PER_BOOKING);

                return #ok();
            };
        };
    };

    // Virtual Tour Functions
    public shared(msg) func addVirtualTour(venueId: VenueId, tourUrl: Text) : async Result.Result<(), Text> {
        switch (venues.get(venueId)) {
            case null { return #err("Venue not found") };
            case (?venue) {
                let updatedVenue = {
                    venue with
                    virtualTourUrl = ?tourUrl;
                };
                venues.put(venueId, updatedVenue);
                return #ok();
            };
        };
    };

    // Review System
    public shared(msg) func submitReview(
        venueId: VenueId,
        rating: Nat,
        comment: Text
    ) : async Result.Result<(), Text> {
        if (rating < 1 or rating > 5) {
            return #err("Rating must be between 1 and 5");
        };

        let reviewId = Text.concat(Principal.toText(msg.caller), venueId);
        
        let newReview: Review = {
            userId = msg.caller;
            venueId = venueId;
            rating = rating;
            comment = comment;
            timestamp = Time.now();
            verified = await _verifyBookingHistory(msg.caller, venueId);
        };

        reviews.put(reviewId, newReview);
        await _updateVenueRating(venueId);
        
        if (newReview.verified) {
            await _awardLoyaltyPoints(msg.caller, REVIEW_REWARD_POINTS);
        };

        return #ok();
    };

    // Dynamic Pricing
    private func _calculatePrice(venue: Venue, startTime: Time.Time, endTime: Time.Time) : TokenAmount {
        let duration = (endTime - startTime) / 3600; // Convert to hours
        let baseHourlyRate = venue.basePrice;
        
        // Factor in demand
        let demandMultiplier = _calculateDemandMultiplier(venue.id, startTime);
        
        // Factor in season
        let seasonMultiplier = _calculateSeasonMultiplier(startTime);
        
        let finalPrice = Float.toInt(
            Float.fromInt(baseHourlyRate) * 
            demandMultiplier * 
            seasonMultiplier * 
            Float.fromInt(duration)
        );
        
        return Int.abs(finalPrice);
    };

    // Helper Functions
    private func _isValidBookingTime(startTime: Time.Time, endTime: Time.Time) : Bool {
        let currentTime = Time.now();
        return startTime > currentTime and 
               endTime > startTime and 
               (endTime - startTime) >= MINIMUM_BOOKING_DURATION;
    };

    private func _isVenueAvailable(venueId: VenueId, startTime: Time.Time, endTime: Time.Time) : Bool {
        for ((id, booking) in bookings.entries()) {
            if (booking.venueId == venueId and booking.status != #cancelled) {
                if (_hasTimeOverlap(booking.startTime, booking.endTime, startTime, endTime)) {
                    return false;
                };
            };
        };
        return true;
    };

    private func _hasTimeOverlap(start1: Time.Time, end1: Time.Time, start2: Time.Time, end2: Time.Time) : Bool {
        return start1 < end2 and start2 < end1;
    };

    private func _updateUserBookingHistory(userId: UserId, bookingId: BookingId) {
        switch (userProfiles.get(userId)) {
            case null {
                let newProfile: UserProfile = {
                    id = userId;
                    bookingHistory = [bookingId];
                    loyaltyPoints = 0;
                    preferences = [];
                    privacySettings = {
                        shareBookingHistory = false;
                        sharePreferences = false;
                        shareContact = false;
                    };
                };
                userProfiles.put(userId, newProfile);
            };
            case (?profile) {
                let updatedProfile = {
                    profile with
                    bookingHistory = Array.append(profile.bookingHistory, [bookingId]);
                };
                userProfiles.put(userId, updatedProfile);
            };
        };
    };

    // Query Functions
    public query func getBooking(bookingId: BookingId) : async ?Booking {
        bookings.get(bookingId)
    };

    public query func getVenue(venueId: VenueId) : async ?Venue {
        venues.get(venueId)
    };

    public query func getUserProfile(userId: UserId) : async ?UserProfile {
        userProfiles.get(userId)
    };

    public query func getVenueReviews(venueId: VenueId) : async [Review] {
        let reviewsBuffer = Buffer.Buffer<Review>(0);
        for ((_, review) in reviews.entries()) {
            if (review.venueId == venueId) {
                reviewsBuffer.add(review);
            };
        };
        Buffer.toArray(reviewsBuffer)
    };

    // System upgrade hooks
    system func preupgrade() {
        // Implement state preservation logic
    };

    system func postupgrade() {
        // Implement state recovery logic
    };
};