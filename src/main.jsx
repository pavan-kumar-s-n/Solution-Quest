import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { QuestionProvider } from './context/QuestionContext';
import { BookmarksProvider } from './context/BookmarksContext';
import { LiveQAProvider } from './context/LiveQAContext';
import { PointsProvider } from './context/PointsContext';
import { LeaderboardProvider } from './context/LeaderboardContext'; // ✅ correct

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QuestionProvider>
           <BookmarksProvider>
          <LiveQAProvider>
            <LeaderboardProvider>
              <PointsProvider>
                <App />
              </PointsProvider>
            </LeaderboardProvider>
          </LiveQAProvider>
          </BookmarksProvider>
        </QuestionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);