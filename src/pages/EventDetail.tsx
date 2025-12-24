import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowLeft, Users, Tag } from 'lucide-react';
import { eventsAPI } from '../services/api';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const response = await eventsAPI.getById(id);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-text-primary mx-auto"></div>
        <p className="mt-4 text-text-secondary">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Event Not Found</h1>
        <Link to="/events" className="text-text-primary hover:text-text-secondary">
          Back to Events
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-text-primary hover:text-text-secondary mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Events</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-[16/9] bg-gray-100">
                <img
                  src={`https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=1200`}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <div className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
                  <Tag className="h-4 w-4" />
                  <span>Special Event</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-6">
                  {event.title}
                </h1>

                <div className="prose max-w-none mb-8">
                  <p className="text-text-secondary text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="border-t border-light-gray pt-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    What to Expect
                  </h2>
                  <ul className="space-y-3 text-text-secondary">
                    <li className="flex items-start space-x-2">
                      <span className="text-text-primary mt-1">•</span>
                      <span>Exclusive preview of our latest jewelry collections</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-text-primary mt-1">•</span>
                      <span>Meet our expert jewelers and designers</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-text-primary mt-1">•</span>
                      <span>Special discounts and offers for attendees</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-text-primary mt-1">•</span>
                      <span>Complimentary refreshments and gift bags</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-text-primary mt-1">•</span>
                      <span>Live jewelry styling demonstrations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Event Details
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-text-secondary">Date</p>
                    <p className="font-medium text-text-primary">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-text-secondary">Time</p>
                    <p className="font-medium text-text-primary">{formattedTime}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-text-secondary">Location</p>
                    <p className="font-medium text-text-primary">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-text-secondary">Attendance</p>
                    <p className="font-medium text-text-primary">Open to All</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-text-primary text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors mb-3">
                Register for Event
              </button>

              <button className="w-full border-2 border-text-primary text-text-primary py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Add to Calendar
              </button>

              <div className="mt-6 p-4 bg-light-gray rounded-lg">
                <p className="text-sm text-text-secondary">
                  Have questions about this event? Contact our team at{' '}
                  <a href="mailto:events@jewelcca.com" className="text-text-primary font-medium hover:underline">
                    events@jewelcca.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-serif font-bold text-text-primary mb-6">
            More Upcoming Events
          </h2>
          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-white border-2 border-text-primary text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-text-primary hover:text-white transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>View All Events</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
