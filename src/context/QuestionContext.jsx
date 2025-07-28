import { toast } from "react-toastify";
import { deleteDoc, doc, onSnapshot, collection, addDoc, updateDoc } from "firebase/firestore";
import React, { createContext, useEffect, useState, useContext } from "react";
import { auth, db } from "../firebase";
import { getDoc, setDoc, increment } from "firebase/firestore";

export const QuestionContext = createContext();

export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);

  // Fetch questions in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'questions'), (snapshot) => {
      const fetched = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          answers: Array.isArray(data.answers) ? data.answers : [], // ✅ ensure answers is always an array
        };
      });
      setQuestions(fetched);
    });

    return () => unsubscribe();
  }, []);

  const addQuestion = async (question) => {
    const docRef = await addDoc(collection(db, "questions"), question);
    const newQuestion = {
      id: docRef.id,
      ...question,
      answers: [], // ensure new questions start with empty answers array
    };
    setQuestions(prev => [...prev, newQuestion]);
    return newQuestion;
  };

  const addAnswer = async (questionId, answer) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, answers: Array.isArray(q.answers) ? [...q.answers, answer] : [answer] }
          : q
      )
    );

    const question = questions.find(q => q.id === questionId);
    const currentAnswers = Array.isArray(question?.answers) ? question.answers : [];
    const updatedAnswers = [...currentAnswers, answer];

    const questionRef = doc(db, "questions", questionId);
    await updateDoc(questionRef, { answers: updatedAnswers });

    toast.success("Answer Posted! 🎉");
  };

  const editQuestion = async (id, updatedFields) => {
    const questionRef = doc(db, "questions", id);
    await updateDoc(questionRef, updatedFields);

    setQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, ...updatedFields } : q
      )
    );

    toast.success("Question updated!");
  };

  const deleteQuestion = async (id) => {
    if (!id || typeof id !== "string") {
      console.error("Invalid question ID for deletion:", id);
      toast.error("Invalid question ID.");
      return;
    }

    try {
      await deleteDoc(doc(db, "questions", id));
      toast.success("Question deleted!");
      // Firestore listener will update state automatically
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question.");
    }
  };

  const addCommentToAnswer = async (questionId, answerIndex, comment) => {
    const updatedQuestions = [...questions];
    const targetQuestion = updatedQuestions.find(q => q.id === questionId);

    if (!targetQuestion || !Array.isArray(targetQuestion.answers)) return;

    const answersCopy = [...targetQuestion.answers];
    const answer = answersCopy[answerIndex];

    if (!answer) return;

    answer.comments = Array.isArray(answer.comments) ? answer.comments : [];
    answer.comments.push(comment);

    const questionRef = doc(db, "questions", questionId);
    await updateDoc(questionRef, { answers: answersCopy });

    setQuestions(updatedQuestions.map(q =>
      q.id === questionId ? { ...q, answers: answersCopy } : q
    ));
  };

const addReplyToComment = async (questionId, answerIndex, commentIndex, reply) => {
  const updatedQuestions = questions.map((q) => {
    if (q.id !== questionId) return q;

    const updatedAnswers = [...(q.answers || [])];
    const targetAnswer = { ...updatedAnswers[answerIndex] };

    if (!targetAnswer) return q;

    const updatedComments = [...(targetAnswer.comments || [])];
    const targetComment = { ...updatedComments[commentIndex] };

    if (!targetComment) return q;

    targetComment.replies = Array.isArray(targetComment.replies)
      ? [...targetComment.replies, reply]
      : [reply];

    updatedComments[commentIndex] = targetComment;
    targetAnswer.comments = updatedComments;
    updatedAnswers[answerIndex] = targetAnswer;

    return {
      ...q,
      answers: updatedAnswers,
    };
  });

  const questionToUpdate = updatedQuestions.find(q => q.id === questionId);
  if (!questionToUpdate) return;

  const questionRef = doc(db, "questions", questionId);
  await updateDoc(questionRef, { answers: questionToUpdate.answers });

  setQuestions(updatedQuestions);
};

const updateLeaderboard = async (userId, type = 'answer') => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    await updateDoc(userRef, {
      answersPosted: type === 'answer' ? increment(1) : increment(0),
      questionsPosted: type === 'question' ? increment(1) : increment(0),
      points: increment(type === 'answer' ? 10 : 5),
    });
  } else {
    await setDoc(userRef, {
      displayName: auth.currentUser?.displayName || "Anonymous",
      email: auth.currentUser?.email || "",
      answersPosted: type === 'answer' ? 1 : 0,
      questionsPosted: type === 'question' ? 1 : 0,
      points: type === 'answer' ? 10 : 5,
    });
  }
};



  return (
    <QuestionContext.Provider value={{
      questions,
      setQuestions,
      addQuestion,
      addAnswer,
      deleteQuestion,
      addCommentToAnswer,
      editQuestion,
      addReplyToComment,
       updateLeaderboard
    }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestions = () => useContext(QuestionContext);
