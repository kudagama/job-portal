import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/find-jobs" element={<FindJobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}