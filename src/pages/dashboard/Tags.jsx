import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Hash } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function Tags() {
  const [tags, setTags] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuItemCounts, setMenuItemCounts] = useState({})
  const [formData, setFormData] = useState({
    title: ''
  })

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tags`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setTags(data)
        // Fetch menu item counts for each tag
        data.forEach(tag => {
          fetchMenuItemCount(tag._id)
        })
      }
    } catch (error) {
      toast.error('Failed to fetch tags')
    } finally {
      setLoading(false)
    }
  }

  const fetchMenuItemCount = async (tagId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menu-items/tag/${tagId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMenuItemCounts(prev => ({
          ...prev,
          [tagId]: data.length
        }))
      }
    } catch (error) {
      console.error('Failed to fetch menu item count:', error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = selectedTag 
        ? `${import.meta.env.VITE_API_URL}/api/tags/${selectedTag._id}`
        : `${import.meta.env.VITE_API_URL}/api/tags`
      
      const response = await fetch(url, {
        method: selectedTag ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(selectedTag ? 'Tag updated successfully' : 'Tag created successfully')
        fetchTags()
        closeModal()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to save tag')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (tagId) => {
    // Check if tag has menu items
    if (menuItemCounts[tagId] > 0) {
      toast.error('Cannot delete tag with associated menu items')
      return
    }

    if (!window.confirm('Are you sure you want to delete this tag?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tags/${tagId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Tag deleted successfully')
        fetchTags()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to delete tag')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const openModal = (tag = null) => {
    if (tag) {
      setFormData({
        title: tag.title
      })
      setSelectedTag(tag)
    } else {
      setFormData({
        title: ''
      })
      setSelectedTag(null)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTag(null)
    setFormData({
      title: ''
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tags</h1>
            <p className="text-gray-400">Manage your menu item tags</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Tag
          </button>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8">Loading...</div>
          ) : tags.length === 0 ? (
            <div className="col-span-full text-center py-8">No tags found</div>
          ) : (
            tags.map((tag) => (
              <div
                key={tag._id}
                className="bg-gray-800 rounded-lg p-4 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Hash size={18} className="text-orange-500" />
                    <h3 className="font-semibold truncate">{tag.title}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openModal(tag)}
                      className="p-1.5 text-blue-500 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(tag._id)}
                      className="p-1.5 text-red-500 hover:text-red-400 transition-colors rounded-md hover:bg-gray-700"
                      disabled={menuItemCounts[tag._id] > 0}
                      title={menuItemCounts[tag._id] > 0 ? "Cannot delete tag with menu items" : "Delete tag"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-auto pt-2 border-t border-gray-700">
                  <span className="text-sm text-gray-400">
                    {menuItemCounts[tag._id] || 0} menu items
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tag Modal */}
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
                {selectedTag ? 'Edit Tag' : 'Add New Tag'}
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
                <div className="relative">
                  <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
                    placeholder="Enter tag title"
                    required
                  />
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
                  {selectedTag ? 'Update Tag' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  )
}
