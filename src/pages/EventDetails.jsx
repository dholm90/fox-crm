import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, Loader2, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import TimeConverter from '../components/TimeConverter'

export default function EventDetails() {
    const { slug } = useParams()
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
          try {
            console.log('Fetching event with slug:', slug); // Debug log
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/by-slug/${slug}`);
            if (!response.ok) {
              console.error('Response not ok:', response.status); // Debug log
              throw new Error('Event not found');
            }
            const data = await response.json();
            console.log('Fetched event:', data); // Debug log
            setEvent(data);
          } catch (error) {
            console.error('Error fetching event:', error); // Debug log
            toast.error('Failed to load event');
          } finally {
            setLoading(false);
          }
        };
      
        if (slug) {
          fetchEvent();
        }
      }, [slug]);
      

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-400 text-xl mb-4">Event not found</p>
        <Link to="/events" className="btn-primary inline-flex items-center">
          <ArrowLeft size={20} className="mr-2" />
          Back to Events
        </Link>
      </div>
    )
  }

  const eventDate = new Date(event.date)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="relative -mt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link 
              to="/events" 
              className="inline-flex items-center text-orange-500 hover:text-orange-400 mb-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Events
            </Link>

            {/* Event Details Card */}
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center text-gray-300">
                    <Calendar size={24} className="text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p>{eventDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Clock size={24} className="text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Time</p>
                      <p><TimeConverter time24={event.time} /></p>
                      {/* <p>{militaryTimeTo12Hour(event.time)}</p> */}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <MapPin size={24} className="text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p>Restaurant Main Hall</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-gray-300">
                    {event.description}
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button className="btn-primary flex-1 py-3 text-lg">
                    Reserve Your Spot
                  </button>
                  <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-lg">
                    Share Event
                  </button>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="border-t border-gray-700 bg-gray-800/50 p-8">
                <h2 className="text-xl font-bold mb-4">Additional Information</h2>
                <ul className="space-y-3 text-gray-300">
                  <li>• Please arrive 15 minutes before the event starts</li>
                  <li>• Limited seating available</li>
                  <li>• Special dietary requirements can be accommodated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
