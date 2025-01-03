import React from 'react'
import PropTypes from 'prop-types'

const CenteredHeadingText = ({ title, description }) => {
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
    </section>
  )
}

CenteredHeadingText.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default CenteredHeadingText

