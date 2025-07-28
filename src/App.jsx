import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SettingsPage from "./pages/SettingsPage";
import QuestionPage from './pages/QuestionPage';
import UserProfile from './pages/UserProfile';
import EditQuestion from './pages/EditQuestion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoriesPage from './pages/CategoriesPage';
import CategoryQuestionsPage from './pages/CategoryQuestionsPage.jsx';
import TrendingQuestions from './pages/TrendingQuestions';
import Bookmarks from './pages/Bookmarks';
import LiveQA from './pages/LiveQA.jsx';
import Leaderboard from './pages/Leaderboard';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from "./Components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {

   const { loading } = useAuth();
   if (loading) return <div>Loading...</div>; 

  return (
    <div>
      <Routes>
        {/* Main layout wrapper */}
        <Route path="/" element={<Layout />}>
          {/* Home page — accessible to everyone */}
          <Route index element={<Home />} />

          {/* Protected Routes */}
          <Route path="settings" element={
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />
          <Route path="question/:id" element={
            <ProtectedRoute><QuestionPage /></ProtectedRoute>
          } />
          <Route path="userProfile/:username" element={
            <ProtectedRoute><UserProfile /></ProtectedRoute>
          } />
          <Route path="edit-question/:id" element={
            <ProtectedRoute><EditQuestion /></ProtectedRoute>
          } />
          <Route path="categories" element={
            <ProtectedRoute><CategoriesPage /></ProtectedRoute>
          } />
          <Route path="categories/:tag" element={
            <ProtectedRoute><CategoryQuestionsPage /></ProtectedRoute>
          } />
          <Route path="trending" element={
            <ProtectedRoute><TrendingQuestions /></ProtectedRoute>
          } />
          <Route path="bookmarks" element={
            <ProtectedRoute><Bookmarks /></ProtectedRoute>
          } />
          <Route path="live" element={
            <ProtectedRoute><LiveQA /></ProtectedRoute>
          } />
          <Route path="leaderboard" element={
            <ProtectedRoute><Leaderboard /></ProtectedRoute>
          } />
          <Route path="notifications" element={
            <ProtectedRoute><NotificationsPage /></ProtectedRoute>
          } />
          <Route path="community" element={
            <ProtectedRoute><CommunityPage /></ProtectedRoute>
          } />
          <Route path="profile/:id" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          
        </Route>

        {/* Auth routes outside layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
