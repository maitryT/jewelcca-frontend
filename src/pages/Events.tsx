import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { eventsAPI } from '../services/api';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getAll();
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventImage = (index: number) => {
    const images = [
      'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1232166/pexels-photo-1232166.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1324732/pexels-photo-1324732.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800'
    ];
    return images[index % images.length];
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-text-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-10 w-10 text-text-primary mr-3" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary">
              Upcoming Events
            </h1>
          </div>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Join us for exclusive events, workshops, and collection launches. Be the first to experience our latest creations and meet our expert team.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-light-gray rounded-lg">
            <Calendar className="h-24 w-24 text-text-light mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              No Events Scheduled
            </h2>
            <p className="text-text-secondary">
              Check back soon for upcoming events and workshops.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={getEventImage(index)}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center text-sm text-text-secondary mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-4 mr-1" />
                    <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-text-primary mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="flex items-center text-sm text-text-secondary mb-4">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  <p className="text-text-secondary mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <Link
                    to={`/events/${event.id}`}
                    className="flex items-center justify-center space-x-2 w-full bg-text-primary text-white py-2 rounded-lg font-medium hover:bg-gray-700 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-light-gray rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-text-primary mb-4">
            Stay Updated
          </h2>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive notifications about upcoming events, exclusive offers, and new jewelry collections.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
            />
            <button className="bg-text-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
