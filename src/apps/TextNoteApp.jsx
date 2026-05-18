import { useState } from 'react'
import '../styles/TextNoteApp.css'

export default function TextNoteApp() {
  const [title, setTitle] = useState('Untitled Note')
  const [body, setBody] = useState('')

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0

  return (
    <div className="textnote-app">
      <input
        className="textnote-title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note title..."
      />
      <textarea
        className="textnote-body"
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Start typing your note here..."
        spellCheck
      />
      <div className="textnote-footer">
        <span>{body.length} {body.length === 1 ? 'char' : 'chars'}</span>
        <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
      </div>
    </div>
  )
}
