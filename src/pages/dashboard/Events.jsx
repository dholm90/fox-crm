import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Calendar } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import ImageUpload from '../../components/ImageUpload'

export default function Events() {
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    image: ''
  })

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      toast.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = selectedEvent 
        ? `${import.meta.env.VITE_API_URL}/api/events/${selectedEvent._id}`
        : `${import.meta.env.VITE_API_URL}/api/events`
      
      const response = await fetch(url, {
        method: selectedEvent ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(selectedEvent ? 'Event updated successfully' : 'Event created successfully')
        fetchEvents()
        closeModal()
      } else {
        toast.error('Failed to save event')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Event deleted successfully')
        fetchEvents()
      } else {
        toast.error('Failed to delete event')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const openModal = (event = null) => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date.split('T')[0],
        time: event.time,
        image: event.image
      })
      setSelectedEvent(event)
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        image: ''
      })
      setSelectedEvent(null)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      image: ''
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Events Management</h1>
            <p className="text-gray-400">Manage your restaurant events</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Event
          </button>
        </div>

        {/* Events Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">{event.title}</td>
                      <td className="px-6 py-4">
                        {event.description.slice(0, 50)}...
                      </td>
                      <td className="px-6 py-4">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{event.time}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openModal(event)}
                            className="p-2 text-blue-500 hover:text-blue-400"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
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

      {/* Event Modal */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black/75" />

          <div className="relative bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-bold">
                {selectedEvent ? 'Edit Event' : 'Add New Event'}
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
    <label className="block mb-2">Image</label>
    <ImageUpload
      onImageUploaded={(url) => setFormData({ ...formData, image: url })}
      currentImage={formData.image}
    />
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block mb-2">Date</label>
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
        required
      />
    </div>

    <div>
      <label className="block mb-2">Time</label>
      <input
        type="time"
        value={formData.time}
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
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
      {selectedEvent ? 'Update Event' : 'Create Event'}
    </button>
  </div>
</form>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  )
}
