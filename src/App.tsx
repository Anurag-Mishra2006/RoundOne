import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Registration from './pages/Registration'
import VerifyOtp from './pages/VerifyOtp'
import ResumeUpload from './pages/ResumeUpload'
import Onboarding from './pages/Onboarding'
import Interview from './pages/Interview'
import Feedback from './pages/Feedback'
import Navbar from "./components/Navbar"

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/register' element={<Registration />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/resume-upload' element={<ResumeUpload />} />
          <Route path='/onboarding' element={<Onboarding />} />
          <Route path='/interview' element={<Interview />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/' element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
