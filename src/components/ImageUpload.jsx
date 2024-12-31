import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ImageUpload({ onImageUploaded, currentImage }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || null)

  // Validate environment variables
  const validateEnvVariables = () => {
    const required = {
      apiUrl: import.meta.env.VITE_API_URL,
      bucketName: import.meta.env.VITE_AWS_BUCKET_NAME,
      region: import.meta.env.VITE_AWS_REGION
    }

    const missing = Object.entries(required)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }

    return required
  }

  const handleUpload = async (file) => {
    try {
      setUploading(true)

      // Validate environment variables first
      const env = validateEnvVariables()
      
      // 1. Get presigned URL
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const presignedUrlResponse = await fetch(`${env.apiUrl}/api/images/upload-url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileType: file.type,
          fileName: file.name
        })
      })

      if (!presignedUrlResponse.ok) {
        const errorData = await presignedUrlResponse.text()
        throw new Error(`Failed to get upload URL: ${errorData}`)
      }

      const { uploadURL, key } = await presignedUrlResponse.json()

      // 2. Upload to S3
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to S3')
      }

      // Construct the final URL using environment variables
      const fileUrl = `https://${env.bucketName}.s3.${env.region}.amazonaws.com/${key}`

      // 3. Create image record
      const imageResponse = await fetch(`${env.apiUrl}/api/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: file.name,
          description: 'Menu item image',
          url: fileUrl,
          key
        })
      })

      if (!imageResponse.ok) {
        throw new Error('Failed to create image record')
      }

      const imageData = await imageResponse.json()
      
      // Set preview and notify parent
      setPreview(imageData.url)
      onImageUploaded(imageData.url, imageData._id)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      handleUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please drop an image file')
        return
      }
      handleUpload(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const removeImage = () => {
    setPreview(null)
    onImageUploaded('')
  }

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            type="button"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-orange-500 transition-colors"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            {uploading ? (
              <Loader2 size={24} className="animate-spin mb-2" />
            ) : (
              <Upload size={24} className="mb-2" />
            )}
            <span className="text-sm text-gray-400">
              {uploading ? 'Uploading...' : 'Click or drag image to upload'}
            </span>
          </label>
        </div>
      )}
    </div>
  )
}
