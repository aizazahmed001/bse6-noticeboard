import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Account created! You are now signed in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <h2>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
            minLength={6}
          />
        </div>

        {error && <p className="error-msg">❌ {error}</p>}
        {message && <p className="success-msg">✅ {message}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="auth-toggle">
        {mode === 'signin' ? (
          <>No account? <button className="link-btn" onClick={() => setMode('signup')}>Sign Up</button></>
        ) : (
          <>Have an account? <button className="link-btn" onClick={() => setMode('signin')}>Sign In</button></>
        )}
      </p>
    </div>
  )
}