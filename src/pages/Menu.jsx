import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function Menu() {
  const [menus, setMenus] = useState([])
  const [activeMenu, setActiveMenu] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Get unique categories from menu items
  const getUniqueCategories = () => {
    const currentMenu = menus.find(menu => menu._id === activeMenu);
    if (!currentMenu?.menuItems) return [];

    const uniqueCategories = new Set();
    currentMenu.menuItems.forEach(item => {
      if (item.category) {
        uniqueCategories.add(JSON.stringify(item.category));
      }
    });

    return Array.from(uniqueCategories).map(cat => JSON.parse(cat));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch menus with populated menuItems, categories, and tags
        const menusResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/menus`)
        const menusData = await menusResponse.json()
        console.log('Menus data:', menusData) // Debug log
        setMenus(menusData)
        
        if (menusData.length > 0) {
          setActiveMenu(menusData[0]._id)
        }

      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load menu data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get current menu's items
  const getCurrentMenuItems = () => {
    const currentMenu = menus.find(menu => menu._id === activeMenu)
    return currentMenu?.menuItems || []
  }

  // Filter menu items based on active category
  const filteredItems = getCurrentMenuItems().filter(item => {
    if (activeCategory === 'all') return true
    return item.category?._id === activeCategory
  })

  const uniqueCategories = getUniqueCategories()

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
        <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our carefully curated menus featuring the finest ingredients and expert preparation
        </p>
      </div>

      {/* Menu Selection */}
      {menus.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {menus.map((menu) => (
              <button
                key={menu._id}
                onClick={() => {
                  setActiveMenu(menu._id);
                  setActiveCategory('all');
                }}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeMenu === menu._id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {menu.title}
              </button>
            ))}
          </div>
          {activeMenu && (
            <div className="mt-4 text-center">
              <p className="text-gray-400">
                {menus.find(menu => menu._id === activeMenu)?.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Category Filters */}
      {uniqueCategories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeCategory === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {uniqueCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => setActiveCategory(category._id)}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeCategory === category._id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      )}

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No menu items found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-gray-800 rounded-lg overflow-hidden group"
          >
            <Link
              to={`/menu-items/${item.slug}`}
              className="block hover:transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">
                      {item.title}
                    </h3>
                    {item.category && (
                      <span className="text-sm text-gray-400">
                        {item.category.title}
                      </span>
                    )}
                  </div>
                  <span className="text-orange-500 font-bold">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span
                        key={tag._id}
                        className="px-2 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}
