import { supabase } from '../supabaseClient'

const CATEGORY_COLORS = {
  Academic: '#3b82f6',
  Event:    '#8b5cf6',
  Urgent:   '#ef4444',
  General:  '#6b7280',
  Sports:   '#10b981',
  Jobs:     '#f59e0b',
}

export default function NoticeCard({ notice, session }) {
  const isOwner = session && session.user.id === notice.user_id

  const handleDelete = async () => {
    if (!window.confirm('Delete this notice?')) return

    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', notice.id)

    if (error) {
      alert('Error deleting notice: ' + error.message)
    }
    // Realtime will remove it from the list automatically
  }

  const formattedDate = new Date(notice.created_at).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const catColor = CATEGORY_COLORS[notice.category] || '#6b7280'

  return (
    <div className="notice-card">
      <div className="notice-header">
        <span
          className="category-badge"
          style={{ backgroundColor: catColor }}
        >
          {notice.category}
        </span>
        <span className="notice-time">{formattedDate}</span>
      </div>

      <h3 className="notice-title">{notice.title}</h3>
      <p className="notice-body">{notice.body}</p>

      {isOwner && (
        <div className="notice-actions">
          <button className="btn btn-danger" onClick={handleDelete}>
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  )
}