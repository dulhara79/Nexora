import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GoogleCallback from "./components/User/GoogleCallback";
import VerifyEmail from "./pages/VerifyEmailPage";
import OTPVerify from "./pages/OTPVerify";
// import Register from './pages/Register';
import PageNotFound from "./pages/PageNotFound";
import "./index.css";

import Profile from "./pages/User/UserProfilePage";
import EditProfile from "./pages/User/EditProfilePage";

import HomePage from './pages/LearningPlanPage/HomePage';
import ProgressPage from './pages/LearningPlanPage/ProgressPage';
import PlanPage from "./pages/LearningPlanPage/PlanPage";


function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/google-callback" element={<GoogleCallback />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/otp-verify" element={<OTPVerify />} />

        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/edit/:userId" element={<EditProfile />} />
        {/* <Route path="/register" element={<Register />} /> */}

        <Route path="/home" element={<HomePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/plan/:level" element={<PlanPage />} />
        <Route path="/progress/:cuisineName" element={<ProgressPage />} />



        {/* 404 Page */}

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
