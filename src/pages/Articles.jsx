import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/public`)
        if (!response.ok) throw new Error('Failed to fetch articles')
        const data = await response.json()
        setArticles(data)
      } catch (error) {
        toast.error('Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

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
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Latest news, updates, and stories from our restaurant
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link
            key={article._id}
            to={`/articles/${article.slug}`}
            className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
          >
            {article.coverImage && (
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{article.title}</h2>
              <p className="text-gray-400 mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</span>
                <span>{article.readingTime} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
