import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>🏏 Turf Booking</h2>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/book" style={styles.link}>Book Slot</Link>
        <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2563eb',
    color: '#fff'
  },
  logo: {
    margin: 0
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  logout: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer'
  }
}

export default Navbar
