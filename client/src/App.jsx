import React,{useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Authentication
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GoogleCallback from "./components/User/GoogleCallback";
import VerifyEmail from "./pages/VerifyEmailPage";
import OTPVerify from "./pages/OTPVerify";
// import Register from './pages/Register';
import UserFeedPage from "./pages/User/UserFeedPage";
import PageNotFound from "./pages/PageNotFound";
import "./index.css";

// User Pages
import Profile from "./pages/User/UserProfilePage";
import EditProfile from "./pages/User/EditProfilePage";

// Learning Plan Pages
import HomePage from "./pages/LearningPlanPage/HomePage";
import ProgressPage from "./pages/LearningPlanPage/ProgressPage";
import PlanPage from "./pages/LearningPlanPage/PlanPage";

// Forum Pages
import ForumDashBoard from "./pages/Forum/ForumDashBoard";
import ForumHomePage from "./pages/Forum/ForumHomePage";
import QuestionDetailPage from "./pages/Forum/QuestionDetailPage";
import AskQuestionPage from "./pages/Forum/AskQuestionPage";
import SavedQuestions from "./pages/Forum/SavedQuestions";
import TagPage from "./pages/Forum/TagPage";

// import Navbar from "./components/post/Navbar";

import Home from "./pages/post/Home";
import CreatePost from "./pages/post/CreatePost";
import Notifications from "./pages/post/Notifications";

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
          <Route path="/feed" element={<UserFeedPage />} />
          {/* <Route path="/register" element={<Register />} /> */}
          
          {/* Learning Plan Routes */}
          <Route path="/learninghome" element={<HomePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/plan/:level" element={<PlanPage />} />
          <Route path="/progress/:cuisineName" element={<ProgressPage />} />

          {/* Forum Routes */}
          <Route path="/forum/home" element={<ForumDashBoard />} />
          <Route path="/forum" element={<ForumHomePage />} />
          <Route path="/forum/question/:id" element={<QuestionDetailPage />} />
          <Route path="/forum/ask" element={<AskQuestionPage />} />
          <Route path="/forum/edit/:id" element={<AskQuestionPage />} />
          <Route path="/forum/saved" element={<SavedQuestions />} />
          <Route path="/forum/tags/:tag" element={<TagPage />} />

          <Route path="/post" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post-notifications" element={<Notifications  />} />

          <Route path="/post" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post-notifications" element={<Notifications  />} />

          <Route path="/post" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post-notifications" element={<Notifications  />} />

          {/* 404 Page */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
