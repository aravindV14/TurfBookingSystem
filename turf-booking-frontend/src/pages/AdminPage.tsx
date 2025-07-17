import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Booking {
  id: number;
  slotStart: string;
  slotEnd: string;
  userId: number;
  isBlockedByAdmin: boolean;
}

const AdminPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slotStart, setSlotStart] = useState('');
  const [slotEnd, setSlotEnd] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5046/api/Auth/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    }
  };

  const preserveOfflineBooking = async () => {
    if (!slotStart || !slotEnd) return alert('Please fill both start and end time');
    try {
      await axios.post('http://localhost:5046/api/Auth/Booking/block', {}, {
        params: { slotStart, slotEnd },
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Slot preserved successfully.');
      fetchBookings();
      setSlotStart('');
      setSlotEnd('');
    } catch (err) {
      setMessage('Failed to preserve slot.');
      console.error(err);
    }
  };

  const cancelBooking = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5046/api/Auth/delete-booking/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
      setMessage('Booking cancelled.');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Booking Manager</h2>

      <label style={styles.label}>Select Date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Preserve Slot Start Time:</label>
      <input
        type="datetime-local"
        value={slotStart}
        onChange={(e) => setSlotStart(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Preserve Slot End Time:</label>
      <input
        type="datetime-local"
        value={slotEnd}
        onChange={(e) => setSlotEnd(e.target.value)}
        style={styles.input}
      />

      <button onClick={preserveOfflineBooking} style={styles.button}>Preserve Offline Slot</button>

      {message && <p style={styles.message}>{message}</p>}

      <h3 style={styles.sectionTitle}>All Bookings</h3>
      <ul style={styles.list}>
        {bookings.map((b) => (
          <li key={b.id} style={styles.listItem}>
            <div>
              🧍 User ID: {b.userId}<br />
              ⏰ {new Date(b.slotStart).toLocaleString()} → {new Date(b.slotEnd).toLocaleTimeString()}
            </div>
            <button onClick={() => cancelBooking(b.id)} style={{ ...styles.button, backgroundColor: '#ef4444' }}>
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif'
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '1rem'
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
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontSize: '1rem',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  message: {
    marginTop: '1rem',
    textAlign: 'center' as const,
    color: '#10b981'
  },
  sectionTitle: {
    marginTop: '2rem',
    marginBottom: '1rem',
    fontSize: '1.2rem'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    backgroundColor: '#f3f4f6',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

export default AdminPage;
