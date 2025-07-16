import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [slots, setSlots] = useState([])

  const token = localStorage.getItem('token')

  const fetchSlots = async () => {
    try {
      const response = await axios.get(`http://localhost:5046/api/Admin/slots?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSlots(response.data)
    } catch (err) {
      console.error('Failed to fetch slots', err)
    }
  }

  const toggleBlockSlot = async (slotId: number, currentlyBlocked: boolean) => {
    try {
      const endpoint = currentlyBlocked
        ? `http://localhost:5046/api/Admin/unblock/${slotId}`
        : `http://localhost:5046/api/Admin/block/${slotId}`

      await axios.post(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchSlots()
    } catch (err) {
      console.error('Failed to toggle slot block', err)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [selectedDate])

  return (
    <div style={styles.container}>
      <h2>Admin Panel: Manage Slots</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={styles.dateInput}
      />
      <ul style={styles.slotList}>
        {slots.map((slot: any) => (
          <li key={slot.id} style={styles.slotItem}>
            ⏰ {slot.hour}:00 — {slot.isBlocked ? 'Blocked' : slot.isBooked ? 'Booked' : 'Available'}
            <button
              style={styles.button}
              onClick={() => toggleBlockSlot(slot.id, slot.isBlocked)}
              disabled={slot.isBooked}
            >
              {slot.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto'
  },
  dateInput: {
    padding: '0.5rem',
    fontSize: '1rem',
    marginBottom: '1rem'
  },
  slotList: {
    listStyleType: 'none' as const,
    padding: 0
  },
  slotItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: '6px'
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#f97316',
    color: '#fff',
    cursor: 'pointer'
  }
}

export default AdminPage
