import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Tag, Loader2, UtensilsCrossed, Clock, Leaf } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MenuItemDetails() {
  const { slug } = useParams()
  const [menuItem, setMenuItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        console.log('Fetching menu item with slug:', slug); // Debug log
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menu-items/by-slug/${slug}`);
        if (!response.ok) {
          console.error('Response not ok:', response.status); // Debug log
          throw new Error('Menu item not found');
        }
        const data = await response.json();
        console.log('Fetched menu item:', data); // Debug log
        setMenuItem(data);
      } catch (error) {
        console.error('Error fetching menu item:', error); // Debug log
        toast.error('Failed to load menu item');
      } finally {
        setLoading(false);
      }
    };
  
    if (slug) {
      fetchMenuItem();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    )
  }

  if (!menuItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-400 text-xl mb-4">Menu item not found</p>
        <Link to="/menu" className="btn-primary inline-flex items-center">
          <ArrowLeft size={20} className="mr-2" />
          Back to Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={menuItem.image}
          alt={menuItem.title}
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
              to="/menu" 
              className="inline-flex items-center text-orange-500 hover:text-orange-400 mb-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Menu
            </Link>

            {/* Menu Item Details Card */}
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold">{menuItem.title}</h1>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-orange-500">
                      ${menuItem.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {menuItem.category && (
                  <div className="inline-block px-4 py-2 bg-gray-700 rounded-full text-sm mb-6">
                    {menuItem.category.title}
                  </div>
                )}

                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-lg leading-relaxed text-gray-300">
                    {menuItem.description}
                  </p>
                </div>

                {menuItem.tags && menuItem.tags.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center text-orange-500 mb-3">
                      <Tag size={20} className="mr-2" />
                      <span className="font-semibold">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {menuItem.tags.map(tag => (
                        <span
                          key={tag._id}
                          className="px-4 py-2 bg-gray-700 rounded-full text-sm"
                        >
                          {tag.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full md:w-auto btn-primary py-3 text-lg">
                  Add to Order
                </button>
              </div>

              {/* Additional Info Section */}
              <div className="border-t border-gray-700 bg-gray-800/50 p-8">
                <h2 className="text-xl font-bold mb-6">Details</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start">
                    <UtensilsCrossed size={24} className="text-orange-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Preparation</h3>
                      <p className="text-gray-400">Made fresh to order</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock size={24} className="text-orange-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Cooking Time</h3>
                      <p className="text-gray-400">15-20 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Leaf size={24} className="text-orange-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Dietary</h3>
                      <p className="text-gray-400">Options available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
