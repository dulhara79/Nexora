import React from "react";
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
import RecipePage from "./pages/LearningPlanPage/RecipePage";
import CuisinePage from "./pages/LearningPlanPage/CuisinePage";
import UserPlanPage from "./pages/LearningPlanPage/UserPlanPage";
import ProgressPage from "./pages/LearningPlanPage/ProgressPage";

// Forum Pages
import ForumHomeLandingPage from "./pages/Forum/ForumHomeLandingPage";
import ForumDashBoard from "./pages/Forum/ForumDashBoard";
import ForumHomePage from "./pages/Forum/ForumHomePage";
import QuestionDetailPage from "./pages/Forum/QuestionDetailPage";
import AskQuestionPage from "./pages/Forum/AskQuestionPage";
import SavedQuestions from "./pages/Forum/SavedQuestions";
import TagPage from "./pages/Forum/TagPage";
import ForumNotification from "./pages/Forum/ForumNotificationPage";
import ForumCommunityPage from "./pages/Forum/ForumCommunityPage";
import UserQuestionsPage from "./pages/Forum/UserQuestionsPage";
import QuizList from "./components/Forum/Quiz/QuizList";
import QuizCreate from "./components/Forum/Quiz/QuizCreate";
import QuizDetail from "./components/Forum/Quiz/QuizDetail";
import QuizStats from "./components/Forum/Quiz/QuizStats";
import QuizTake from "./components/Forum/Quiz/QuizTake";

// Post Pages
import Home from "./pages/post/Home";
import CreatePost from "./pages/post/CreatePost";
import Notifications from "./pages/post/Notifications";
import SavedPosts from "./pages/post/SavedPosts";

// Challanges Pages
import ChallengeDetail from "./pages/Challenge/ChallengeDetail";
import ChallengeList from "./pages/Challenge/ChallengeList";
import CreateChallenge from "./pages/Challenge/CreateChallenge";
import StartChallenge from "./pages/Challenge/StartChallenge";
import CollaborationHub from "./pages/Challenge/CollabHub";
import Leaderboard from "./pages/Challenge/Leaderboard";
import RemixGallery from "./pages/Challenge/ChallenfeRemix";
import RecipeGenerator from "./pages/Challenge/RecipeGenerator";

// Test Page
import TestPage from "./pages/TestPage";
import EditQuestionPage from "./pages/Forum/EditQuestionPage";
import SearchResultsPage from "./pages/User/SearchResultsPage";

function App() {
  return (
    <Router>
      <AuthProvider>
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
          <Route path="/search" element={<SearchResultsPage />} />

          {/* Learning Plan Routes */}
          <Route path="/learninghome" element={<HomePage />} />
          <Route path="/recipe" element={<RecipePage />} />
          <Route path="/recipe/:cuisineName" element={<RecipePage />} />
          <Route path="/cuisine/:level" element={<CuisinePage />} />
          <Route path="/cuisine" element={<CuisinePage />} />
          <Route path="/userplan" element={<UserPlanPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/progress/:userId" element={<ProgressPage />} />

          {/* Forum Routes */}
          <Route path="/forum" element={<ForumHomeLandingPage />} />
          <Route path="/forum/home" element={<ForumDashBoard />} />
          <Route path="/forum/questions" element={<ForumHomePage />} />
          <Route path="/forum/question/:id" element={<QuestionDetailPage />} />
          <Route path="/forum/ask" element={<AskQuestionPage />} />
          <Route path="/forum/edit/:id" element={<EditQuestionPage />} />
          <Route path="/forum/saved" element={<SavedQuestions />} />
          <Route path="/forum/tags/:tag" element={<TagPage />} />
          <Route path="/forum/community" element={<ForumCommunityPage />} />
          <Route path="/forum/notifications" element={<ForumNotification />} />
          <Route
            path="/forum/community/:communityId"
            element={<ForumCommunityPage />}
          />
          <Route path="/forum/my-questions" element={<UserQuestionsPage />} />
          {/* <Route path="/forum/quizzes" element={<QuizList />} />
          <Route path="/forum/quizzes/create" element={<QuizCreate />} />
          <Route path="/forum/quizzes/:id" element={<QuizDetail />} />
          <Route path="/forum/quizzes/:id/stats" element={<QuizStats />} />
          <Route path="/forum/quizzes/:id/take" element={<QuizTake />} /> */}

          <Route path="/forum/quizzes" element={<QuizList />} />
          <Route path="/forum/quizzes/create" element={<QuizCreate />} />
          <Route path="/forum/quizzes/:id" element={<QuizDetail />} />
          <Route path="/forum/quizzes/:id/stats" element={<QuizStats />} />

          {/* Post Routes */}
          <Route path="/post" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post-notifications" element={<Notifications />} />
          <Route path="/saved-posts" element={<SavedPosts />} />

          {/* Challenges Routes */}
          <Route path="/challenges" element={<ChallengeList />} />
          <Route path="/challenge/:challengeId" element={<ChallengeDetail />} />
          <Route path="/create-challenge" element={<CreateChallenge />} />
          <Route
            path="/edit-challenge/:challengeId"
            element={<CreateChallenge />}
          />

          {/* Test Page */}
          <Route path="/test" element={<TestPage />} />

          {/* Challenges Routes */}
          <Route path="/challenges" element={<ChallengeList />} />
          <Route path="/challenge/:challengeId" element={<ChallengeDetail />} />
          <Route path="/create-challenge" element={<CreateChallenge />} />
          <Route path="/edit-challenge/:challengeId" element={<CreateChallenge />} />
          <Route path="/start-challenge/:challengeId" element={<StartChallenge />} />
          <Route path="/collaboration-hub" element={<CollaborationHub />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/remix-gallery" element={<RemixGallery />} />
          <Route path="/recipe-generator" element={<RecipeGenerator />} />


          {/* 404 Page */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
