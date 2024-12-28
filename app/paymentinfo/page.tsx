'use client'; // Enable client-side data fetching

import React, { useEffect, useState } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/getalleventregister'); // Replace with your backend API URL
        const data = await response.json();
        console.log(data.userEvents);
        setEvents(data.userEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Event List <pre></pre><small>Total Events : {events.length} </small></h1>
      <ul className="divide-y divide-gray-300">
        {events.map((event, index) => (
          <li key={event.id} className="py-2">
            <span className="font-medium">{index + 1}. </span>
            {event.eventName}
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center font-semibold">
        <button className='bg-yellow-400 w-full p-2 rounded-sm  hover:scale-105 transition-all text-white font-semibold'>
            Pay ₹ {events.length>10 ? 110000:8000}
        </button>
      </div>
    </div>
  );
}
