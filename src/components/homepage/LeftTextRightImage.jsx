import React from 'react'
import PropTypes from 'prop-types'
import { ArrowRight } from 'lucide-react'

const LeftTextRightImage = ({ imageSrc, imageAlt, title, description, ctaText, ctaLink }) => {
  return (
    <section className="bg-gray-800  py-16">
        <div className='container mx-auto px-4'>
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="w-full md:w-1/2">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="text-gray-400">{description}</p>
                {ctaText && ctaLink && (
                    <a href={ctaLink} className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors">
                    {ctaText}
                    <ArrowRight className="ml-2" size={16} />
                    </a>
                )}
                </div>
            </div>  
        </div>
      
    </section>
  )
}

LeftTextRightImage.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
}

export default LeftTextRightImage

