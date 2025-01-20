import { useState } from 'react'
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Heading1, Heading2, Code, Image as ImageIcon, 
  Link as LinkIcon, Minus, X 
} from 'lucide-react'
import ImageUpload from './ImageUpload'

export default function EditorToolbar({ editor }) {
  const [showImageUploader, setShowImageUploader] = useState(false)

  if (!editor) {
    return null
  }

  const handleImageUpload = (imageData) => {
    const imageUrl = typeof imageData === 'object' ? imageData.url : imageData
    editor.chain().focus().setImage({ src: imageUrl }).run()
    setShowImageUploader(false)
  }

  const ToolbarButton = ({ onClick, active, title, children }) => (
    <button
      onClick={onClick}
      className={`p-2 ${
        active ? 'text-orange-500' : 'text-gray-700'
      } hover:text-orange-500 hover:bg-gray-100 rounded transition-colors`}
      title={title}
    >
      {children}
    </button>
  )

  const Divider = () => (
    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
  )

  return (
    <div className="relative border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
      >
        <Bold size={20} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
      >
        <Italic size={20} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={20} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={20} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={20} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Numbered List"
      >
        <ListOrdered size={20} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Quote"
      >
        <Quote size={20} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <Code size={20} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus size={20} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => setShowImageUploader(true)}
        title="Insert Image"
      >
        <ImageIcon size={20} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          const url = prompt('Enter URL:')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        active={editor.isActive('link')}
        title="Insert Link"
      >
        <LinkIcon size={20} />
      </ToolbarButton>

      {showImageUploader && (
        <div className="absolute z-50 top-full left-0 mt-2 bg-white rounded-lg shadow-xl p-4 w-[300px] border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Insert Image</h3>
            <button 
              onClick={() => setShowImageUploader(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <ImageUpload
            onImageUploaded={handleImageUpload}
            currentImage=""
          />
        </div>
      )}
    </div>
  )
}
