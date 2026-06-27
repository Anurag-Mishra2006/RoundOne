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
import AtsChecker from './pages/AtsChecker';
import { getMe } from './services/api'
import useUserStore from './store/authStore'
import { useEffect, useState } from 'react'

function App() {
  const { isAuthenticate, setUser, clearUser } = useUserStore();
  const [isAuthCheck, setIsAuthCheck] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await getMe();
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        clearUser();
      } finally {
        setIsAuthCheck(false);
      }
    }
    checkAuthStatus()
  }, [])
  if (isAuthCheck) {
    return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text)]">Loading...</div>;
  }
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/register' element={<Registration />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          {/* <Route path='/login' element={<Login />} /> */}
          <Route path='/login' element={isAuthenticate ? <Navigate to="/resume-upload" /> : <Login />} />

          <Route path='/resume-upload' element={<ResumeUpload />} />
          <Route path='/onboarding' element={<Onboarding />} />
          <Route path='/interview' element={<Interview />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/ats-check' element={<AtsChecker />} />
          <Route path='/' element={isAuthenticate? <Navigate to="/resume-upload" />: <Login/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
