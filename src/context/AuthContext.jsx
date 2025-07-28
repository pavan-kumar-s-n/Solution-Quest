// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setCurrentUser(userDoc.exists() ? { uid: firebaseUser.uid, ...userDoc.data() } : null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setLoading(false); // Done loading
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          setCurrentUser(userDoc.exists() ? { uid: firebaseUser.uid, ...userDoc.data() } : null);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updatePasswordForCurrentUser = async (newPassword) => {
    const authUser = auth.currentUser;
    if (!authUser) throw new Error("User not authenticated.");

    const currentPassword = prompt("Enter your current password to confirm:");
    if (!currentPassword) throw new Error("Password confirmation cancelled.");

    const credential = EmailAuthProvider.credential(authUser.email, currentPassword);
    await reauthenticateWithCredential(authUser, credential);
    await updatePassword(authUser, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser, 
        logout,
        loading,
        updatePasswordForCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
