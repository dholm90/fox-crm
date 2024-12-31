import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    tags: []
  })

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/menu-items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data)
      }
    } catch (error) {
      toast.error('Failed to fetch menu items')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      toast.error('Failed to fetch categories')
    }
  }

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/tags', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setTags(data)
      }
    } catch (error) {
      toast.error('Failed to fetch tags')
    }
  }

  useEffect(() => {
    Promise.all([
      fetchMenuItems(),
      fetchCategories(),
      fetchTags()
    ])
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = selectedItem 
        ? `http://localhost:3000/api/menu-items/${selectedItem._id}`
        : 'http://localhost:3000/api/menu-items'
      
      const response = await fetch(url, {
        method: selectedItem ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      })

      if (response.ok) {
        toast.success(selectedItem ? 'Menu item updated successfully' : 'Menu item created successfully')
        fetchMenuItems()
        closeModal()
      } else {
        toast.error('Failed to save menu item')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3000/api/menu-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Menu item deleted successfully')
        fetchMenuItems()
      } else {
        toast.error('Failed to delete menu item')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        price: item.price.toString(),
        image: item.image,
        category: item.category?._id || '',
        tags: item.tags?.map(tag => tag._id) || []
      })
      setSelectedItem(item)
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        image: '',
        category: '',
        tags: []
      })
      setSelectedItem(null)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
    setFormData({
      title: '',
      description: '',
      price: '',
      image: '',
      category: '',
      tags: []
    })
  }

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Menu Items</h1>
            <p className="text-gray-400">Manage your restaurant menu items</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Menu Item
          </button>
        </div>

        {/* Menu Items Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Tags</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : menuItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      No menu items found
                    </td>
                  </tr>
                ) : (
                  menuItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">
                        {item.description.slice(0, 50)}...
                      </td>
                      <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {item.category?.title || 'No category'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {item.tags?.map(tag => (
                            <span
                              key={tag._id}
                              className="px-2 py-1 bg-gray-700 rounded-full text-sm"
                            >
                              {tag.title}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openModal(item)}
                            className="p-2 text-blue-500 hover:text-blue-400"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-500 hover:text-red-400"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Menu Item Modal */}
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
                {selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </Dialog.Title>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
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
                <label className="block mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
              <label className="block mb-2">Image</label>
              <ImageUpload
                onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image}
              />
              </div>

              <div>
                <label className="block mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Tags</label>
                <div className="space-y-2">
                  {tags.map(tag => (
                    <label
                      key={tag._id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag._id)}
                        onChange={() => handleTagToggle(tag._id)}
                        className="rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
                      />
                      <span>{tag.title}</span>
                    </label>
                  ))}
                </div>
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
                  {selectedItem ? 'Update Menu Item' : 'Create Menu Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  )
}
