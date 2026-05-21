import { useState } from 'react'
import { supabase } from '../supabaseClient'

const CATEGORIES = ['Academic', 'Event', 'Urgent', 'General', 'Sports', 'Jobs']

export default function NoticeForm({ session }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('General')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.from('notices').insert({
      title,
      body,
      category,
      user_id: session.user.id,
    })

    if (error) {
      setError(error.message)
    } else {
      // Clear form on success
      setTitle('')
      setBody('')
      setCategory('General')
    }

    setLoading(false)
  }

  return (
    <div className="notice-form-container">
      <h2>📝 Post a Notice</h2>
      <form onSubmit={handleSubmit} className="notice-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notice title"
              required
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your notice here..."
            required
            rows={3}
          />
        </div>

        {error && <p className="error-msg">❌ {error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Posting...' : '📤 Post Notice'}
        </button>
      </form>
    </div>
  )
}