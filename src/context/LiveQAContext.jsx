import { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export const LiveQAContext = createContext();

export const LiveQAProvider = ({ children }) => {
  const [liveSessions, setLiveSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [activeSessionData, setActiveSessionData] = useState(null);
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();

  // Watch all live sessions
  useEffect(() => {
    const sessionsRef = collection(db, 'liveSessions');
    const q = query(
  sessionsRef,
  orderBy('createdAt', 'desc')
);

    const unsubscribe = onSnapshot(q, (snapshot) => {
  const sessions = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(session => session.isActive !== false && session.participants?.length > 0); // Filter here
  setLiveSessions(sessions);
});

    return () => unsubscribe();
  }, []);

  // Watch active session and its messages
  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      setActiveSessionData(null);
      return;
    }

    const sessionRef = doc(db, 'liveSessions', activeSession);
    const messagesRef = collection(db, 'liveSessions', activeSession, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp'));

    const unsubSession = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        setActiveSessionData({ id: docSnap.id, ...docSnap.data() });
      }
    });

    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => {
      unsubSession();
      unsubMessages();
    };
  }, [activeSession]);

  const createSession = async (title) => {
    if (!currentUser) throw new Error("User not authenticated");

    const newSessionRef = doc(collection(db, 'liveSessions'));
    await setDoc(newSessionRef, {
      title,
      hostId: currentUser.uid,
      hostName: currentUser.username || currentUser.email.split('@')[0],
      participants: [currentUser.uid],
      createdAt: serverTimestamp(),
      isActive: true
    });
    return newSessionRef.id;
  };

  const joinSession = async (sessionId) => {
    if (!currentUser) throw new Error("User not authenticated");

    const sessionRef = doc(db, 'liveSessions', sessionId);
    await updateDoc(sessionRef, {
      participants: arrayUnion(currentUser.uid)
    });
    setActiveSession(sessionId);
  };


const leaveSession = async (session) => {
  if (!currentUser) throw new Error("User not authenticated");

  const sessionRef = doc(db, 'liveSessions', session.id);

  // Remove current user from participants
  await updateDoc(sessionRef, {
    participants: arrayRemove(currentUser.uid)
  });

  // If the host leaves, mark session as inactive
  if (session.hostId === currentUser.uid) {
    await updateDoc(sessionRef, { isActive: false });
  }

  // Get updated session data
  const updatedSessionSnap = await getDoc(sessionRef);
  const updatedData = updatedSessionSnap.data();

  // If no participants are left, delete the session and its messages
  if (!updatedData.participants || updatedData.participants.length === 0) {
    const messagesRef = collection(db, 'liveSessions', session.id, 'messages');
    const messagesSnapshot = await getDocs(messagesRef);

    const batch = writeBatch(db);
    messagesSnapshot.forEach(msg => {
      batch.delete(msg.ref);
    });

    await batch.commit();           // Delete all messages first
    await deleteDoc(sessionRef);    // Then delete the session itself
  }

  setActiveSession(null);
};




  const sendMessage = async (content) => {
    if (!activeSession || !currentUser) return;

    await addDoc(collection(db, 'liveSessions', activeSession, 'messages'), {
      text: content,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email.split('@')[0],
      timestamp: serverTimestamp()
    });
  };

  return (
    <LiveQAContext.Provider value={{
      liveSessions,
      activeSession,
      activeSessionData,
      messages,
      createSession,
      joinSession,
      leaveSession,
      sendMessage
    }}>
      {children}
    </LiveQAContext.Provider>
  );
};

export const useLiveQA = () => useContext(LiveQAContext);