import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FindJobs from "./pages/FindJobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostJob from "./pages/PostJob";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import Profile from "./pages/Profile";
import ApplyJob from "./pages/ApplyJob";
import JobApplications from "./pages/JobApplications";
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/find-jobs" element={<PageTransition><FindJobs /></PageTransition>} />
        <Route path="/jobs/:id" element={<PageTransition><JobDetails /></PageTransition>} />
        <Route path="/apply/:jobId" element={<PageTransition><ApplyJob /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/post-job" element={<PageTransition><PostJob /></PageTransition>} />
        <Route path="/employer/dashboard" element={<PageTransition><EmployerDashboard /></PageTransition>} />
        <Route path="/job-applications/:jobId" element={<PageTransition><JobApplications /></PageTransition>} />
        <Route path="/candidate/dashboard" element={<PageTransition><CandidateDashboard /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow dark:bg-gray-900 transition-colors duration-300">
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}