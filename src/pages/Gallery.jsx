import { useState, useEffect } from 'react'
import { Loader2, X } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import toast from 'react-hot-toast'

export default function Gallery() {
  const [gallery, setGallery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`)
        if (!response.ok) throw new Error('Failed to fetch gallery')
        const data = await response.json()
        setGallery(data)
      } catch (error) {
        console.error('Error fetching gallery:', error)
        toast.error('Failed to load gallery')
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Gallery</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Take a visual journey through our restaurant's atmosphere and culinary creations
        </p>
      </div>

      {!gallery?.images || gallery.images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No images available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.images.map((image) => (
            <div
              key={image._id}
              onClick={() => setSelectedImage(image)}
              className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-white font-semibold">{image.title}</h3>
                  {image.description && (
                    <p className="text-gray-200 text-sm mt-1">{image.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/75" />

        <div className="relative bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <img
            src={selectedImage?.url}
            alt={selectedImage?.title}
            className="w-full h-auto max-h-[80vh] object-contain"
          />

          <div className="p-4 bg-gray-900">
            <h3 className="text-lg font-semibold">{selectedImage?.title}</h3>
            {selectedImage?.description && (
              <p className="text-gray-400 mt-1">{selectedImage.description}</p>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  )
}
