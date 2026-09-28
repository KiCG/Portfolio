import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { WorkDetailPage } from './pages/WorkDetailPage'
import { Header } from './components/Header'
import './App.css'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/works/:slug" element={<WorkDetailPage />} />
      </Routes>
    </>
  )
}
