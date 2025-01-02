import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ImageUpload({ onImageUploaded, currentImage }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || null)
  const [imageDetails, setImageDetails] = useState({
    title: '',
    description: ''
  })

  const handleUpload = async (file) => {
    try {
      setUploading(true)

      // Validate title
      if (!imageDetails.title.trim()) {
        throw new Error('Title is required')
      }

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      // 1. Get presigned URL
      console.log('Getting presigned URL...')
      const presignedUrlResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/images/upload-url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileType: file.type })
      })

      if (!presignedUrlResponse.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadURL, key } = await presignedUrlResponse.json()
      console.log('Got presigned URL:', { uploadURL, key })

      // 2. Upload to S3
      console.log('Uploading to S3...')
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

      // 3. Create image record
      console.log('Creating image record...')
      const fileUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`
      
      const imageResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: imageDetails.title,
          description: imageDetails.description,
          url: fileUrl,
          key
        })
      })

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json()
        throw new Error(errorData.message || 'Failed to create image record')
      }

      const imageData = await imageResponse.json()
      console.log('Image record created:', imageData)

      // 4. Add image to gallery
      console.log('Adding image to gallery...')
      const galleryResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery/images/${imageData._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!galleryResponse.ok) {
        const errorData = await galleryResponse.json()
        throw new Error(errorData.message || 'Failed to add image to gallery')
      }

      const galleryData = await galleryResponse.json()
      console.log('Image added to gallery:', galleryData)
      
      // Set preview and notify parent
      setPreview(imageData.url)
      onImageUploaded(imageData)
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
