import React, { useContext } from 'react';
import { LeaderboardContext } from '../context/LeaderboardContext';
import { FaTrophy, FaUser, FaMedal } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { leaderboard, loading } = useContext(LeaderboardContext);
  const { user } = useAuth();

  const getMedalColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#4f46e5';
  };

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-header"><FaTrophy /> Community Leaderboard</h1>
      {loading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <div className="leaderboard-list">
          {leaderboard.map((player) => (
            <div
              key={player.id}
              className={`leaderboard-card ${user?.uid === player.id ? 'current-user' : ''}`}
            >
              <div className="player-rank">
                {player.rank <= 3 ? (
                  <FaMedal color={getMedalColor(player.rank)} size={20} />
                ) : (
                  <span>{player.rank}</span>
                )}
              </div>
              <div className="player-info">
                <img
                  src={player.photoURL || 'https://placehold.co/40'}
                  alt={player.username}
                  onError={(e) => (e.target.src = 'https://placehold.co/40')}
                />
                <div>
                  <h3>{player.username}</h3>
                  <p>{player.title || 'Community Member'}</p>
                </div>
              </div>
              <div className="player-points">{player.points || 0} pts</div>
            </div>
          ))}
        </div>
      )}
 
      <style>{`
        .leaderboard-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          margin-left: 250px;
        }
        
        .leaderboard-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #4f46e5;
          margin-bottom: 2rem;
        }
        
        .loading-indicator {
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }
        
        .leaderboard-description {
          margin-bottom: 1.5rem;
          color: #64748b;
        }
        
        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .leaderboard-card {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }
        
        .leaderboard-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .leaderboard-card.current-user {
          border-left: 4px solid #4f46e5;
          background: #f5f3ff;
        }
        
        .player-rank {
          width: 40px;
          text-align: center;
          font-weight: bold;
          color: #4f46e5;
        }
        
        .player-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .player-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0e7ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4f46e5;
          overflow: hidden;
        }
        
        .player-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .player-details h3 {
          margin: 0;
          font-size: 1rem;
        }
        
        .player-details p {
          margin: 0;
          font-size: 0.8rem;
          color: #64748b;
        }
        
        .player-points {
          font-weight: bold;
          color: #4f46e5;
        }
        
        @media (max-width: 768px) {
          .leaderboard-container {
            margin-left: 1rem;
            padding: 1rem;
          }
          
          .leaderboard-card {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Leaderboard;