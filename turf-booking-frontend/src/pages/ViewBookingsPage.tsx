import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface Booking {
  id: number
  slotStart: string
  slotEnd: string
  status: string
}

const ViewBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/')
        return
      }

      try {
        const response = await axios.get('http://localhost:5046/api/Booking/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setBookings(response.data)
      } catch (err: any) {
        setError(err.response?.data || 'Failed to fetch bookings')
      }
    }

    fetchBookings()
  }, [navigate])

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Bookings</h2>
      {error && <p style={styles.error}>{error}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul style={styles.list}>
          {bookings.map((booking) => (
            <li key={booking.id} style={styles.item}>
              <strong>Start:</strong> {new Date(booking.slotStart).toLocaleString()}<br />
              <strong>End:</strong> {new Date(booking.slotEnd).toLocaleString()}<br />
              <strong>Status:</strong> {booking.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '1rem'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  item: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '5px',
    border: '1px solid #e5e7eb'
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    textAlign: 'center' as const
  }
}

export default ViewBookingsPage
