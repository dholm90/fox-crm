import { useState, useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Pencil, Trash2, X, List, ExternalLink } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'

export default function Menus() {
  const location = useLocation()
  const [menus, setMenus] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuItemsModalOpen, setIsMenuItemsModalOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuItems, setMenuItems] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    menuItems: []
  })

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menu-items`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch menu items')
      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error('Error fetching menu items:', error)
      toast.error('Failed to load menu items')
    }
  }

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch menus')
      const data = await response.json()
      console.log('Fetched menus:', data) // Debug log
      setMenus(data)
    } catch (error) {
      console.error('Error fetching menus:', error)
      toast.error('Failed to load menus')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenus()
    fetchMenuItems()
  }, [])

  const handleAddMenuItem = async (menuItemId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/${selectedMenu._id}/menu-items/${menuItemId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
  
      if (!response.ok) throw new Error('Failed to add menu item')
      
      const updatedMenu = await response.json()
      setMenus(menus.map(menu => 
        menu._id === selectedMenu._id ? updatedMenu : menu
      ))
      toast.success('Menu item added successfully')
    } catch (error) {
      console.error('Error adding menu item:', error)
      toast.error('Failed to add menu item')
    }
  }
  
  const handleRemoveMenuItem = async (menuItemId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/${selectedMenu._id}/menu-items/${menuItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
  
      if (!response.ok) throw new Error('Failed to remove menu item')
      
      const updatedMenu = await response.json()
      setMenus(menus.map(menu => 
        menu._id === selectedMenu._id ? updatedMenu : menu
      ))
      toast.success('Menu item removed successfully')
    } catch (error) {
      console.error('Error removing menu item:', error)
      toast.error('Failed to remove menu item')
    }
  }
  
  // Add this function to open the menu items modal
  const openMenuItemsModal = (menu) => {
    setSelectedMenu(menu)
    setIsMenuItemsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = selectedMenu 
        ? `${import.meta.env.VITE_API_URL}/api/menus/${selectedMenu._id}`
        : `${import.meta.env.VITE_API_URL}/api/menus`
      
      console.log('Submitting menu data:', formData) // Debug log

      const response = await fetch(url, {
        method: selectedMenu ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save menu')
      }
      
      await fetchMenus()
      closeModal()
      toast.success(selectedMenu ? 'Menu updated successfully' : 'Menu created successfully')
    } catch (error) {
      console.error('Error saving menu:', error)
      toast.error(error.message || 'Failed to save menu')
    }
  }

  const handleDelete = async (menuId) => {
    if (!window.confirm('Are you sure you want to delete this menu? This action cannot be undone.')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menus/${menuId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete menu')
      
      await fetchMenus()
      toast.success('Menu deleted successfully')
    } catch (error) {
      console.error('Error deleting menu:', error)
      toast.error('Failed to delete menu')
    }
  }

  const openModal = (menu = null) => {
    if (menu) {
      setFormData({
        title: menu.title,
        description: menu.description,
        image: menu.image || '',
        menuItems: menu.menuItems || []
      })
      setSelectedMenu(menu)
    } else {
      setFormData({
        title: '',
        description: '',
        image: '',
        menuItems: []
      })
      setSelectedMenu(null)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMenu(null)
    setFormData({
      title: '',
      description: '',
      image: '',
      menuItems: []
    })
  }

  useLayoutEffect(() => {
    if (location.state?.openModal) {
      openModal()
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Menus</h1>
            <p className="text-gray-400">Create and manage your restaurant menus</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Create New Menu
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <List size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Menus Created</h3>
            <p className="text-gray-400 mb-4">Get started by creating your first menu</p>
            <button
              onClick={() => openModal()}
              className="btn-primary"
            >
              Create Menu
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div key={menu._id} className="bg-gray-800 rounded-lg overflow-hidden">
                {menu.image && (
                  <div className="relative h-48">
                    <img
                      src={menu.image}
                      alt={menu.title}
                      className="w-full h-full object-cover"
                    />
                    <Link
                      to={`/menu/${menu.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </Link>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{menu.title}</h3>
                  <p className="text-gray-400 mb-4">{menu.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {menu.menuItems?.length || 0} items
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openMenuItemsModal(menu)}
                        className="p-2 text-orange-500 hover:text-orange-400 transition-colors"
                        title="Manage Menu Items"
                      >
                        <List size={20} />
                      </button>
                      <button
                        onClick={() => openModal(menu)}
                        className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                        title="Edit Menu"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(menu._id)}
                        className="p-2 text-red-500 hover:text-red-400 transition-colors"
                        title="Delete Menu"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Menu Items Modal */}
<Dialog
  open={isMenuItemsModalOpen}
  onClose={() => setIsMenuItemsModalOpen(false)}
  className="fixed inset-0 z-50 overflow-y-auto"
>
  <div className="flex items-center justify-center min-h-screen p-4">
    <Dialog.Overlay className="fixed inset-0 bg-black/75" />

    <div className="relative bg-gray-800 rounded-lg max-w-4xl w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <Dialog.Title className="text-xl font-bold">
          Manage Menu Items - {selectedMenu?.title}
        </Dialog.Title>
        <button
          onClick={() => setIsMenuItemsModalOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Menu Items */}
        <div>
          <h3 className="font-bold mb-4">Available Items</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {menuItems
              .filter(item => !selectedMenu?.menuItems?.some(menuItem => 
                (menuItem._id || menuItem) === item._id
              ))
              .map(item => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddMenuItem(item._id)}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded-md"
                  >
                    Add
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Current Menu Items */}
        <div>
          <h3 className="font-bold mb-4">Current Menu Items</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {menuItems
              .filter(item => selectedMenu?.menuItems?.some(menuItem => 
                (menuItem._id || menuItem) === item._id
              ))
              .map(item => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMenuItem(item._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</Dialog>

      {/* Menu Form Modal */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/75" />

          <div className="relative bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-bold">
                {selectedMenu ? 'Edit Menu' : 'Create New Menu'}
              </Dialog.Title>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none h-32"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Image (Optional)</label>
                <ImageUpload
                  onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                  currentImage={formData.image}
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {selectedMenu ? 'Update Menu' : 'Create Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  )
}
