import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  name: string
  role: string
  exp: number
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      setUserName(decoded.name)
      setRole(decoded.role)
    } catch {
      navigate('/')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <h2>Welcome, {userName}!</h2>
      <p>Role: {role}</p>
      <div style={styles.buttons}>
        <button onClick={() => navigate('/book')} style={styles.button}>Book a Slot</button>
        <button onClick={() => navigate('/my-bookings')} style={styles.button}>My Bookings</button>
        {role === 'Admin' && (
          <button onClick={() => navigate('/admin')} style={styles.adminButton}>Admin Panel</button>
        )}
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center' as const
  },
  buttons: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    alignItems: 'center'
  },
  button: {
    width: '200px',
    padding: '0.75rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  adminButton: {
    backgroundColor: '#f97316',
    color: '#fff',
    width: '200px',
    padding: '0.75rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px'
  },
  logout: {
    backgroundColor: '#ef4444',
    color: '#fff',
    width: '200px',
    padding: '0.75rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px'
  }
}

export default DashboardPage
