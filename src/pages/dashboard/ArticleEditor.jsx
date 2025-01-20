import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import Editor from '../../components/Editor'
import ImageUpload from '../../components/ImageUpload'

export default function ArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(id ? true : false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    published: false
  })

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return

      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch article')
        
        const data = await response.json()
        setFormData({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.coverImage,
          published: data.published
        })
      } catch (error) {
        toast.error('Failed to load article')
        navigate('/dashboard/articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      const url = id
        ? `${import.meta.env.VITE_API_URL}/api/articles/${id}`
        : `${import.meta.env.VITE_API_URL}/api/articles`

      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save article')

      toast.success(id ? 'Article updated successfully' : 'Article created successfully')
      navigate('/dashboard/articles')
    } catch (error) {
      toast.error('Failed to save article')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 size={40} className="animate-spin text-orange-500" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard/articles')}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Articles
          </button>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
              />
              <span>Published</span>
            </label>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Article'
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none"
              placeholder="Enter article title"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none h-24"
              placeholder="Enter article excerpt"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Cover Image</label>
            <ImageUpload
              onImageUploaded={(imageData) => {
                const imageUrl = typeof imageData === 'object' ? imageData.url : imageData
                setFormData(prev => ({ ...prev, coverImage: imageUrl }))
              }}
              currentImage={formData.coverImage}
            />
          </div>

          <div>
            <label className="block mb-2">Content</label>
            <Editor
              initialContent={formData.content}
              onChange={(content) => {
                setFormData(prev => ({ ...prev, content }))
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
