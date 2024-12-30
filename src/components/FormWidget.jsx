import React, { useState } from 'react'

export default function FormWidget({ form }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  const validateField = (field, value) => {
    if (field.required && !value) {
      return 'This field is required'
    }
    if (field.type === 'email' && value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return 'Please enter a valid email address'
    }
    if (field.type === 'number' && value && isNaN(value)) {
      return 'Please enter a valid number'
    }
    return ''
  }

  const handleNext = () => {
    const currentFields = form.steps[currentStep].fields
    const newErrors = {}
    
    // Always validate fields but proceed anyway
    currentFields.forEach(field => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })
    
    setErrors(newErrors)
    setCurrentStep(prev => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields before final submission
    const currentFields = form.steps[currentStep].fields
    const newErrors = {}
    let isValid = true

    currentFields.forEach(field => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
        isValid = false
      }
    })

    setErrors(newErrors)

    if (!isValid) return

    try {
      if (form.useNetlify || form.formAction) {
        e.target.submit()
      } else {
        console.log('Form submitted:', formData)
        alert('Form submitted successfully!')
        setIsOpen(false)
        setCurrentStep(0)
        setFormData({})
        setErrors({})
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form. Please try again.')
    }
  }

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }))
    }
  }

  const renderField = (field) => {
    const commonProps = {
      id: field.id,
      name: field.label,
      value: formData[field.id] || '',
      onChange: (e) => handleInputChange(field.id, e.target.value),
      required: field.required,
      className: `w-full p-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
    }

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={4} />
      case 'email':
        return <input type="email" {...commonProps} />
      case 'number':
        return <input type="number" {...commonProps} />
      case 'tel':
        return <input type="tel" {...commonProps} />
      case 'url':
        return <input type="url" {...commonProps} />
      case 'date':
        return <input type="date" {...commonProps} />
      default:
        return <input type="text" {...commonProps} />
    }
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
        onMouseOver={e => e.target.style.background = '#2563eb'}
        onMouseOut={e => e.target.style.background = '#3b82f6'}
      >
        Open {form.title}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600
              }}>{form.title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.25rem',
              marginBottom: '1rem'
            }}>
              {form.steps.map((_, index) => (
                <div
                  key={index}
                  style={{
                    height: '0.25rem',
                    flex: 1,
                    background: index <= currentStep ? '#3b82f6' : '#e5e7eb',
                    borderRadius: '0.125rem'
                  }}
                />
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              {...(form.useNetlify ? { 'data-netlify': 'true' } : {})}
              {...(form.formAction ? { action: form.formAction } : {})}
              method="POST"
            >
              {form.useNetlify && (
                <input type="hidden" name="form-name" value={form.title} />
              )}
              
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 500,
                marginBottom: '1rem',
                color: '#374151'
              }}>
                {form.steps[currentStep].title}
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                {form.steps[currentStep].fields.map(field => (
                  <div key={field.id} style={{ marginBottom: '1rem' }}>
                    <label
                      htmlFor={field.id}
                      style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 500,
                        color: '#374151'
                      }}
                    >
                      {field.label}
                      {field.required && (
                        <span style={{
                          color: '#ef4444',
                          marginLeft: '0.25rem'
                        }}>*</span>
                      )}
                    </label>
                    <div style={{ marginBottom: '0.25rem' }}>
                      {renderField(field)}
                    </div>
                    {errors[field.id] && (
                      <p style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginTop: '0.25rem'
                      }}>
                        {errors[field.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1.5rem'
              }}>
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                    onMouseOver={e => e.target.style.background = '#e5e7eb'}
                    onMouseOut={e => e.target.style.background = '#f3f4f6'}
                  >
                    Previous
                  </button>
                )}
                <div style={{ marginLeft: 'auto' }}>
                  {currentStep < form.steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                      onMouseOver={e => e.target.style.background = '#2563eb'}
                      onMouseOut={e => e.target.style.background = '#3b82f6'}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                      onMouseOver={e => e.target.style.background = '#059669'}
                      onMouseOut={e => e.target.style.background = '#10b981'}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
