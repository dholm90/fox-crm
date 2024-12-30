import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getForm } from '../utils/api';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import AdSpace from '../components/AdSpace';
import toast from 'react-hot-toast';

export default function FormPreview() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    loadForm();
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

  useEffect(() => {
    if (form && previewContainerRef.current) {
      // Clean up any previous instances
      const previousStyles = document.querySelector(`style[data-form-id="${form.id}"]`)
      if (previousStyles) {
        previousStyles.remove()
      }

      // Clear previous content
      previewContainerRef.current.innerHTML = ''
      
      // Create a container for the form widget
      const widgetContainer = document.createElement('div')
      widgetContainer.id = `form-widget-${form.id}`
      previewContainerRef.current.appendChild(widgetContainer)

      // Create and execute the script
      const scriptContent = generateEmbedCode(true)
      const executeScript = new Function(scriptContent)
      executeScript()
    }

    // Cleanup function
    return () => {
      const styles = document.querySelector(`style[data-form-id="${form?.id}"]`)
      if (styles) {
        styles.remove()
      }
    }
  }, [form])

  if (!form) return null

  const generateEmbedCode = (isPreview = false) => {
    const hardcodedForm = {
      id: form.id,
      title: form.title,
      useNetlify: form.useNetlify,
      formAction: form.formAction,
      steps: form.steps.map(step => ({
        id: step.id,
        title: step.title,
        fields: step.fields.map(field => ({
          id: field.id,
          type: field.type,
          label: field.label,
          required: field.required
        }))
      })),
      styles: form.styles
    }

    // If it's for preview, return only the script content
    if (isPreview) {
      return `
  const formConfig = ${JSON.stringify(hardcodedForm, null, 2)};
  
  // Add styles
  const styleSheet = document.createElement('style');
  styleSheet.setAttribute('data-form-id', formConfig.id);
  styleSheet.textContent = \`
    .msf-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 9999;
    }

    .msf-modal-overlay.active {
      display: flex;
    }

    .msf-modal-content {
      background: \${formConfig.styles.colors.background};
      padding: 2rem;
      border-radius: \${formConfig.styles.spacing.borderRadius};
      width: 100%;
      max-width: \${formConfig.styles.spacing.modalWidth};
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }

    .msf-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-right: 1.5rem;
    }

    .msf-form-title {
      font-size: \${formConfig.styles.typography.titleSize};
      font-weight: 600;
      color: \${formConfig.styles.colors.text};
      margin: 0;
    }

    .msf-button {
      background: \${formConfig.styles.colors.primary};
      color: white;
      padding: \${formConfig.styles.spacing.padding};
      border-radius: \${formConfig.styles.spacing.borderRadius};
      border: none;
      cursor: pointer;
      font-size: \${formConfig.styles.typography.fontSize};
      transition: background-color 0.2s;
    }

    .msf-button:hover {
      background: \${formConfig.styles.colors.primary}dd;
    }

    .msf-button[type="submit"] {
      background: \${formConfig.styles.colors.success};
    }

    .msf-button[type="submit"]:hover {
      background: \${formConfig.styles.colors.success}dd;
    }

    .msf-input {
      width: 100%;
      padding: \${formConfig.styles.spacing.padding};
      border: \${formConfig.styles.borders.width} \${formConfig.styles.borders.style} \${formConfig.styles.colors.border};
      border-radius: \${formConfig.styles.spacing.borderRadius};
      margin-bottom: 0.5rem;
      font-size: \${formConfig.styles.typography.fontSize};
      color: \${formConfig.styles.colors.text};
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .msf-input:focus {
      outline: none;
      border-color: \${formConfig.styles.colors.primary};
      box-shadow: 0 0 0 3px \${formConfig.styles.colors.primary}22;
    }

    .msf-input.error {
      border-color: \${formConfig.styles.colors.error};
    }

    .msf-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: \${formConfig.styles.colors.text};
      font-size: \${formConfig.styles.typography.labelSize};
    }

    .msf-error {
      color: \${formConfig.styles.colors.error};
      font-size: \${formConfig.styles.typography.labelSize};
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
      display: none;
    }

    .msf-error.active {
      display: block;
    }

    .msf-progress {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 1.5rem;
    }

    .msf-progress-step {
      height: 0.25rem;
      flex: 1;
      background: \${formConfig.styles.colors.border};
      border-radius: \${formConfig.styles.spacing.borderRadius};
      transition: background-color 0.3s;
    }

    .msf-progress-step.active {
      background: \${formConfig.styles.colors.primary};
    }

    .msf-step-title {
      font-size: \${formConfig.styles.typography.titleSize};
      font-weight: 600;
      color: \${formConfig.styles.colors.text};
      margin-bottom: 1.5rem;
    }

    .msf-close {
      position: absolute;
      right: 1rem;
      top: 0.75rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: \${formConfig.styles.colors.text};
      cursor: pointer;
      padding: 0.25rem;
      line-height: 1;
      transition: color 0.2s;
      z-index: 1;
    }

    .msf-close:hover {
      color: \${formConfig.styles.colors.text}dd;
    }

    .msf-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 2rem;
      gap: 1rem;
    }

    .msf-field {
      margin-bottom: 1.5rem;
    }

    textarea.msf-input {
      min-height: 100px;
      resize: vertical;
    }

    [data-step] {
      display: none;
    }

    [data-step].active {
      display: block;
    }
  \`;
  document.head.appendChild(styleSheet);

  class MultiStepForm {
    constructor(config) {
      this.config = config;
      this.currentStep = 0;
      this.formData = {};
      this.init();
    }

    init() {
      const container = document.getElementById(\`form-widget-\${this.config.id}\`);
      
      // Create trigger button
      const triggerButton = document.createElement('button');
      triggerButton.className = 'msf-button';
      triggerButton.textContent = this.config.styles.buttons.openText || \`Open \${this.config.title}\`;
      triggerButton.onclick = () => this.openModal();
      container.appendChild(triggerButton);

      // Create modal
      const modal = this.createModal();
      container.appendChild(modal);
    }

    createModal() {
      const modal = document.createElement('div');
      modal.className = 'msf-modal-overlay';
      
      const content = document.createElement('div');
      content.className = 'msf-modal-content';

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'msf-close';
      closeBtn.textContent = '×';
      closeBtn.onclick = () => this.closeModal();
      content.appendChild(closeBtn);

      // Form title
      const header = document.createElement('div');
      header.className = 'msf-header';
      const title = document.createElement('h2');
      title.className = 'msf-form-title';
      title.textContent = this.config.title;
      header.appendChild(title);
      content.appendChild(header);

      // Progress bar
      const progress = document.createElement('div');
      progress.className = 'msf-progress';
      this.config.steps.forEach((_, index) => {
        const step = document.createElement('div');
        step.className = 'msf-progress-step';
        if (index === 0) step.classList.add('active');
        progress.appendChild(step);
      });
      content.appendChild(progress);

      // Form
      const form = document.createElement('form');
      form.onsubmit = (e) => this.handleSubmit(e);
      if (this.config.useNetlify) {
        form.setAttribute('data-netlify', 'true');
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'form-name';
        hiddenInput.value = this.config.title;
        form.appendChild(hiddenInput);
      }
      if (this.config.formAction) {
        form.action = this.config.formAction;
      }
      form.method = 'POST';

      // Create steps
      this.config.steps.forEach((step, stepIndex) => {
        const stepDiv = document.createElement('div');
        stepDiv.setAttribute('data-step', stepIndex);
        if (stepIndex === 0) stepDiv.classList.add('active');

        const stepTitle = document.createElement('h3');
        stepTitle.className = 'msf-step-title';
        stepTitle.textContent = step.title;
        stepDiv.appendChild(stepTitle);

        // Create fields
        step.fields.forEach(field => {
          const fieldDiv = document.createElement('div');
          fieldDiv.className = 'msf-field';

          const label = document.createElement('label');
          label.className = 'msf-label';
          label.textContent = field.label;
          if (field.required) {
            const required = document.createElement('span');
            required.style.color = this.config.styles.colors.error;
            required.textContent = ' *';
            label.appendChild(required);
          }
          fieldDiv.appendChild(label);

          const input = field.type === 'textarea' 
            ? document.createElement('textarea')
            : document.createElement('input');
          
          input.className = 'msf-input';
          if (field.type !== 'textarea') {
            input.type = field.type;
          }
          input.name = field.id;
          input.required = field.required;
          input.onchange = (e) => this.handleInputChange(field.id, e.target.value);
          fieldDiv.appendChild(input);

          const error = document.createElement('div');
          error.className = 'msf-error';
          error.id = \`error-\${field.id}\`;
          fieldDiv.appendChild(error);

          stepDiv.appendChild(fieldDiv);
        });

        form.appendChild(stepDiv);
      });

      // Navigation buttons
      const buttons = document.createElement('div');
      buttons.className = 'msf-buttons';
      
      const prevButton = document.createElement('button');
      prevButton.type = 'button';
      prevButton.className = 'msf-button';
      prevButton.textContent = this.config.styles.buttons.previousText || 'Previous';
      prevButton.style.display = 'none';
      prevButton.onclick = () => this.previousStep();
      buttons.appendChild(prevButton);

      const nextButton = document.createElement('button');
      nextButton.type = 'button';
      nextButton.className = 'msf-button';
      nextButton.textContent = this.config.styles.buttons.nextText || 'Next';
      nextButton.onclick = () => this.nextStep();
      buttons.appendChild(nextButton);

      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.className = 'msf-button';
      submitButton.textContent = this.config.styles.buttons.submitText || 'Submit';
      submitButton.style.display = 'none';
      buttons.appendChild(submitButton);

      form.appendChild(buttons);
      content.appendChild(form);
      modal.appendChild(content);

      return modal;
    }

    openModal() {
      const modal = document.querySelector('.msf-modal-overlay');
      modal.classList.add('active');
    }

    closeModal() {
      const modal = document.querySelector('.msf-modal-overlay');
      modal.classList.remove('active');
      this.resetForm();
    }

    resetForm() {
      this.currentStep = 0;
      this.formData = {};
      this.updateUI();
      document.querySelector('form').reset();
    }

    updateUI() {
      // Update progress bar
      const progressSteps = document.querySelectorAll('.msf-progress-step');
      progressSteps.forEach((step, index) => {
        step.classList.toggle('active', index <= this.currentStep);
      });

      // Update step visibility
      const steps = document.querySelectorAll('[data-step]');
      steps.forEach((step, index) => {
        step.classList.toggle('active', index === this.currentStep);
      });

      // Update buttons
      const prevButton = document.querySelector('.msf-buttons .msf-button:first-child');
      const nextButton = document.querySelector('.msf-buttons .msf-button:nth-child(2)');
      const submitButton = document.querySelector('.msf-buttons .msf-button:last-child');

      prevButton.style.display = this.currentStep === 0 ? 'none' : 'block';
      nextButton.style.display = this.currentStep === this.config.steps.length - 1 ? 'none' : 'block';
      submitButton.style.display = this.currentStep === this.config.steps.length - 1 ? 'block' : 'none';
    }

    validateStep() {
      const currentFields = this.config.steps[this.currentStep].fields;
      let isValid = true;
      const errors = {};

      currentFields.forEach(field => {
        const input = document.querySelector(\`[name="\${field.id}"]\`);
        const error = document.getElementById(\`error-\${field.id}\`);
        let errorMessage = '';

        if (field.required && !input.value) {
          errorMessage = 'This field is required';
          isValid = false;
        } else if (field.type === 'email' && input.value && !input.value.match(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)) {
          errorMessage = 'Please enter a valid email address';
          isValid = false;
        } else if (field.type === 'number' && input.value && isNaN(input.value)) {
          errorMessage = 'Please enter a valid number';
          isValid = false;
        }

        error.textContent = errorMessage;
        error.classList.toggle('active', !!errorMessage);
        input.classList.toggle('error', !!errorMessage);
        errors[field.id] = errorMessage;
      });

      return isValid;
    }

    handleInputChange(fieldId, value) {
      this.formData[fieldId] = value;
      const error = document.getElementById(\`error-\${fieldId}\`);
      const input = document.querySelector(\`[name="\${fieldId}"]\`);
      error.classList.remove('active');
      input.classList.remove('error');
    }

    nextStep() {
      if (this.validateStep()) {
        this.currentStep++;
        this.updateUI();
      }
    }

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.updateUI();
      }
    }

    async handleSubmit(e) {
      e.preventDefault();
      
      if (!this.validateStep()) return;

      try {
        if (this.config.useNetlify || this.config.formAction) {
          e.target.submit();
        } else {
          console.log('Form submitted:', this.formData);
          alert('Form submitted successfully!');
          this.closeModal();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
      }
    }
  }

  // Initialize the form
  new MultiStepForm(formConfig);`
    }

    // For embed code, wrap in IIFE and add HTML
    return `
<!-- Form Generator Widget -->
<div id="form-widget-${form.id}"></div>

<script>
(function() {
${generateEmbedCode(true)}
})();
</script>`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <AdSpace position="top" />

        <div className="my-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-300 hover:text-gray-400"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-white">{form.title}</h1>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShowEmbed(!showEmbed)}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
            >
              {showEmbed ? 'Hide' : 'Show'} Embed Code
            </button>
            
            {showEmbed && (
              <button
                onClick={copyToClipboard}
                className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            )}
          </div>

          {showEmbed && (
            <div className="mb-6">
              <div className="rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 shadow p-6 mb-6">
                <p className="text-sm text-gray-300 mb-2">
                  To embed this form on your website, copy and paste the following code:
                </p>
              </div>
              <SyntaxHighlighter 
                language="javascript" 
                style={atomDark}
                className="text-sm rounded-lg"
                customStyle={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  maxHeight: '400px',
                  overflow: 'auto'
                }}
              >
                {generateEmbedCode()}
              </SyntaxHighlighter>
            </div>
          )}

          <div className="rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Preview</h2>
            <div ref={previewContainerRef}></div>
          </div>
        </div>

        <div className="mt-6">
          <AdSpace position="bottom" />
        </div>
      </div>
    </div>
  )
}
