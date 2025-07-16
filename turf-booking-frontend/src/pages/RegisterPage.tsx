import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    userName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError('')
    setSuccess('')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const { userName, phone, password, confirmPassword } = formData

    if (!userName || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await axios.post('http://localhost:5046/api/Auth/register', {
  username: userName,
  phoneNumber: phone,
  password,
  confirmPassword
})


      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      console.error(err)
      setError('Registration failed. Username or phone might already exist.')
    }
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>Register</h2>
        <input
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
      </form>
    </div>
  )
}

const styles = {
  wrapper: {
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
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
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '0.75rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginTop: '1rem',
    textAlign: 'center' as const
  },
  success: {
    color: 'green',
    marginTop: '1rem',
    textAlign: 'center' as const
  }
}

export default RegisterPage
