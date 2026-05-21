import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import NoticeCard from './NoticeCard'
import NoticeForm from './NoticeForm'

const CATEGORIES = ['All', 'Academic', 'Event', 'Urgent', 'General', 'Sports', 'Jobs']

export default function NoticeBoard({ session }) {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  // Fetch all notices on mount
  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notices:', error)
    } else {
      setNotices(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotices()

    // Set up Realtime subscription
    const channel = supabase
      .channel('notices-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notices' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotices((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setNotices((prev) => prev.filter((n) => n.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Filter notices by category
  const filteredNotices = activeCategory === 'All'
    ? notices
    : notices.filter((n) => n.category === activeCategory)

  return (
    <div className="noticeboard">
      {/* Post form — only visible when signed in */}
      {session && (
        <NoticeForm session={session} />
      )}

      {/* Category Filter */}
      <div className="category-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notice Feed */}
      <div className="notices-container">
        {loading ? (
          <p className="status-msg">Loading notices...</p>
        ) : filteredNotices.length === 0 ? (
          <p className="status-msg">No notices in this category yet.</p>
        ) : (
          filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              session={session}
            />
          ))
        )}
      </div>
    </div>
  )
}