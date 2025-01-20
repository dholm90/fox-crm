import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react'
import { marked } from 'marked'
import toast from 'react-hot-toast'

export default function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  marked.use({
    renderer: {
      image(href, title, text) {
        return `<img src="${href}" alt="${text}" class="max-w-full h-auto rounded-lg my-4" />`
      }
    }
  })

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/public/${slug}`)
        if (!response.ok) {
          throw new Error('Article not found')
        }
        const data = await response.json()
        setArticle(data)
      } catch (error) {
        toast.error('Failed to load article')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-400 text-xl mb-4">Article not found</p>
        <Link to="/articles" className="btn-primary inline-flex items-center">
          <ArrowLeft size={20} className="mr-2" />
          Back to Articles
        </Link>
      </div>
    )
  }

  const publishDate = new Date(article.publishedAt)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="relative -mt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link 
              to="/articles" 
              className="inline-flex items-center text-orange-500 hover:text-orange-400 mb-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Articles
            </Link>

            {/* Article Details Card */}
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center text-gray-300">
                    <Calendar size={24} className="text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Published</p>
                      <p>{publishDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <User size={24} className="text-orange-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Author</p>
                      <p>{article.author.email}</p>
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="mb-8">
                  <p className="text-lg text-gray-300 italic border-l-4 border-orange-500 pl-4">
                    {article.excerpt}
                  </p>
                </div>

                {/* Main Content */}
                <div 
                  className="prose prose-invert prose-orange max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked(article.content, { breaks: true }) 
                  }}
                />

                {/* Share Section */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('Link copied to clipboard!')
                    }}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-lg"
                  >
                    Share Article
                  </button>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="border-t border-gray-700 bg-gray-800/50 p-8">
                <h2 className="text-xl font-bold mb-4">About the Author</h2>
                <div className="text-gray-300">
                  <p>Written by {article.author.email}</p>
                  <p className="mt-2 text-gray-400">
                    Published on {publishDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
