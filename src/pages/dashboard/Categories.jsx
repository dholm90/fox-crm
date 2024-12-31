import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuItemCounts, setMenuItemCounts] = useState({})
  const [formData, setFormData] = useState({
    title: ''
  })

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
        // Fetch menu item counts for each category
        data.forEach(category => {
          fetchMenuItemCount(category._id)
        })
      }
    } catch (error) {
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const fetchMenuItemCount = async (categoryId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3000/api/menu-items/category/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMenuItemCounts(prev => ({
          ...prev,
          [categoryId]: data.length
        }))
      }
    } catch (error) {
      console.error('Failed to fetch menu item count:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = selectedCategory 
        ? `http://localhost:3000/api/categories/${selectedCategory._id}`
        : 'http://localhost:3000/api/categories'
      
      const response = await fetch(url, {
        method: selectedCategory ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(selectedCategory ? 'Category updated successfully' : 'Category created successfully')
        fetchCategories()
        closeModal()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to save category')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (categoryId) => {
    // Check if category has menu items
    if (menuItemCounts[categoryId] > 0) {
      toast.error('Cannot delete category with associated menu items')
      return
    }

    if (!window.confirm('Are you sure you want to delete this category?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Category deleted successfully')
        fetchCategories()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to delete category')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const openModal = (category = null) => {
    if (category) {
      setFormData({
        title: category.title
      })
      setSelectedCategory(category)
    } else {
      setFormData({
        title: ''
      })
      setSelectedCategory(null)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
    setFormData({
      title: ''
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Categories</h1>
            <p className="text-gray-400">Manage your menu categories</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-8">No categories found</div>
          ) : (
            categories.map((category) => (
              <div
                key={category._id}
                className="bg-gray-800 rounded-lg p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Tag size={20} className="text-orange-500 mr-3" />
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(category)}
                      className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 text-red-500 hover:text-red-400 transition-colors"
                      disabled={menuItemCounts[category._id] > 0}
                      title={menuItemCounts[category._id] > 0 ? "Cannot delete category with menu items" : "Delete category"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-auto">
                  <span className="text-sm text-gray-400">
                    {menuItemCounts[category._id] || 0} menu items
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Category Modal */}
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
                {selectedCategory ? 'Edit Category' : 'Add New Category'}
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
                  placeholder="Enter category title"
                  required
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
                  {selectedCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  )
}
