import { MapPin, Phone, Mail } from 'lucide-react'

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-400 mb-6">
              We'd love to hear from you. Please fill out the form or contact us using the information below.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin size={24} className="text-orange-500 mr-4" />
              <div>
                <h3 className="font-bold">Address</h3>
                <p className="text-gray-400">123 Restaurant Street, City, Country</p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone size={24} className="text-orange-500 mr-4" />
              <div>
                <h3 className="font-bold">Phone</h3>
                <p className="text-gray-400">+1 234 567 890</p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail size={24} className="text-orange-500 mr-4" />
              <div>
                <h3 className="font-bold">Email</h3>
                <p className="text-gray-400">info@restabook.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-800 p-8 rounded-lg">
          <form className="space-y-6">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
                placeholder="Your email"
              />
            </div>

            <div>
              <label className="block mb-2">Message</label>
              <textarea
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none h-32"
                placeholder="Your message"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
