import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5046/api/Auth/login', {
        identifier,
        password
      })

      const token = response.data
      localStorage.setItem('token', token)
      setError('')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Invalid username/phone or password')
    }
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Turf Booking Login</h2>
        <input
          type="text"
          placeholder="Username or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  )
}

const styles = {
  wrapper: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f2f2f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '320px'
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    fontSize: '1.5rem'
  },
  input: {
    marginBottom: '1rem',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    textAlign: 'center' as const,
    marginTop: '1rem'
  }
}

export default LoginPage
