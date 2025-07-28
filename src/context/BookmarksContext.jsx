import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from './AuthContext'; // assuming you have an AuthContext

export const BookmarksContext = createContext();

export const BookmarksProvider = ({ children }) => {
  const [bookmarkIds, setBookmarkIds] = useState([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const { currentUser } = useAuth();

  // 🔄 Load bookmarks from Firestore when user logs in
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setBookmarkIds(data.bookmarks || []);
        }
      }
    };

    fetchBookmarks();
  }, [currentUser]);

  // 📥 Fetch full question data
  useEffect(() => {
    const fetchBookmarkedQuestions = async () => {
      const fetched = await Promise.all(
        bookmarkIds.map(async (id) => {
          const snap = await getDoc(doc(db, 'questions', id));
          return snap.exists() ? { id: snap.id, ...snap.data() } : null;
        })
      );
      setBookmarkedQuestions(fetched.filter(Boolean));
    };

    if (bookmarkIds.length > 0) {
      fetchBookmarkedQuestions();
    } else {
      setBookmarkedQuestions([]);
    }
  }, [bookmarkIds]);

  // ⭐ Add bookmark
  const addBookmark = async (questionId) => {
    if (!currentUser) return;

    if (!bookmarkIds.includes(questionId)) {
      setBookmarkIds(prev => [...prev, questionId]);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        bookmarks: arrayUnion(questionId)
      });
    }
  };

  // ❌ Remove bookmark
  const removeBookmark = async (questionId) => {
    if (!currentUser) return;

    setBookmarkIds(prev => prev.filter(id => id !== questionId));
    await updateDoc(doc(db, 'users', currentUser.uid), {
      bookmarks: arrayRemove(questionId)
    });
  };

  const isBookmarked = (questionId) => bookmarkIds.includes(questionId);

  return (
    <BookmarksContext.Provider value={{
      bookmarkIds,
      bookmarkedQuestions,
      addBookmark,
      removeBookmark,
      isBookmarked
    }}>
      {children}
    </BookmarksContext.Provider>
  );
};
