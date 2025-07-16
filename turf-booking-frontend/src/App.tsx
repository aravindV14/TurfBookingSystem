import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BookingPage from './pages/BookingPage'
import ViewBookingsPage from './pages/ViewBookingsPage'
import AdminPage from './pages/AdminPage'
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/book" element={<BookingPage />} />
      <Route path="/my-bookings" element={<ViewBookingsPage />} />
      


<Route path="/admin" element={<AdminPage />} />

    </Routes>
  )
}

export default App
