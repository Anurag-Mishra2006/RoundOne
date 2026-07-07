import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Registration from './pages/Registration'
import VerifyOtp from './pages/VerifyOtp'
import ResumeUpload from './pages/ResumeUpload'
import Onboarding from './pages/Onboarding'
import Interview from './pages/Interview'
import Feedback from './pages/Feedback'
import AtsChecker from './pages/AtsChecker';
import { getMe } from './services/api'
import useUserStore from './store/authStore'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Review from './pages/Review'
import PublicReport from './pages/PublicReport'
import LearningHub from './pages/LearningHub'
import LearningSheet from './pages/LearningSheet'


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
        <Routes>
          <Route path='/register' element={<Registration />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/dashboard' element={
            <Dashboard />
          } />
          {/* <Route path='/login' element={<Login />} /> */}
          <Route path='/login' element={isAuthenticate ? <Navigate to="/dashboard" /> : <Login />} />

          <Route path='/resume-upload' element={<ResumeUpload />} />
          <Route path='/onboarding' element={<Onboarding />} />
          <Route path='/interview' element={<Interview />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/ats-check' element={<AtsChecker />} />
          <Route path='/' element={<Home />} />
          <Route path='/review/:id' element={<Review />} />
          <Route path='/report/:id' element={<PublicReport />} />
          <Route path='/learning' element={<LearningHub />} />
          <Route path='/learning/:categoryId' element={ <LearningSheet /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
