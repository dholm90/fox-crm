import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, X, GripVertical, Loader2, Pencil } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'

export default function GalleryDashboard() {
  const [gallery, setGallery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: ''
  })

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

  useEffect(() => {
    fetchGallery()
  }, [])

  const handleImageUploaded = async (imageData) => {
    try {
      console.log('Received image data:', imageData);
      const token = localStorage.getItem('token');
      
      if (!imageData?._id) {
        throw new Error('Invalid image data received');
      }
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery/images/${imageData._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add image to gallery');
      }
  
      const updatedGallery = await response.json();
      console.log('Updated gallery:', updatedGallery);
      setGallery(updatedGallery);
      setIsUploadModalOpen(false);
      toast.success('Image added to gallery');
    } catch (error) {
      console.error('Error adding image to gallery:', error);
      toast.error(error.message || 'Failed to add image to gallery');
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to remove this image from the gallery?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to remove image')
      
      const updatedGallery = await response.json()
      setGallery(updatedGallery)
      toast.success('Image removed from gallery')
    } catch (error) {
      toast.error('Failed to remove image')
    }
  }

  const handleEditImage = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/images/${selectedImage._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      if (!response.ok) throw new Error('Failed to update image')

      await fetchGallery()
      setIsEditModalOpen(false)
      setSelectedImage(null)
      toast.success('Image updated successfully')
    } catch (error) {
      toast.error('Failed to update image')
    }
  }

  const openEditModal = (image) => {
    setSelectedImage(image)
    setEditForm({
      title: image.title || '',
      description: image.description || ''
    })
    setIsEditModalOpen(true)
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const items = Array.from(gallery.images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Optimistic update
    setGallery(prev => ({ ...prev, images: items }))

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery/reorder`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageIds: items.map(img => img._id)
        })
      })

      if (!response.ok) throw new Error('Failed to reorder images')
      
      const updatedGallery = await response.json()
      setGallery(updatedGallery)
    } catch (error) {
      toast.error('Failed to reorder images')
      fetchGallery() // Revert to original order
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gallery Management</h1>
            <p className="text-gray-400">Manage your restaurant's gallery images</p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Image
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={40} className="animate-spin text-orange-500" />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="gallery">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {gallery?.images.map((image, index) => (
                    <Draggable
                      key={image._id}
                      draggableId={image._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-gray-800 rounded-lg overflow-hidden group relative ${
                            snapshot.isDragging ? 'ring-2 ring-orange-500' : ''
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="absolute top-2 left-2 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                          >
                            <GripVertical size={20} />
                          </div>
                          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(image)}
                              className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              <Pencil size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteImage(image._id)}
                              className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-semibold">{image.title}</h3>
                            {image.description && (
                              <p className="text-sm text-gray-400">{image.description}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Upload Modal */}
      <Dialog
  open={isUploadModalOpen}
  onClose={() => setIsUploadModalOpen(false)}
  className="fixed inset-0 z-50 overflow-y-auto"
>
  <div className="flex items-center justify-center min-h-screen p-4">
    <Dialog.Overlay className="fixed inset-0 bg-black/75" />

    <div className="relative bg-gray-800 rounded-lg max-w-md w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <Dialog.Title className="text-xl font-bold">
          Add Gallery Image
        </Dialog.Title>
        <button
          onClick={() => setIsUploadModalOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <ImageUpload 
        onImageUploaded={(imageData) => {
          if (imageData) {
            handleImageUploaded(imageData)
          }
          setIsUploadModalOpen(false)
        }} 
      />

      <div className="mt-4 text-sm text-gray-400">
        <p>Supported formats: JPG, PNG, GIF</p>
        <p>Maximum file size: 5MB</p>
      </div>
    </div>
  </div>
</Dialog>

      {/* Edit Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black/75" />

          <div className="relative bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-bold">
                Edit Image Details
              </Dialog.Title>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditImage} className="space-y-4">
              <div>
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none h-32"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  )
}
