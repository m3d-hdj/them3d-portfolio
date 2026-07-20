import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Cursor from './components/Cursor'

export default function App() {
  return (
    <>
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
