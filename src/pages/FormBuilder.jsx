import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { createForm, updateForm, getForm } from '../utils/api';
import { TrashIcon, PlusIcon, ArrowLeftIcon, SwatchIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import AdSpace from '../components/AdSpace';

export default function FormBuilder() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showStyling, setShowStyling] = useState(false);
  const [form, setForm] = useState({
    title: '',
    useNetlify: false,
    formAction: '',
    steps: [{
      id: uuidv4(),
      title: '',
      fields: []
    }],
    styles: {
      colors: {
        primary: '#3b82f6',
        success: '#10b981',
        error: '#ef4444',
        text: '#374151',
        background: '#ffffff',
        border: '#d1d5db',
      },
      typography: {
        fontSize: '16px',
        titleSize: '1.25rem',
        labelSize: '0.875rem',
      },
      spacing: {
        padding: '0.75rem',
        borderRadius: '0.375rem',
        modalWidth: '500px',
      },
      borders: {
        width: '1px',
        style: 'solid',
      },
      buttons: {
        openText: 'Open Form',
        nextText: 'Next',
        previousText: 'Previous',
        submitText: 'Submit'
      }
    }
  });

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  const loadForm = async () => {
    try {
      setIsLoading(true);
      const data = await getForm(formId);
      setForm(data);
    } catch (error) {
      toast.error('Failed to load form');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Form title is required');
      return;
    }

    if (form.steps.some(step => !step.title.trim())) {
      toast.error('All steps must have a title');
      return;
    }

    if (form.steps.some(step => step.fields.length === 0)) {
      toast.error('Each step must have at least one field');
      return;
    }

    if (form.steps.some(step => 
      step.fields.some(field => !field.label.trim())
    )) {
      toast.error('All fields must have a label');
      return;
    }

    try {
      setIsLoading(true);
      const formData = {
        ...form,
        steps: form.steps.map(step => ({
          ...step,
          fields: step.fields.map(field => ({
            id: field.id,
            type: field.type,
            label: field.label,
            required: field.required
          }))
        }))
      };

      if (formId) {
        await updateForm(formId, formData);
        toast.success('Form updated successfully');
      } else {
        await createForm(formData);
        toast.success('Form created successfully');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(formId ? 'Failed to update form' : 'Failed to create form');
    } finally {
      setIsLoading(false);
    }
  };

  const addStep = () => {
    setForm(prev => ({
      ...prev,
      steps: [...prev.steps, { id: uuidv4(), title: '', fields: [] }]
    }))
  }

  const deleteStep = (stepIndex) => {
    if (form.steps.length === 1) {
      toast.error('Form must have at least one step')
      return
    }

    setForm(prev => ({
      ...prev,
      steps: prev.steps.filter((_, index) => index !== stepIndex)
    }))
  }

  const addField = (stepIndex) => {
    const newField = {
      id: uuidv4(),
      type: 'text',
      label: '',
      required: false
    }

    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, idx) => 
        idx === stepIndex 
          ? { ...step, fields: [...step.fields, newField] }
          : step
      )
    }))
  }

  const deleteField = (stepIndex, fieldIndex) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, idx) => 
        idx === stepIndex
          ? { ...step, fields: step.fields.filter((_, fidx) => fidx !== fieldIndex) }
          : step
      )
    }))
  }

  const updateField = (stepIndex, fieldIndex, updates) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, idx) => 
        idx === stepIndex
          ? {
              ...step,
              fields: step.fields.map((field, fidx) => 
                fidx === fieldIndex
                  ? { ...field, ...updates }
                  : field
              )
            }
          : step
      )
    }))
  }

  const updateStyle = (category, property, value) => {
    setForm(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [category]: {
          ...prev.styles[category],
          [property]: value
        }
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <AdSpace position="top" />

        <div className="my-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-300 hover:text-gray-500"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-white">Form Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border border-gray-300 bg-gray-600 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter form title"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex  ">
                <input
                  type="checkbox"
                  id="useNetlify"
                  checked={form.useNetlify}
                  onChange={e => setForm(prev => ({ ...prev, useNetlify: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="useNetlify" className="ml-2 text-gray-300">Use Netlify Forms</label>
              </div>

              {!form.useNetlify && (
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.formAction}
                    onChange={e => setForm(prev => ({ ...prev, formAction: e.target.value }))}
                    className="w-full p-2 border border-gray-300 bg-gray-600 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Custom form action URL (optional)"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Styling Options</h2>
            <button
              onClick={() => setShowStyling(!showStyling)}
              className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
            >
              <SwatchIcon className="w-5 h-5" />
              {showStyling ? 'Hide Styling' : 'Show Styling'}
            </button>
          </div>

          {showStyling && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-white mb-3">Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(form.styles.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={e => updateStyle('colors', key, e.target.value)}
                          className="h-9 w-9 rounded  bg-gray-300"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={e => updateStyle('colors', key, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-600 text-gray-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              

              <div>
                <h3 className="font-medium mb-3 text-white">Typography</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(form.styles.typography).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => updateStyle('typography', key, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-gray-100"
                        placeholder="e.g., 16px, 1.2rem"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-white">Spacing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(form.styles.spacing).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => updateStyle('spacing', key, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-gray-100"
                        placeholder="e.g., 1rem, 500px"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-white">Borders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Width</label>
                    <input
                      type="text"
                      value={form.styles.borders.width}
                      onChange={e => updateStyle('borders', 'width', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-gray-100"
                      placeholder="e.g., 1px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Style</label>
                    <select
                      value={form.styles.borders.style}
                      onChange={e => updateStyle('borders', 'style', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-gray-100"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
              <h3 className="font-medium mb-3 text-white">Button Text</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Open Button Text
                  </label>
                  <input
                    type="text"
                    value={form.styles.buttons.openText}
                    onChange={e => updateStyle('buttons', 'openText', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-gray-100"
                    placeholder="e.g., Open Form"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Next Button Text
                  </label>
                  <input
                    type="text"
                    value={form.styles.buttons.nextText}
                    onChange={e => updateStyle('buttons', 'nextText', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-gray-100"
                    placeholder="e.g., Next"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Previous Button Text
                  </label>
                  <input
                    type="text"
                    value={form.styles.buttons.previousText}
                    onChange={e => updateStyle('buttons', 'previousText', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-gray-100"
                    placeholder="e.g., Previous"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    value={form.styles.buttons.submitText}
                    onChange={e => updateStyle('buttons', 'submitText', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-600 text-gray-100"
                    placeholder="e.g., Submit"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

        {form.steps.map((step, stepIndex) => (
          <div key={step.id} className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4 bg">
              <input
                type="text"
                value={step.title}
                onChange={e => {
                  const newSteps = [...form.steps]
                  newSteps[stepIndex].title = e.target.value
                  setForm(prev => ({ ...prev, steps: newSteps }))
                }}
                placeholder="Step Title"
                className="flex-1 p-2 bg-gray-600 text-gray-100 border border-gray-300 rounded-md mr-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => deleteStep(stepIndex)}
                className="p-2 text-red-500 hover:bg-gray-300 rounded-md transition-colors"
                title="Delete Step"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {step.fields.map((field, fieldIndex) => (
                <div key={field.id} className="flex items-start gap-2 p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 shadow">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={field.type}
                      onChange={e => updateField(stepIndex, fieldIndex, { type: e.target.value })}
                      className="p-2 bg-gray-600 text-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="number">Number</option>
                      <option value="textarea">Textarea</option>
                      <option value="tel">Phone</option>
                      <option value="url">URL</option>
                      <option value="date">Date</option>
                    </select>
                    
                    <input
                      type="text"
                      value={field.label}
                      onChange={e => updateField(stepIndex, fieldIndex, { label: e.target.value })}
                      placeholder="Field Label"
                      className="p-2 border bg-gray-600 text-gray-100 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`required-${field.id}`}
                        checked={field.required}
                        onChange={e => updateField(stepIndex, fieldIndex, { required: e.target.checked })}
                        className="w-4 h-4 bg-gray-600 text-gray-100 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`required-${field.id}`} className="ml-2 text-gray-300">Required</label>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteField(stepIndex, fieldIndex)}
                    className="p-2 text-red-500 hover:bg-gray-300 rounded-md transition-colors"
                    title="Delete Field"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => addField(stepIndex)}
              className="mt-4 flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
            >
              <PlusIcon className="w-5 h-5" />
              Add Field
            </button>
          </div>
        ))}

        <div className="flex gap-4 mt-6">
          <button
            onClick={addStep}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
          >
            Add Step
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Save Form
          </button>
        </div>

        <div className="mt-6">
          <AdSpace position="bottom" />
        </div>
      </div>
    </div>
  )
}
