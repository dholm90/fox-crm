import React from 'react'
import PropTypes from 'prop-types'
import { Star } from 'lucide-react'

const ReviewCard = ({ name, rating, comment }) => (
  <div className="bg-gray-800 p-6 rounded-lg">
    <div className="flex items-center mb-4">
      <h3 className="text-xl font-bold mr-2">{name}</h3>
      <div className="flex">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="text-yellow-400" size={16} fill="currentColor" />
        ))}
      </div>
    </div>
    <p className="text-gray-400">{comment}</p>
  </div>
)

ReviewCard.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
}

const Reviews = ({ title, reviews }) => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </section>
  )
}

Reviews.propTypes = {
  title: PropTypes.string.isRequired,
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default Reviews

