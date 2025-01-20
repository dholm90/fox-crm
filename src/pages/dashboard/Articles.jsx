import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch articles')
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      toast.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete article')
      
      toast.success('Article deleted successfully')
      fetchArticles()
    } catch (error) {
      toast.error('Failed to delete article')
    }
  }

  const togglePublish = async (article) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${article._id}/publish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to update article')
      
      toast.success(article.published ? 'Article unpublished' : 'Article published')
      fetchArticles()
    } catch (error) {
      toast.error('Failed to update article')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Articles</h1>
            <p className="text-gray-400">Manage your blog articles</p>
          </div>
          <Link
            to="/dashboard/articles/new"
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            New Article
          </Link>
        </div>

        {/* Articles Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Created</th>
                  <th className="px-6 py-3 text-left">Published</th>
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
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      No articles found
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {article.coverImage && (
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-10 h-10 rounded object-cover mr-3"
                            />
                          )}
                          <span>{article.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          article.published
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {format(new Date(article.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        {article.publishedAt
                          ? format(new Date(article.publishedAt), 'MMM d, yyyy')
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/dashboard/articles/${article._id}/edit`}
                            className="p-2 text-blue-500 hover:text-blue-400"
                          >
                            <Pencil size={20} />
                          </Link>
                          <button
                            onClick={() => togglePublish(article)}
                            className={`p-2 ${
                              article.published
                                ? 'text-yellow-500 hover:text-yellow-400'
                                : 'text-green-500 hover:text-green-400'
                            }`}
                          >
                            {article.published ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                          <button
                            onClick={() => handleDelete(article._id)}
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
    </DashboardLayout>
  )
}
