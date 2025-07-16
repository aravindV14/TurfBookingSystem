import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BookingPage: React.FC = () => {
  const [slotStart, setSlotStart] = useState('')
  const [slotEnd, setSlotEnd] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleBooking = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    if (!slotStart || !slotEnd) {
      setMessage('Please select both start and end times.')
      return
    }

    try {
      await axios.post(
        'http://localhost:5046/api/Booking',
        {},
        {
          params: { slotStart, slotEnd },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setMessage('Slot booked successfully!')
    } catch (error: any) {
      setMessage(error.response?.data || 'Error booking slot.')
    }
  }

  return (
    <div style={styles.container}>
      <h2>Book a Turf Slot</h2>
      <label style={styles.label}>Start Time:</label>
      <input
        type="datetime-local"
        value={slotStart}
        onChange={(e) => setSlotStart(e.target.value)}
        style={styles.input}
      />
      <label style={styles.label}>End Time:</label>
      <input
        type="datetime-local"
        value={slotEnd}
        onChange={(e) => setSlotEnd(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleBooking} style={styles.button}>Book Slot</button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: 'bold' as const,
    display: 'block'
  },
  input: {
    width: '100%',
    marginBottom: '1rem',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#10b981',
    color: '#fff',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer'
  },
  message: {
    marginTop: '1rem',
    textAlign: 'center' as const,
    color: '#444'
  }
}

export default BookingPage
