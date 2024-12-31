import { ArrowRight } from 'lucide-react'
import logo from '../assets/logo.webp'
import barvView from '../assets/bar-view.webp'
export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src= {barvView}
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
            <button className="btn-primary">
              Reserve a Table
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Few words about us</h2>
            <p className="text-gray-400 mb-6">
              Our restaurant combines traditional recipes with modern cooking techniques
              to create unique and unforgettable dining experiences.
            </p>
            <button className="btn-primary">
              Read More <ArrowRight className="inline ml-2" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/about-1.jpg" alt="About" className="rounded-lg" />
            <img src="/images/about-2.jpg" alt="About" className="rounded-lg" />
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
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
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Prepare for first-class service
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-800 rounded-lg p-6">
              <img
                src={`/images/service-${item}.jpg`}
                alt={`Service ${item}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Premium Service</h3>
              <p className="text-gray-400">
                Experience our exceptional service and attention to detail.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Enjoy Restaurant Specialties
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="/images/specialty-1.jpg"
              alt="Specialty"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Main Course</h3>
                <p className="text-gray-300">Starting from $24.99</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="/images/specialty-2.jpg"
              alt="Specialty"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Desserts</h3>
                <p className="text-gray-300">Starting from $12.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chefs */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Chefs</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((chef) => (
            <div key={chef} className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={`/images/chef-${chef}.jpg`}
                alt={`Chef ${chef}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Chef Name</h3>
                <p className="text-gray-400">
                  Master of international cuisine with over 10 years of experience.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((event) => (
              <div key={event} className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">Wine Tasting Event</h3>
                <p className="text-gray-400 mb-4">
                  Join us for an evening of fine wines and exquisite pairings.
                </p>
                <button className="btn-primary">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
