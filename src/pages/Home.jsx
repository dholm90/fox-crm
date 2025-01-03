import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import barvView from '../assets/bar-view.webp'
import table from '../assets/table.webp'
import LeftImageRightText from '../components/homepage/LeftImageRightText'
import LeftTextRightImage from '../components/homepage/LeftTextRightImage'
import CenteredHeadingText from '../components/homepage/CenteredHeadingText'
import Reviews from '../components/homepage/Reviews'
import ImageGallery from '../components/homepage/ImageGallery'

export default function Home() {
  const [events, setEvents] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)

  const reviews = [
    { name: "John Doe", rating: 5, comment: "Absolutely fantastic dining experience!" },
    { name: "Jane Smith", rating: 5, comment: "Great food and atmosphere. Will definitely return." },
    { name: "Mike Johnson", rating: 5, comment: "The best restaurant in town. Highly recommended!" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch upcoming events
        const eventsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/events?limit=2`)
        const eventsData = await eventsResponse.json()

        // Fetch featured menu items
        const menuItemsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/menu-items?limit=3`)
        const menuItemsData = await menuItemsResponse.json()

        // Fetch gallery images
        const galleryResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery?limit=4`)
        const galleryData = await galleryResponse.json()

        setEvents(eventsData)
        setMenuItems(menuItemsData)
        setGallery(galleryData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={barvView}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to The Rabbid Fox
            </h1>
            <p className="text-xl mb-8">
              Experience the finest dining with our exceptional cuisine and atmosphere
            </p>
            <div className="flex flex-col gap-4">
              <Link to="/menu" className="inline-block px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors self-start">
                View Our Menu
              </Link>
              <Link to="https://skip.com" className="inline-block px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors self-start">
                Order With Skip the Dishes
              </Link>
            </div>
            
          </div>
        </div>
      </section>
      <Reviews title="What Our Customers Say" reviews={reviews} />
      <LeftTextRightImage
        imageSrc={table}
        imageAlt="Order Online"
        title="Order Online"
        description="Order delivery through Skip The Dishes"
        ctaText="Order Now"
        ctaLink="https://skip.com"
      />
      {/* Featured Menu Items */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Signature Dishes
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeletons
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-1/2" />
                  <div className="h-20 bg-gray-700 rounded" />
                </div>
              </div>
            ))
          ) : (
            menuItems.map((item) => (
              <Link
                key={item._id}
                to={`/menu-items/${item.slug}`}
                className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <span className="text-orange-500 font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-3">{item.description}</p>
                  {item.category && (
                    <span className="text-sm text-gray-400">
                      {item.category.title}
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="text-center mt-8">
          <Link to="/menu" className="btn-primary inline-flex items-center">
            View Full Menu
            <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {loading ? (
              // Loading skeletons
              [...Array(2)].map((_, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-600 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-600 rounded w-1/2 mb-4" />
                  <div className="h-20 bg-gray-600 rounded" />
                </div>
              ))
            ) : events.length > 0 ? (
              events.map((event) => (
                <Link
                  key={event._id}
                  to={`/events/${event.slug}`}
                  className="bg-gray-700 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center text-orange-500">
                      <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-400">No upcoming events at the moment</p>
              </div>
            )}
          </div>
          <div className="text-center mt-8">
            <Link to="/events" className="btn-primary inline-flex items-center">
              View All Events
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>
      </section>
      <ImageGallery galleryLink="/gallery" />
      
      <LeftTextRightImage
        imageSrc={table}
        imageAlt="Call Now"
        title="Call Now"
        description="Need to make a reservation? Have any questions? Just give us a call!"
        ctaText="Call Now"
        ctaLink="tel:+11234567890"
      />

      {/* Opening Hours */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Opening Hours</h2>
        <div className="flex justify-center space-x-12">
          <div className="text-center">
            <p className="text-orange-500 font-bold">Monday - Friday</p>
            <p>08:00 - 22:00</p>
          </div>
          <div className="text-center">
            <p className="text-orange-500 font-bold">Saturday - Sunday</p>
            <p>11:00 - 19:00</p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Make a Reservation</h2>
          <p className="text-gray-400 mb-8">
            Book your table now and experience our exceptional service
          </p>
          <Link to="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
