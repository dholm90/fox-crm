import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { marked } from 'marked'
import EditorToolbar from './EditorToolbar'

// Convert HTML to Markdown
const htmlToMarkdown = (html) => {
  // Remove empty paragraphs
  html = html.replace(/<p><\/p>/g, '')

  // Handle headings
  html = html.replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
  html = html.replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
  html = html.replace(/<h3>(.*?)<\/h3>/g, '### $1\n')

  // Handle lists
  html = html.replace(/<ul>(.*?)<\/ul>/gs, (match, p1) => {
    return p1.replace(/<li>(.*?)<\/li>/g, '- $1\n')
  })
  html = html.replace(/<ol>(.*?)<\/ol>/gs, (match, p1) => {
    let counter = 1
    return p1.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1\n`)
  })

  // Handle bold and italic
  html = html.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
  html = html.replace(/<em>(.*?)<\/em>/g, '*$1*')

  // Handle links
  html = html.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')

  // Handle images - preserve the full img tag attributes
  html = html.replace(/<img.*?src="(.*?)".*?>/g, '![]($1)')

  // Handle blockquotes
  html = html.replace(/<blockquote>(.*?)<\/blockquote>/gs, '> $1\n')

  // Handle code blocks
  html = html.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```\n')

  // Handle inline code
  html = html.replace(/<code>(.*?)<\/code>/g, '`$1`')

  // Handle paragraphs
  html = html.replace(/<p>(.*?)<\/p>/g, '$1\n')

  // Handle horizontal rules
  html = html.replace(/<hr>/g, '---\n')

  // Clean up extra newlines
  html = html.replace(/\n{3,}/g, '\n\n')

  // Remove any remaining HTML tags
  html = html.replace(/<[^>]*>/g, '')

  return html.trim()
}

const Editor = ({ initialContent, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-orange-500 hover:text-orange-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
    ],
    content: marked.parse(initialContent || ''),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const markdown = htmlToMarkdown(html)
      onChange(markdown)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] px-4 py-2',
      },
    },
  })

  return (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor
