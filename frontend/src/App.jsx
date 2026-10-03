import { useState } from 'react'

export default function App() {
  const [name, setName] = useState('World')
  const [greeting, setGreeting] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  async function fetchGreeting() {
    setStatus('loading')
    setError(null)
    try {
      const res = await fetch(`/api/hello?name=${encodeURIComponent(name)}`)
      if (!res.ok) throw new Error(`Backend responded with ${res.status}`)
      setGreeting(await res.json())
      setStatus('done')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <main className="card">
      <h1>Hello World</h1>
      <p className="subtitle">React frontend &middot; Spring Boot backend &middot; Kubernetes</p>

      <div className="controls">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name"
          aria-label="Name"
        />
        <button onClick={fetchGreeting} disabled={status === 'loading'}>
          {status === 'loading' ? 'Loading...' : 'Say hello'}
        </button>
      </div>

      {greeting && (
        <div className="result">
          <p className="message">{greeting.message}</p>
          <dl>
            <div><dt>Service</dt><dd>{greeting.service}</dd></div>
            <div><dt>Served by pod</dt><dd>{greeting.pod}</dd></div>
            <div><dt>Timestamp</dt><dd>{greeting.timestamp}</dd></div>
          </dl>
        </div>
      )}

      {error && <p className="error">Error: {error}</p>}
    </main>
  )
}
