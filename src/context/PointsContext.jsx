// src/context/PointsContext.jsx
import { createContext, useContext } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const PointsContext = createContext();

export const PointsProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const awardPoints = async (userId, points) => {
    try {
      if (!userId) throw new Error("User ID is required");
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        points: increment(points),
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  const getCurrentUserPoints = async (userId) => {
    // You might want to implement this if needed
  };

  return (
    <PointsContext.Provider value={{ awardPoints, getCurrentUserPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => useContext(PointsContext);