import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import NoticeBoard from './components/NoticeBoard'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>📋 Campus Notice Board</h1>
          <span className="subtitle">Bahria University — BSE-6A</span>
        </div>
        <div className="header-right">
          {session ? (
            <div className="user-info">
              <span className="user-email">✅ {session.user.email}</span>
              <button
                className="btn btn-secondary"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <span className="not-signed-in">🔒 Not signed in</span>
          )}
        </div>
      </header>

      <main className="app-main">
        <NoticeBoard session={session} />
      </main>

      {!session && (
        <aside className="auth-panel">
          <Auth />
        </aside>
      )}
    </div>
  )
}

export default App