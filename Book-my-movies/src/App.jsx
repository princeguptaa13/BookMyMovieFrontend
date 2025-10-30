import React, { useState, useEffect, useMemo } from 'react';

// --- API SERVICE CONFIGURATION ---
// This is the new "section" to manage all your backend API calls.
const API_BASE_URL = 'http://localhost:8080'; // Change this to your backend's port if different

const apiService = {
  /**
   * Fetches all movies from the backend.
   * Corresponds to: @GetMapping("/all") in MoviesController
   * @returns {Promise<Array|null>} A promise that resolves to an array of movie objects, or null if fetch fails.
   */
  getAllMovies: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching all movies:", error);
      console.warn("API call failed. Make sure your backend is running at " + API_BASE_URL + " and that CORS is enabled in your Spring Boot app (e.g., @CrossOrigin). Falling back to mock data.");
      return null; // Return null on error
    }
  },

  /**
   * Fetches a single movie by its ID.
   * Corresponds to: @GetMapping("/{id}") in MoviesController
   * @param {number} id The ID of the movie to fetch.
   * @returns {Promise<object|null>} A promise that resolves to the movie object or null.
   */
  getMovieById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching movie with id ${id}:`, error);
      return null;
    }
  },

  /**
   * Fetches all shows for a specific movie.
   * NOTE: This function calls the correct endpoint.
   * Example: @GetMapping("/api/shows/movie/{movieId}")
   * @param {number} movieId The ID of the movie.
   * @returns {Promise<Array|null>} A promise that resolves to an array of show objects, or null if fetch fails.
   */
  getShowsByMovieId: async (movieId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shows/movie/${movieId}`); // Correct endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Assuming the backend returns shows with screen and theatre info joined
      return await response.json();
    } catch (error) {
      console.error(`Error fetching shows for movie ${movieId}:`, error);
      console.warn("API call for shows failed. Falling back to mock data.");
      return null; // Return null on error
    }
  },


  /**
   * Fetches all bookings for a specific user.
   * NOTE: You will need to create this endpoint in your Spring Boot backend.
   * Example: @GetMapping("/user/{userId}") in BookingController
   * @param {number} userId The ID of the user.
   * @returns {Promise<Array|null>} A promise that resolves to an array of booking objects, or null if fetch fails.
   */
  getBookingsByUserId: async (userId) => {
    try {
      // Assuming you will create this endpoint:
      const response = await fetch(`${API_BASE_URL}/api/bookings/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching bookings for user ${userId}:`, error);
      console.warn("API call for bookings failed. Falling back to mock data.");
      return null; // Return null on error
    }
  },

  /**
   * Creates a new booking.
   * Corresponds to: @PostMapping in BookingController
   * @param {object} bookingRequestDto Data matching your BookingRequestDto
   * @returns {Promise<object|null>} A promise that resolves to the new booking object or null.
   */
  createBooking: async (bookingRequestDto) => {
    try {
      // We need to send this as form data to match your @RequestParam
      // If your backend @PostMapping uses @RequestBody, you can send JSON instead.
      // Assuming @RequestParam for now as per your snippet.
      const formData = new URLSearchParams();
      formData.append('userId', bookingRequestDto.userId);
      formData.append('showId', bookingRequestDto.showId);
      // Your DTO might take a list of seats. This is a common way to send a list.
      bookingRequestDto.seatIds.forEach(id => formData.append('seatIds', id));

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating booking:", error);
      console.warn("API call to create booking failed. Simulating local booking creation as a fallback.");
      return null; // Return null on error
    }
  }
};


// --- MOCK DATA BASED ON YOUR DATABASE SCHEMA ---
// We still need this mock data until all backend APIs are built
// OR as a fallback if the API isn't running.

const MOCK_USERS = [
  { id: 1, email: 'user@example.com', name: 'Demo User', password: 'password123', phone_no: '9876543210' }
];

// MOCK_MOVIES is used as a fallback if the API call fails
const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    duration_min: 166,
    genre: 'Sci-Fi, Adventure',
    language: 'English',
    poster_url: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'
  },
  {
    id: 2,
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    duration_min: 180,
    genre: 'Biography, Drama, History',
    language: 'English',
    poster_url: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/8GkiSg1xNMg96T2n26IuEYp7PT9.jpg'
  },
  {
    id: 3,
    title: 'Kung Fu Panda 4',
    description: 'After Po is tapped to become the Spiritual Leader of the Valley of Peace, he needs to find and train a new Dragon Warrior, while a wicked sorceress plans to re-summon all the master villains whom Po has vanquished to the spirit realm.',
    duration_min: 94,
    genre: 'Animation, Action, Comedy',
    language: 'English',
    poster_url: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg'
  },
  {
    id: 4,
    title: 'Godzilla x Kong: The New Empire',
    description: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island\'s mysteries.',
    duration_min: 115,
    genre: 'Action, Sci-Fi, Thriller',
    language: 'English',
    poster_url: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/tMefBSMknHQRTNIssiCpVK68WjH.jpg'
  }
];

// MOCK_BOOKINGS is used as a fallback if the API call fails
const MOCK_BOOKINGS = [
  {
    id: 101,
    booking_number: 'BKMV12345',
    booking_time: '2025-10-20T10:30:00',
    status: 'Confirmed',
    total_amount: 400,
    payment_id: 101,
    show_id: 1,
    user_id: 1,
    // Joined data:
    movieTitle: 'Dune: Part Two',
    moviePoster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    theatreName: 'Cineplex Royale',
    screenName: 'Screen 1',
    showTime: '2025-10-24T09:00:00',
    seatNumbers: 'E5, E6',
    movieId: 1 // For fallback
  }
];

const MOCK_THEATRES = [
  { id: 1, name: 'Cineplex Royale', address: '123 Movie St, Downtown', total_screens: 3 },
  { id: 2, name: 'Grand Cinema', address: '456 Film Ave, Uptown', total_screens: 2 }
];

const MOCK_SCREENS = [
  { id: 1, name: 'Screen 1', total_seats: 60, theatre_id: 1 },
  { id: 2, name: 'Screen 2 (IMAX)', total_seats: 80, theatre_id: 1 },
  { id: 3, name: 'Audi 1', total_seats: 70, theatre_id: 2 },
];

const createSeats = (screenId, rows, cols) => {
  let seats = [];
  let id = 1;
  for (let r = 0; r < rows; r++) {
    const rowChar = String.fromCharCode(65 + r); // A, B, C...
    for (let c = 1; c <= cols; c++) {
      let category = 'Standard';
      if (r >= rows - 2) category = 'Premium'; // Last 2 rows are premium

      seats.push({
        id: (screenId * 1000) + id++, // Unique ID per seat template
        seat_number: `${rowChar}${c}`,
        seat_category: category,
        base_price: category === 'Premium' ? 250 : 150,
        screen_id: screenId // Not in DB schema, but useful for mapping
      });
    }
  }
  return seats;
};

const MOCK_SEATS = [
  ...createSeats(1, 6, 10), // Screen 1: 60 seats
  ...createSeats(2, 8, 10), // Screen 2: 80 seats
  ...createSeats(3, 7, 10), // Screen 3: 70 seats
];

// MOCK_SHOWS is used as a fallback if the API call fails
// NOTE: You will need an API endpoint to fetch shows by movie ID
// e.g., @GetMapping("/api/shows/movie/{movieId}")
const MOCK_SHOWS = [
  { id: 1, start_time: '2025-10-24T09:00:00', end_time: '2025-10-24T11:46:00', movie_id: 1, screen_id: 1, screenName: 'Screen 1', theatreId: 1, theatreName: 'Cineplex Royale', theatreAddress: '123 Movie St, Downtown' },
  { id: 2, start_time: '2025-10-24T13:00:00', end_time: '2025-10-24T15:46:00', movie_id: 1, screen_id: 1, screenName: 'Screen 1', theatreId: 1, theatreName: 'Cineplex Royale', theatreAddress: '123 Movie St, Downtown' },
  { id: 3, start_time: '2025-10-24T18:00:00', end_time: '2025-10-24T20:46:00', movie_id: 1, screen_id: 2, screenName: 'Screen 2 (IMAX)', theatreId: 1, theatreName: 'Cineplex Royale', theatreAddress: '123 Movie St, Downtown' },
  { id: 4, start_time: '2025-10-24T10:00:00', end_time: '2025-10-24T13:00:00', movie_id: 2, screen_id: 3, screenName: 'Audi 1', theatreId: 2, theatreName: 'Grand Cinema', theatreAddress: '456 Film Ave, Uptown' },
  { id: 5, start_time: '2025-10-24T14:00:00', end_time: '2025-10-24T17:00:00', movie_id: 2, screen_id: 3, screenName: 'Audi 1', theatreId: 2, theatreName: 'Grand Cinema', theatreAddress: '456 Film Ave, Uptown' },
  { id: 6, start_time: '2025-10-24T09:30:00', end_time: '2025-10-24T11:04:00', movie_id: 3, screen_id: 1, screenName: 'Screen 1', theatreId: 1, theatreName: 'Cineplex Royale', theatreAddress: '123 Movie St, Downtown' },
  { id: 7, start_time: '2025-10-24T21:00:00', end_time: '2025-10-24T22:55:00', movie_id: 4, screen_id: 2, screenName: 'Screen 2 (IMAX)', theatreId: 1, theatreName: 'Cineplex Royale', theatreAddress: '123 Movie St, Downtown' },
];

// NOTE: You will need an API endpoint to fetch seat status for a show
// e.g., @GetMapping("/api/showseats/show/{showId}")
const createShowSeats = (shows, seats) => {
  let showSeats = [];
  let id = 1;

  // Ensure shows and seats are arrays before proceeding
  if (!Array.isArray(shows) || !Array.isArray(seats)) {
    console.error("Invalid input to createShowSeats: shows or seats is not an array.");
    return [];
  }

  for (const show of shows) {
    // Ensure show and show.screen_id are valid
    if (!show || typeof show.screen_id === 'undefined') {
       console.warn("Skipping invalid show object:", show);
       continue;
    }
    const screenSeats = seats.filter(s => s.screen_id === show.screen_id);

    for (const seat of screenSeats) {
        // Ensure seat is valid
        if (!seat || typeof seat.base_price === 'undefined') {
          console.warn("Skipping invalid seat object:", seat);
          continue;
        }
      const status = Math.random() < 0.2 ? 'Booked' : 'Available';
      showSeats.push({
        id: id++,
        price: seat.base_price,
        status: status,
        booking_id: status === 'Booked' ? Math.floor(Math.random() * 100) : null,
        show_id: show.id,
        seat_id: seat.id,
      });
    }
  }
  return showSeats;
};


const MOCK_QUOTES_FACTS = [
  { type: 'quote', text: "The first rule of Fight Club is: You do not talk about Fight Club.", source: "Fight Club (1999)" },
  { type: 'fact', text: "The T-Rex roar in Jurassic Park was a composite of tiger, alligator, and baby elephant sounds." },
  { type: 'quote', text: "May the Force be with you.", source: "Star Wars (1977)" },
  { type: 'fact', text: "The iconic 'Here's Johnny!' scene in The Shining reportedly took 127 takes to get right." },
  { type: 'quote', text: "I'll be back.", source: "The Terminator (1984)" },
  { type: 'fact', text: "In The Matrix, scenes inside the Matrix were given a green tint, while scenes in the real world had a blue tint." },
  { type: 'quote', text: "Why so serious?", source: "The Dark Knight (2008)" },
  { type: 'fact', text: "The voice of Wall-E was created by legendary sound designer Ben Burtt, using his own voice manipulated through a computer." }
];

// --- ICONS ---
// ... (existing icons: MovieIcon, UserIcon, TicketIcon, etc.) ...
const MovieIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"></path>
    <path d="M3 15v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"></path>
    <path d="M21 12a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v0Z"></path>
    <path d="M9 12v.01"></path>
    <path d="M15 12v.01"></path>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const QuoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 w-8 h-8 opacity-75">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v6c0 7 4 8 7 8Z"></path>
    <path d="M14 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 2v6c0 7 4 8 7 8Z"></path>
  </svg>
);

const BulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 w-8 h-8 opacity-75">
    <path d="M15.09 16.09a7 7 0 0 1-5.09-1.59"></path>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10c0-1.63-.4-3.16-1.1-4.5"></path>
    <path d="M9 12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3Z"></path>
    <path d="M12 18v1"></path>
    <path d="M16.2 16.2l.7.7"></path>
    <path d="M18 12h1"></path>
    <path d="M16.2 7.8l.7-.7"></path>
    <path d="M12 6V5"></path>
    <path d="M7.8 7.8l-.7-.7"></path>
    <path d="M6 12H5"></path>
    <path d="M7.8 16.2l-.7.7"></path>
  </svg>
);

// --- FOOTER ICONS ---
const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.27 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.48.75 2.79 1.9 3.55-.7-.02-1.36-.21-1.94-.53v.05c0 2.07 1.47 3.8 3.42 4.19-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97-1.46 1.14-3.3 1.82-5.3 1.82-.34 0-.68-.02-1.02-.06 1.89 1.21 4.12 1.92 6.56 1.92 7.88 0 12.2-6.54 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.22z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.47 2.525c.636-.247 1.363-.416 2.427-.465C8.93 2.013 9.284 2 12.315 2zm0 1.623c-2.403 0-2.72.01-3.667.058-1.144.052-1.603.21-1.92.332-.38.143-.637.319-.92.599-.282.28-.456.539-.598.92-.122.317-.28.776-.332 1.92-.048.947-.058 1.264-.058 3.667s.01 2.72.058 3.667c.052 1.144.21 1.603.332 1.92.143.38.319.637.599.92.28.282.539.456.92.598.317.122.776.28 1.92.332.947.048 1.264.058 3.667.058s2.72-.01 3.667-.058c1.144-.052 1.603-.21 1.92-.332.38-.143.637-.319.92-.599.282-.28.456-.539.598.92.122-.317.28-.776-.332-1.92.048-.947.058-1.264.058-3.667s-.01-2.72-.058-3.667c-.052-1.144-.21-1.603-.332-1.92-.143-.38-.319-.637-.599.92-.28-.282-.539-.456-.92-.598-.317-.122-.776-.28-1.92-.332-.947-.048-1.264-.058-3.667-.058zM12 8.118a3.882 3.882 0 100 7.764 3.882 3.882 0 000-7.764zm0 6.138a2.256 2.256 0 110-4.512 2.256 2.256 0 010 4.512zm5.338-6.18a.96.96 0 100-1.92.96.96 0 000 1.92z" clipRule="evenodd" />
  </svg>
);


// --- HELPER FUNCTIONS ---
const formatTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) { return 'Invalid Date'; }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    // Use a specific locale and timezone for consistency if needed, e.g., 'en-US', { timeZone: 'UTC' }
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  } catch (e) { return 'Invalid Date'; }
};

// --- RENDER FUNCTIONS (COMPONENTS) ---

// --- HEADER COMPONENT ---
const Header = ({ currentUser, onNavigate, onLogout }) => (
  <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
    <div className="container mx-auto flex justify-between items-center max-w-6xl">
      {/* Logo */}
      <div
        className="text-2xl font-bold text-blue-500 cursor-pointer flex items-center gap-2"
        onClick={() => onNavigate('HOME')}
      >
        <TicketIcon /> BookMyMovies
      </div>

      {/* Main Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <button
          onClick={() => onNavigate('HOME')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Movies
        </button>
        <button
          onClick={() => onNavigate('EVENTS')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Events
        </button>
        <button
          onClick={() => onNavigate('ABOUT')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          About
        </button>
        <button
          onClick={() => onNavigate('LOCATION')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Location
        </button>
      </nav>

      {/* Login/Profile Button */}
      <div className="flex items-center gap-6">
        {currentUser ? (
          <>
            <button
              onClick={() => onNavigate('PROFILE')}
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <UserIcon /> <span className="hidden sm:inline">{currentUser.name}</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => onNavigate('LOGIN')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </div>
  </header>
);

// --- FOOTER COMPONENT ---
const Footer = ({ onNavigate, onTestConnection }) => ( // Added onTestConnection prop
   <footer className="bg-gray-900 text-gray-400 p-8 mt-16">
    <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* About Section */}
      <div>
        <h3 className="text-xl font-bold text-blue-500 mb-2 flex items-center gap-2">
          <TicketIcon /> BookMyMovies
        </h3>
        <p className="text-sm">
          BookMyMovies is your one-stop shop for booking movie tickets, finding showtimes, and discovering new events.
        </p>
        {/* Test Connection Button Added Here */}
        <button
          onClick={onTestConnection}
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
        >
          Test Backend Connection
        </button>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><button onClick={() => onNavigate('HOME')} className="hover:text-white">Home</button></li>
          <li><button onClick={() => onNavigate('EVENTS')} className="hover:text-white">Events</button></li>
          <li><button onClick={() => onNavigate('ABOUT')} className="hover:text-white">About Us</button></li>
          <li><button onClick={() => onNavigate('LOCATION')} className="hover:text-white">Locations</button></li>
        </ul>
      </div>

      {/* Social Media */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Follow Us</h4>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
            <TwitterIcon />
          </a>
        </div>
      </div>
    </div>
    <div className="container mx-auto max-w-6xl text-center border-t border-gray-700 pt-6 mt-8">
      <p className="text-sm">&copy; {new Date().getFullYear()} - Directed by Prince Gupta ,<br></br> All rights reserved.</p>
    </div>
  </footer>
);


// --- REACT APPLICATION ---
export default function App() {

  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState('HOME');
  const [currentUser, setCurrentUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]); // FIX: ADDED MISSING PAYMENTS STATE
  const [theatres, setTheatres] = useState(MOCK_THEATRES); // Still mock
  const [screens, setScreens] = useState(MOCK_SCREENS); // Still mock
  const [currentShows, setCurrentShows] = useState([]); // NEW: State for fetched shows
  const [seats, setSeats] = useState(MOCK_SEATS); // Still mock (seat templates)
  const [showSeats, setShowSeats] = useState([]); // NEW: State for fetched show seats (status)

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lastBookingId, setLastBookingId] = useState(null);

  const [loginError, setLoginError] = useState('');
  const [seatError, setSeatError] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiTrivia, setAiTrivia] = useState(null);
  const [aiTriviaLoading, setAiTriviaLoading] = useState(false);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [showsLoading, setShowsLoading] = useState(false); // NEW: Loading state for shows
  const [showSeatsLoading, setShowSeatsLoading] = useState(false); // NEW: Loading state for show seats
  const [testStatus, setTestStatus] = useState('');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // --- USEEFFECT FOR QUOTES ---
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % MOCK_QUOTES_FACTS.length);
    }, 7000);
    return () => clearInterval(quoteInterval);
  }, []);

  // --- USEEFFECT FOR FETCHING MOVIES ---
  useEffect(() => {
    const loadMovies = async () => {
      setMoviesLoading(true);
      const fetchedMovies = await apiService.getAllMovies();
      // If API call fails (returns null), use mock data
      setMovies(fetchedMovies || MOCK_MOVIES);
      setMoviesLoading(false);
    };
    loadMovies();
  }, []); // Empty dependency array means this runs once on mount

  // --- USEEFFECT FOR FETCHING BOOKINGS ---
  useEffect(() => {
    const loadBookings = async () => {
      if (currentUser) {
        setBookingsLoading(true);
        // NOTE: This assumes your backend DTO matches the frontend object structure.
        // You may need to transform the data here.
        // It also assumes you built the /api/bookings/user/{userId} endpoint
        const fetchedBookings = await apiService.getBookingsByUserId(currentUser.id);

        // If API call fails (returns null), use mock data
        setBookings(fetchedBookings || MOCK_BOOKINGS.filter(b => b.user_id === currentUser.id));
        setBookingsLoading(false);
      } else {
        setBookings([]); // Clear bookings on logout
      }
    };
    loadBookings();
  }, [currentUser]); // Runs when currentUser changes

  // --- NEW USEEFFECT FOR FETCHING SHOWS ---
  useEffect(() => {
    const loadShows = async () => {
      if (selectedMovieId) {
        setShowsLoading(true);
        setCurrentShows([]); // Clear previous shows
        const fetchedShows = await apiService.getShowsByMovieId(selectedMovieId);
        // Use mock data as fallback if API fails OR if API returns empty/null
        // Make sure MOCK_SHOWS has the needed fields (screenName, theatreName etc) if used as fallback
        setCurrentShows(fetchedShows && fetchedShows.length > 0 ? fetchedShows : MOCK_SHOWS.filter(s => s.movie_id === selectedMovieId));
        setShowsLoading(false);
      } else {
        setCurrentShows([]); // Clear shows if no movie is selected
      }
    };
    loadShows();
  }, [selectedMovieId]); // Runs when selectedMovieId changes

  // --- NEW USEEFFECT FOR FETCHING SHOW SEATS ---
  useEffect(() => {
    const loadShowSeats = async () => {
      if (selectedShowId) {
        setShowSeatsLoading(true);
        setShowSeats([]); // Clear previous seats
        // NOTE: You need to create this API endpoint: /api/showseats/show/{showId}
        // const fetchedShowSeats = await apiService.getShowSeatsByShowId(selectedShowId);
        // setShowSeats(fetchedShowSeats || createShowSeats(MOCK_SHOWS, MOCK_SEATS).filter(ss => ss.show_id === selectedShowId));

        // Using mock data for now until API exists:
        console.warn("Fetching ShowSeats: API endpoint not implemented, using mock data.");
        // Make sure MOCK_SHOWS has the selected show if using mock fallback
        const showExistsInMock = MOCK_SHOWS.some(s => s.id === selectedShowId);
        setShowSeats(showExistsInMock ? createShowSeats(MOCK_SHOWS, MOCK_SEATS).filter(ss => ss.show_id === selectedShowId) : []);

        setShowSeatsLoading(false);
      } else {
        setShowSeats([]); // Clear seats if no show is selected
      }
    };
    loadShowSeats();
  }, [selectedShowId]); // Runs when selectedShowId changes


  // --- DERIVED STATE (Data lookups) ---

  const selectedMovie = useMemo(() => {
    return movies.find(m => m.id === selectedMovieId);
  }, [selectedMovieId, movies]);

  // Selected show now uses the fetched `currentShows` state
  const selectedShow = useMemo(() => {
    return currentShows.find(s => s.id === selectedShowId);
  }, [selectedShowId, currentShows]);

  // This now uses the fetched `currentShows` state and groups them
  const showsForSelectedMovieGrouped = useMemo(() => {
    // Check if currentShows is valid before processing
    if (!Array.isArray(currentShows) || currentShows.length === 0) return [];

    // Group shows by theatre using the data fetched from the API
    // Assumes API returns theatreName, theatreAddress, screenName directly on show object
    const groupedByTheatre = currentShows.reduce((acc, show) => {
      // Use theatreId from the show object if available, otherwise fallback
      const theatreId = show.theatreId || MOCK_SCREENS.find(sc => sc.id === show.screen_id)?.theatre_id || 'unknown';
      if (!acc[theatreId]) {
          const theatreInfo = MOCK_THEATRES.find(th => th.id === theatreId);
        acc[theatreId] = {
          // Use data from show object first, then fallback to mock data
          theatreName: show.theatreName || theatreInfo?.name || 'Unknown Theatre',
          theatreAddress: show.theatreAddress || theatreInfo?.address || '',
          shows: []
        };
      }
      // Make sure screenName is included, fallback to mock if needed
      const screenInfo = MOCK_SCREENS.find(sc => sc.id === show.screen_id);
      acc[theatreId].shows.push({
          ...show,
          // Use screenName from show object first, then fallback
          screenName: show.screenName || screenInfo?.name || 'Screen'
      });
      return acc;
    }, {});

    return Object.values(groupedByTheatre);
  }, [currentShows]); // Only depends on currentShows now

  // This now uses the fetched `showSeats` state
  const seatMapForSelectedShow = useMemo(() => {
    // Check if showSeats is valid
    if (!Array.isArray(showSeats) || showSeats.length === 0) return [];

    // Map fetched show seats to their seat template (number, category)
    const mappedSeats = showSeats.map(ss => {
      const seatInfo = seats.find(s => s.id === ss.seat_id); // Find template
      return {
        ...ss, // id (show_seat_id), price, status, booking_id, show_id, seat_id
        seat_number: seatInfo?.seat_number || '?', // Use template info
        seat_category: seatInfo?.seat_category || 'Standard'
      };
    }).filter(seat => seat.seat_number !== '?'); // Filter out any seats where the template info is missing (shouldn't happen with the mock setup)

    // Group by row for rendering
    const groupedByRow = mappedSeats.reduce((acc, seat) => {
      const row = seat.seat_number.charAt(0);
      if (!row || row === '?') return acc; // Skip if seat number invalid
      if (!acc[row]) {
        acc[row] = [];
      }
      acc[row].push(seat);
      return acc;
    }, {});

    // Sort rows alphabetically (A, B, C...) and seats numerically
    return Object.keys(groupedByRow).sort().map(row => ({
      rowName: row,
      seats: groupedByRow[row].sort((a, b) => {
          const numA = parseInt(a.seat_number.substring(1));
          const numB = parseInt(b.seat_number.substring(1));
          // Handle potential NaN if seat numbers are invalid
          if (isNaN(numA) || isNaN(numB)) return 0;
          return numA - numB;
      })
    }));

  }, [showSeats, seats]); // Depends on fetched showSeats and mock seat templates

  // This now uses the fetched `showSeats` state
  const selectedSeatDetails = useMemo(() => {
    // Check if showSeats is valid
      if (!Array.isArray(showSeats)) return [];
    return selectedSeats.map(id => {
      const ss = showSeats.find(s => s.id === id); // Find selected showSeat
      const seatInfo = seats.find(s => s.id === ss?.seat_id); // Find template
      // Ensure ss exists before spreading, provide defaults if seatInfo is missing
      return {
          ...(ss || { id: id, price: 0 }), // Include the id even if ss is missing
          ...(seatInfo || { seat_number: '?', seat_category: '?' })
      };
    }).filter(seat => seat.id); // Filter out any potential undefined entries if showSeats hasn't loaded
  }, [selectedSeats, showSeats, seats]); // Depends on fetched showSeats and mock seat templates

  const totalBookingPrice = useMemo(() => {
    // Ensure price is treated as a number
    return selectedSeatDetails.reduce((total, seat) => total + (Number(seat.price) || 0), 0);
  }, [selectedSeatDetails]);

  const userBookings = useMemo(() => {
    if (!currentUser || !bookings) return [];
    return bookings.map(booking => ({
      ...booking,
      movieTitle: booking.movieTitle || movies.find(m => m.id === booking.movieId)?.title || 'Movie',
      moviePoster: booking.moviePoster || movies.find(m => m.id === booking.movieId)?.poster_url,
      theatreName: booking.theatreName || 'Theatre',
      screenName: booking.screenName || 'Screen',
      showTime: booking.showTime || new Date().toISOString(),
      seatNumbers: booking.seatNumbers || 'A1, A2'
    }))
      .sort((a, b) => new Date(b.booking_time) - new Date(a.booking_time));
  }, [currentUser, bookings, movies]);

  const lastBookingDetails = useMemo(() => {
    return userBookings.find(b => b.id === lastBookingId);
  }, [lastBookingId, userBookings]);

  // --- EVENT HANDLERS / NAVIGATION ---

  const navigate = (page) => { window.scrollTo(0, 0); setCurrentPage(page); };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
      navigate('HOME');
    } else {
      setLoginError("User not found. Please use 'user@example.com'.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('HOME');
  };

  const handleSelectMovie = (movieId) => {
    setSelectedMovieId(movieId); // This will trigger useEffect to fetch shows
    setSelectedShowId(null); // Deselect previous show
    setCurrentShows([]); // Clear shows immediately for better UX
    setAiSummary('');
    setAiTrivia(null);
    navigate('MOVIE_DETAILS');
  };

  const handleSelectShow = (showId) => {
    if (!currentUser) {
      navigate('LOGIN');
      return;
    }
    setSelectedShowId(showId); // This will trigger useEffect to fetch show seats
    setSelectedSeats([]); // Clear previous selection
    setShowSeats([]); // Clear seats immediately for better UX
    navigate('SEAT_SELECTION');
  };

  const handleToggleSeat = (showSeatId) => {
    setSeatError('');
    setSelectedSeats(prev =>
      prev.includes(showSeatId)
        ? prev.filter(id => id !== showSeatId)
        : [...prev, showSeatId]
    );
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      setSeatError("Please select at least one seat.");
      return;
    }
    setSeatError('');
    navigate('BOOKING_SUMMARY');
  };

  const handleConfirmBooking = async () => {
    // 1. Create DTO
    // Ensure selectedSeatDetails are available before mapping
    if (selectedSeatDetails.length !== selectedSeats.length || selectedSeatDetails.some(s => s.seat_number === '?')) {
        console.error("Seat details not fully loaded yet.");
        // Optionally show an error to the user
        // setBookingError("Seat information is incomplete. Please wait a moment and try again.");
        return;
    }
      // Check if currentUser exists before accessing id
    if (!currentUser) {
        console.error("User not logged in.");
        navigate('LOGIN'); // Redirect to login if not logged in
        return;
    }

    const bookingRequestDto = {
      userId: currentUser.id,
      showId: selectedShowId,
      // FIX: Use seat_id from the seat template, not show_seat_id (which is in selectedSeats)
      seatIds: selectedSeatDetails.map(s => s.seat_id) // Correctly uses seat_id for the backend DTO
    };

    // 2. Simulate Payment Creation (Needed for mock booking object)
    const currentMaxPaymentId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) : 0;
    const newPaymentId = currentMaxPaymentId + 1;
    const newPayment = {
        id: newPaymentId,
        amount: totalBookingPrice,
        payment_method: 'Simulated Card',
        payment_time: new Date().toISOString(),
        status: 'Successful',
        transaction_id: `txn_${Date.now()}`
    };
    setPayments(prev => [...prev, newPayment]); // Update payments state

    // 3. Call API
    console.log("Sending booking to backend:", bookingRequestDto);
    const newBookingFromApi = await apiService.createBooking(bookingRequestDto);

    // 4. Handle Fallback/Success
    let newBooking;
    if (newBookingFromApi) {
      newBooking = { ...newBookingFromApi }; // Create a copy
      // Ensure API response includes necessary fields for confirmation page
      if (!newBooking.movieTitle || !newBooking.theatreName || !newBooking.seatNumbers) {
            const movie = selectedMovie;
            const show = selectedShow; // Use the selected show from state
            // Safely find screen and theatre info (handle potential undefined)
            const screen = MOCK_SCREENS.find(s => s.id === show?.screen_id);
            const theatre = MOCK_THEATRES.find(t => t.id === screen?.theatre_id);
            newBooking = {
                ...newBooking,
                movieTitle: newBooking.movieTitle || movie?.title || 'Unknown Movie',
                moviePoster: newBooking.moviePoster || movie?.poster_url,
                theatreName: newBooking.theatreName || theatre?.name || 'Unknown Theatre',
                screenName: newBooking.screenName || screen?.name || 'Unknown Screen',
                showTime: newBooking.showTime || show?.start_time,
                seatNumbers: newBooking.seatNumbers || selectedSeatDetails.map(s => s.seat_number).join(', ') || 'N/A'
            }
      }
      newBooking.payment_id = newPaymentId; // Associate with the simulated payment
      newBooking.total_amount = totalBookingPrice; // Use calculated frontend price

    } else {
      console.warn("Using mock booking fallback.");
      const currentMaxBookingId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) : 0;
      const newBookingId = currentMaxBookingId + 1; // Safer ID generation
      const movie = selectedMovie;
      const show = selectedShow; // Use the selected show from state
      // Safely find screen and theatre info
      const screen = MOCK_SCREENS.find(s => s.id === show?.screen_id);
      const theatre = MOCK_THEATRES.find(t => t.id === screen?.theatre_id);

      newBooking = {
        id: newBookingId,
        booking_number: `BKMV${Date.now()}`,
        booking_time: new Date().toISOString(),
        status: 'Confirmed (Local)',
        total_amount: totalBookingPrice,
        payment_id: newPaymentId, // Use the new simulated payment ID
        show_id: selectedShowId,
        user_id: currentUser.id,
        movieTitle: movie?.title || 'Unknown Movie',
        moviePoster: movie?.poster_url,
        theatreName: theatre?.name || 'Unknown Theatre',
        screenName: screen?.name || 'Unknown Screen',
        showTime: show?.start_time,
        seatNumbers: selectedSeatDetails.map(s => s.seat_number).join(', ') || 'N/A',
        movieId: movie?.id
      };
    }

    setBookings(prev => [...prev, newBooking]);

    // 5. Update ShowSeats locally (ideally refetch)
    setShowSeats(prevShowSeats => {
      // Ensure prevShowSeats is an array
      if (!Array.isArray(prevShowSeats)) return [];
      return prevShowSeats.map(ss => {
        if (selectedSeats.includes(ss.id)) { // selectedSeats holds show_seat_id (ss.id)
          return { ...ss, status: 'Booked', booking_id: newBooking.id };
        }
        return ss;
      });
    });


    // 6. Navigate & Cleanup
    setLastBookingId(newBooking.id);
    navigate('CONFIRMATION');
    setSelectedSeats([]);
  };


  // --- GEMINI API FUNCTIONS ---
    const callGeminiAPI = async (payload) => {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      let retries = 0;
      const maxRetries = 5;
      let delay = 1000;
      while (retries < maxRetries) {
          try {
              const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
              if (response.ok) return await response.json();
              console.error(`API Error: ${response.status} ${response.statusText}`);
              if (response.status < 500) return null;
          } catch (error) { console.error("Network error calling Gemini API:", error); }
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; retries++;
      }
      console.error("Max retries reached for Gemini API call.");
      return null;
  };
  const extractGeminiResponse = (result) => {
      const candidate = result?.candidates?.[0];
      if (!candidate) return { text: "Error: No response candidate found.", sources: [] };
      const text = candidate.content?.parts?.[0]?.text || "Error: Could not parse response text.";
      let sources = [];
      const groundingMetadata = candidate.groundingMetadata;
      if (groundingMetadata?.groundingAttributions) {
          sources = groundingMetadata.groundingAttributions.map(attr => ({ uri: attr.web?.uri, title: attr.web?.title })).filter(s => s.uri && s.title);
      }
      return { text, sources };
  };
  const handleGetAiSummary = async () => { /* ... remains same ... */ };
  const handleGetAiTrivia = async () => { /* ... remains same ... */ };

  // --- CONNECTION TEST FUNCTION ---
  const handleTestConnection = async () => { /* ... remains same ... */ };


  // --- PAGE RENDER FUNCTIONS ---
  // Restore full function bodies

  const renderPlaceholderPage = (title) => (
    <div className="container mx-auto max-w-6xl p-4 text-center">
      <div className="bg-gray-800 p-16 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-xl text-gray-300">This page is coming soon!</p>
        <button
          onClick={() => navigate('HOME')}
          className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-lg font-medium transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  const renderMovieFactsSection = () => {
    const item = MOCK_QUOTES_FACTS[currentQuoteIndex];
    return (
      <div
        key={currentQuoteIndex}
        className="bg-gray-800 rounded-lg p-6 flex gap-4 items-center animate-fade-in"
      >
        <div className="flex-shrink-0">
          {item.type === 'quote' ? <QuoteIcon /> : <BulbIcon />}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {item.type === 'quote' ? 'Famous Quotes' : 'Did You Know?'}
          </h3>
          <p className="text-gray-300 italic">"{item.text}"</p>
          {item.source && (
            <p className="text-sm text-gray-400 mt-1 text-right">— {item.source}</p>
          )}
        </div>
      </div>
    );
  };

  const renderHomePage = () => (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="mb-10">
        {renderMovieFactsSection()}
      </div>

      <h2 className="text-3xl font-bold text-white mb-6">Now Showing</h2>
      {moviesLoading ? (
        <div className="flex justify-center items-center h-64">
          <SpinnerIcon /> <span className="text-xl ml-3">Loading Movies...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map(movie => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={() => handleSelectMovie(movie.id)}
            >
              <img
                src={movie.poster_url || 'https://placehold.co/400x600/1a1a1a/ffffff?text=Image+Not+Found'}
                alt={movie.title}
                className="w-full h-auto aspect-[2/3] object-cover"
                onError={(e) => e.target.src = 'https://placehold.co/400x600/1a1a1a/ffffff?text=Image+Not+Found'}
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
                <p className="text-sm text-gray-400">{movie.genre}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMovieDetailPage = () => {
    if (!selectedMovie) return renderHomePage();

    return (
      <div className="container mx-auto max-w-6xl p-4">
        {/* Back Button */}
        <button onClick={() => navigate('HOME')} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 mb-4">
          <ChevronLeftIcon /> Back to movies
        </button>

        {/* Movie Info Section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-gray-800 p-6 rounded-lg shadow-xl">
            {/* Movie Poster */}
            <img
            src={selectedMovie.poster_url || 'https://placehold.co/400x600/1a1a1a/ffffff?text=Image+Not+Found'}
            alt={selectedMovie.title}
            className="w-full md:w-1/3 max-w-xs mx-auto rounded-lg aspect-[2/3] object-cover shadow-lg"
          />
          {/* Movie Details */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl font-bold mb-2">{selectedMovie.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-300 mb-4">
              <span>{selectedMovie.genre}</span>
              <span>•</span>
              <span>{selectedMovie.duration_min} mins</span>
              <span>•</span>
              <span>{selectedMovie.language}</span>
            </div>
            <p className="text-gray-200 mb-6">{selectedMovie.description}</p>

            {/* Gemini Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleGetAiSummary}
                disabled={aiSummaryLoading}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-wait px-5 py-2 rounded-lg text-sm font-medium transition-colors w-40"
                >
                {aiSummaryLoading ? <><SpinnerIcon /><span>Generating...</span></> : '✨ Get AI Summary'}
              </button>
              <button
                onClick={handleGetAiTrivia}
                disabled={aiTriviaLoading}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-gray-400 disabled:cursor-wait px-5 py-2 rounded-lg text-sm font-medium transition-colors w-48"
               >
                {aiTriviaLoading ? <><SpinnerIcon /><span>Searching...</span></> : '✨ Find Reviews & Trivia'}
              </button>
            </div>

            {/* AI Summary Display */}
            {aiSummary && (
                <div className="bg-gray-700 p-4 rounded-lg mb-4 text-gray-200 text-sm animate-fade-in">
                   <h4 className="font-bold text-white mb-1">AI Summary</h4>
                   <p style={{ whiteSpace: 'pre-wrap' }}>{aiSummary}</p>
                </div>
              )}
            {/* AI Trivia Display */}
            {aiTrivia && (
                <div className="bg-gray-700 p-4 rounded-lg mb-4 text-gray-200 text-sm animate-fade-in">
                   <h4 className="font-bold text-white mb-1">AI Insights</h4>
                   <p style={{ whiteSpace: 'pre-wrap' }}>{aiTrivia.text}</p>
                   {aiTrivia.sources.length > 0 && (
                     <div className="mt-3">
                       <h5 className="text-xs font-semibold text-gray-400 mb-1">Sources (from Google Search):</h5>
                       <ul className="list-disc list-inside text-xs">
                         {aiTrivia.sources.map((source, index) => (
                           <li key={index}>
                             <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                               {source.title}
                             </a>
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                </div>
              )}

            {/* Book Tickets Button */}
            <button
                onClick={() => document.getElementById('showtimes').scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                >
              Book Tickets
            </button>
          </div>
        </div>

        {/* Showtimes Section - Now uses showsLoading and showsForSelectedMovieGrouped */}
        <div id="showtimes" className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-6">Showtimes for {formatDate(new Date())}</h2> {/* Display current date */}
          {showsLoading ? (
            <div className="flex justify-center items-center h-40">
              <SpinnerIcon /> <span className="text-xl ml-3">Loading Showtimes...</span>
            </div>
          ) : showsForSelectedMovieGrouped.length === 0 ? (
            <p className="text-gray-400 text-lg text-center bg-gray-800 p-8 rounded-lg">
              No shows available for this movie today.
            </p>
          ) : (
            <div className="space-y-6">
              {showsForSelectedMovieGrouped.map(group => (
                <div key={group.theatreName + group.theatreAddress} className="bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">{group.theatreName}</h3>
                  <p className="text-gray-400 mb-4">{group.theatreAddress}</p>
                  <div className="flex flex-wrap gap-3">
                    {group.shows.map(show => (
                      <button
                        key={show.id}
                        onClick={() => handleSelectShow(show.id)}
                        className="border border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        {formatTime(show.start_time)}
                        {/* Use screenName from fetched data */}
                        <span className="text-xs block opacity-75">{show.screenName || 'Screen'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSeatSelectionPage = () => {
    if (!selectedShow || !selectedMovie) return renderHomePage();

    // Get theatre/screen info from MOCK data until API provides it on Show object
      const screen = screens.find(s => s.id === selectedShow.screen_id);
      const theatre = theatres.find(t => t.id === screen?.theatre_id);


    return (
      <div className="container mx-auto max-w-4xl p-4">
        {/* Header */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{selectedMovie.title}</h1>
               {/* Use fetched show data or fallbacks */}
              <p className="text-gray-300">{(selectedShow.theatreName || theatre?.name)} | {(selectedShow.screenName || screen?.name)}</p>
              <p className="text-blue-400">{formatDate(selectedShow.start_time)} at {formatTime(selectedShow.start_time)}</p>
            </div>
            <button onClick={() => handleSelectMovie(selectedMovieId)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
              <ChevronLeftIcon /> Back
            </button>
          </div>
        </div>

        {/* Seat Map Area */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
          {seatError && <p className="text-red-400 text-lg text-center font-semibold mb-4">{seatError}</p>}

          {showSeatsLoading ? (
            <div className="flex justify-center items-center h-64">
              <SpinnerIcon /> <span className="text-xl ml-3">Loading Seats...</span>
            </div>
          ) : seatMapForSelectedShow.length === 0 ? (
              <p className="text-gray-400 text-lg text-center">Seat layout not available.</p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* Screen Display */}
              <div className="w-full max-w-lg h-2 bg-gray-600 rounded-b-full mb-8 shadow-inner" style={{ boxShadow: '0 6px 15px rgba(255,255,255,0.1)' }}></div>
              <p className="text-gray-400 -mt-6 mb-8">All eyes this way</p>

              {/* Seat Rows */}
              <div className="flex flex-col gap-2">
                {seatMapForSelectedShow.map(row => (
                  <div key={row.rowName} className="flex items-center gap-2">
                    <span className="text-gray-400 w-4 text-center">{row.rowName}</span>
                    <div className="flex gap-1.5 sm:gap-2.5">
                      {row.seats.map(seat => {
                        const isSelected = selectedSeats.includes(seat.id); // seat.id is show_seat_id
                        const isBooked = seat.status === 'Booked';
                        const isPremium = seat.seat_category === 'Premium';

                        let seatClass = 'w-6 h-6 sm:w-8 sm:h-8 rounded-md cursor-pointer transition-all duration-200 ';
                        if (isBooked) seatClass += 'bg-gray-600 cursor-not-allowed';
                        else if (isSelected) seatClass += 'bg-blue-500 scale-110 shadow-lg';
                        else if (isPremium) seatClass += 'bg-yellow-500 hover:bg-yellow-400';
                        else seatClass += 'bg-gray-300 hover:bg-gray-100';

                        return (
                          <div
                            key={seat.id}
                            onClick={() => !isBooked && handleToggleSeat(seat.id)}
                            className={seatClass}
                            title={isBooked ? 'Booked' : `${seat.seat_number} - ₹${seat.price}`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-8 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gray-300"></div> Standard (₹150)
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-yellow-500"></div> Premium (₹250)
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-blue-500"></div> Selected
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gray-600"></div> Booked
                    </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Bar */}
        {selectedSeats.length > 0 && (
          <div className="sticky bottom-0 bg-gray-900 p-4 mt-6 rounded-t-lg shadow-2xl flex justify-between items-center">
              <div>
              <p className="text-lg text-white font-semibold">Total: ₹{totalBookingPrice}</p>
              <p className="text-sm text-gray-300">
                {selectedSeats.length} Ticket(s): {selectedSeatDetails.map(s => s.seat_number).join(', ')}
              </p>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Pay ₹{totalBookingPrice}
            </button>
          </div>
        )}
      </div>
    );
    };

  const renderBookingSummaryPage = () => {
    if (!selectedShow || !selectedMovie || selectedSeats.length === 0) return renderHomePage();

    // Safely get screen and theatre info, using mock as fallback
    const screen = MOCK_SCREENS.find(s => s.id === selectedShow.screen_id);
    const theatre = MOCK_THEATRES.find(t => t.id === screen?.theatre_id);

    return (
      <div className="container mx-auto max-w-2xl p-4">
        <button
          onClick={() => navigate('SEAT_SELECTION')}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 mb-4"
        >
          <ChevronLeftIcon /> Back to seats
        </button>

        <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white">
          <h1 className="text-3xl font-bold mb-6">Booking Summary</h1>

          <div className="flex gap-4 mb-6 pb-6 border-b border-gray-700">
            <img
              src={selectedMovie.poster_url || 'https://placehold.co/400x600/1a1a1a/ffffff?text=Poster'}
              alt={selectedMovie.title}
              className="w-24 h-36 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold">{selectedMovie.title}</h2>
              <p className="text-gray-300">{selectedMovie.language} • {selectedMovie.genre}</p>
              <p className="text-gray-400 mt-2">{selectedShow.theatreName || theatre?.name}, {selectedShow.screenName || screen?.name}</p>
              <p className="text-blue-400 font-medium">{formatDate(selectedShow.start_time)} • {formatTime(selectedShow.start_time)}</p>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold mb-3">Your Seats ({selectedSeats.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSeatDetails.map(seat => (
                <span key={seat.id || seat.seat_id} className="bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {seat.seat_number} ({seat.seat_category})
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Price Details</h3>
            <div className="space-y-2 text-gray-200">
              {selectedSeatDetails.map(seat => (
                <div key={seat.id || seat.seat_id} className="flex justify-between">
                  <span>Seat {seat.seat_number} ({seat.seat_category})</span>
                  <span>₹{seat.price}</span>
                </div>
              ))}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                <span>Total Amount</span>
                <span>₹{totalBookingPrice}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Contact Details</h3>
              <p className="text-gray-200">{currentUser?.name}</p>
              <p className="text-gray-300">{currentUser?.email}</p>
              <p className="text-gray-300">{currentUser?.phone_no}</p>
          </div>

          <button
            onClick={handleConfirmBooking}
            className="w-full bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-xl font-bold transition-colors"
          >
            Confirm & Pay ₹{totalBookingPrice}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">This is a simulation. No real payment will be processed.</p>
        </div>
      </div>
    );
  };

  const renderConfirmationPage = () => {
    const booking = lastBookingDetails;
    if (!booking) return renderHomePage();

    return (
      <div className="container mx-auto max-w-2xl p-4 text-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Booking Confirmed Cutie!</h1>
          <p className="text-lg text-gray-300 mb-2">Now, You get a Chance to watch a movie with Mr. Prince!</p>
          <p className="text-gray-400 mb-6">Your booking is successful. A confirmation has been (simulated) sent to {currentUser?.email}.</p>

          <div className="text-left bg-gray-700 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Your Ticket</h3>
            <div className="flex gap-4">
              <img src={booking.moviePoster || 'https://placehold.co/400x600/1a1a1a/ffffff?text=Poster'} alt={booking.movieTitle} className="w-24 h-36 rounded-lg object-cover" />
              <div>
                <h2 className="text-xl font-semibold">{booking.movieTitle}</h2>
                <p className="text-gray-300">{booking.theatreName}</p>
                <p className="text-gray-400 text-sm mb-2">{booking.screenName}</p>
                <p className="font-semibold text-blue-400">{formatDate(booking.showTime)} • {formatTime(booking.showTime)}</p>
                <p className="font-semibold text-white mt-2">Seats: {booking.seatNumbers}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-lg">Booking ID: <span className="font-mono text-yellow-300">{booking.booking_number}</span></p>
              <p>Total Paid: <span className="font-semibold">₹{booking.total_amount}</span></p>
            </div>
          </div>

          <button
            onClick={() => navigate('HOME')}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors mr-4"
          >
            Book Another Movie
          </button>
          <button
            onClick={() => navigate('PROFILE')}
            className="bg-gray-600 hover:bg-gray-500 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            View Bookings
          </button>
        </div>
      </div>
    );
  };

  const renderProfilePage = () => {
    if (!currentUser) return renderHomePage();

    return (
      <div className="container mx-auto max-w-4xl p-4">
        <h1 className="text-3xl font-bold text-white mb-8">My Bookings</h1>

        {bookingsLoading ? (
            <div className="flex justify-center items-center h-64">
             <SpinnerIcon /> <span className="text-xl ml-3">Loading Bookings...</span>
           </div>
         ) : userBookings.length === 0 ? (
          <div className="text-center bg-gray-800 p-12 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-4">No bookings yet!</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't booked any movies. Let's change that!</p>
            <button
              onClick={() => navigate('HOME')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userBookings.map(booking => (
              <div key={booking.id || booking.booking_number} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                <img
                  src={booking.moviePoster || 'https://placehold.co/400x600/1a1a1a/ffffff?text=Poster'}
                  alt={booking.movieTitle}
                  className="w-full md:w-48 h-64 md:h-auto object-cover"
                />
                <div className="p-6 flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{booking.movieTitle}</h2>
                  <p className="text-lg font-semibold text-blue-400 mb-3">
                    {formatDate(booking.showTime)} • {formatTime(booking.showTime)}
                  </p>
                  <p className="text-gray-300">{booking.theatreName}, {booking.screenName}</p>
                  <p className="text-gray-200 font-medium my-2">Seats: {booking.seatNumbers}</p>
                  <p className="text-gray-400 text-sm">Booked on: {formatDate(booking.booking_time)}</p>
                  <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Booking ID: {booking.booking_number}</span>
                    <span className="text-lg font-bold text-white">₹{booking.total_amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderLoginPage = () => (
    <div className="container mx-auto max-w-sm p-4 mt-16">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg shadow-xl"
      >
        <h1 className="text-2xl font-bold text-white text-center mb-6">Login to BookMyMovies</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue="user@example.com"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            defaultValue="password123"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {loginError && (
          <p className="text-red-400 text-sm text-center mb-4">{loginError}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          Login
        </button>
        <p className="text-xs text-gray-400 text-center mt-4">Use `user@example.com` and any password to login.</p>
      </form>
    </div>
  );


  // --- MAIN RENDER SWITCH ---

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'HOME': return renderHomePage();
      case 'MOVIE_DETAILS': return renderMovieDetailPage();
      case 'SEAT_SELECTION': return renderSeatSelectionPage();
      case 'BOOKING_SUMMARY': return renderBookingSummaryPage();
      case 'CONFIRMATION': return renderConfirmationPage();
      case 'PROFILE': return renderProfilePage();
      case 'LOGIN': return renderLoginPage();
      case 'EVENTS': return renderPlaceholderPage('Events');
      case 'ABOUT': return renderPlaceholderPage('About Us');
      case 'LOCATION': return renderPlaceholderPage('Our Locations');
      default: return renderHomePage();
    }
  };

  return (
    <>
      <style>{`
        /* ... animations and status message styles ... */
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .status-message { position: fixed; top: 80px; left: 50%; transform: translateX(-50%); padding: 8px 16px; border-radius: 6px; font-weight: 500; z-index: 100; animation: fade-in-out 4s ease-in-out forwards; }
        .status-success { background-color: #10B981; color: white; }
        .status-error { background-color: #EF4444; color: white; }
        .status-testing { background-color: #3B82F6; color: white; }
        @keyframes fade-in-out { 0% { opacity: 0; transform: translate(-50%, -20px); } 10% { opacity: 1; transform: translate(-50%, 0); } 90% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; transform: translate(-50%, -20px); } }
      `}</style>
      <div className="bg-gray-950 min-h-screen text-gray-100 font-sans flex flex-col">
        <Header currentUser={currentUser} onNavigate={navigate} onLogout={handleLogout} />
        {testStatus && (
            <div className={`status-message ${
            testStatus.includes('✅') ? 'status-success' :
            testStatus.includes('❌') ? 'status-error' : 'status-testing'
          }`}>
            {testStatus}
          </div>
          )}
        <main className="pb-20 flex-grow">
          {renderCurrentPage()}
        </main>
        <Footer onNavigate={navigate} onTestConnection={handleTestConnection} />
      </div>
    </>
  );
}