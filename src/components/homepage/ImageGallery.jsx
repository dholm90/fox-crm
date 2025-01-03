import {React, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { Loader2, X } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

const ImageGallery = ({ galleryLink }) => {
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)

     useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch gallery images
            const galleryResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery?limit=4`)
            const galleryData = await galleryResponse.json()
            setGallery(galleryData)
          } catch (error) {
            console.error('Error fetching data:', error)
          } finally {
            setLoading(false)
          }
        }
        fetchData()
      }, [])
  
      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 size={40} className="animate-spin text-orange-500" />
          </div>
        )
      }

  return (
    <section className="container mx-auto px-4 ">
      <h2 className="text-3xl font-bold text-center mb-12">Our Gallery</h2>
      {!gallery?.images || gallery.images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No images available</p>
        </div>
      ) : (
      <div className="grid grid-cols-2 gap-4">
        {gallery.images.slice(0, 4).map((image) => (
          <img
            key={image._id}
            src={image.url}
            alt={image.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        ))}
        
      </div>
      )}
      <div className="text-center mt-8">
        <a
          href={galleryLink}
          className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
        >
          View Full Gallery
          <ArrowRight className="ml-2" size={16} />
        </a>
      </div>
    </section>
  )
}

ImageGallery.propTypes = {
  galleryLink: PropTypes.string.isRequired,
}

export default ImageGallery

