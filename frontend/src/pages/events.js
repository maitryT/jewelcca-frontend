import React, { useState, useEffect } from 'react';
import './events.css';

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch events from the backend
        fetch('/api/events')
            .then(response => response.json())
            .then(data => setEvents(data))
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    return (
        <div className="events-container">
            <h1>Upcoming Events</h1>
            <div className="events-grid">
                {events.map(event => (
                    <div key={event.id} className="event-card">
                        <img src={event.imageUrl} alt={event.name} />
                        <div className="event-info">
                            <h2>{event.name}</h2>
                            <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                            <p>{event.description}</p>
                            <a href={`/events/${event.id}`} className="details-link">View Details</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
