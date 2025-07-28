  import { updateDoc, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { QuestionContext } from "../context/QuestionContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function QuestionPage({ overrideId }) {
    const params = useParams();
  const { id } = overrideId ? { id: overrideId } : params;
  const {  addReplyToComment,questions, setQuestions, addAnswer, addCommentToAnswer, updateLeaderboard } =
    useContext(QuestionContext);
  const { user } = useAuth();

  const [answerText, setAnswerText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editAnswerIndex, setEditAnswerIndex] = useState(null);
  const [visibleReplyInputs, setVisibleReplyInputs] = useState({});

  const question = questions.find((q) => q.id === id);

  const handleAddAnswer = async (e) => {
  e.preventDefault();

  // Remove leading/trailing spaces but preserve inner spaces
  const cleanedText = answerText.replace(/^\s+|\s+$/g, "");

  // Reject if cleaned text is empty
  if (cleanedText.length === 0) return;

  const newAnswer = {
    text: cleanedText, // trimmed only on ends, middle spaces preserved
    votes: 0,
    author: user?.username || "Anonymous",
    comments: [
      {
    text: "",
    author: "",
    replies: [] 
  }
    ],
     votedBy: {},
    createdAt: Date.now(),
  };

    await addAnswer(question.id, newAnswer);
  setAnswerText("");

 await updateLeaderboard(user.uid, 'question');
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    answersPosted: increment(1)
  });

  // 🔔 Send notification if answering someone else's question
  if (question.author !== user?.username) {
    try {
      const questionRef = doc(db, "questions", question.id);
      const questionSnap = await getDoc(questionRef);
      const questionData = questionSnap.data();

      const notificationId = uuidv4();

      await setDoc(
        doc(db, "users", questionData.userId, "notifications", notificationId),
        {
          type: "answer",
          questionId: question.id,
          answerBy: user.uid,
          createdAt: serverTimestamp(),
          read: false,
        }
      );
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  }
};

  
const handleVote = async (questionId, answerIndex, delta, userId) => {
  if (!userId) return toast.error("You must be logged in to vote.");

  const question = questions.find(q => q.id === questionId);
  if (!question) return;

  const answers = [...question.answers];
  const answer = answers[answerIndex];
  if (!answer) return;

  const votedBy = answer.votedBy || {};
  const previousVote = votedBy[userId] || 0;

  let newVote = 0;
  if (previousVote === delta) {
    // If clicking the same vote again → unvote
    newVote = 0;
    delete votedBy[userId];
  } else {
    // New or changed vote
    newVote = delta;
    votedBy[userId] = delta;
  }

  // Update vote count
  const voteChange = newVote - previousVote;
  answer.votes = (answer.votes || 0) + voteChange;
  answer.votedBy = votedBy;

  // Save to Firestore
  try {
    const questionRef = doc(db, "questions", questionId);
    await updateDoc(questionRef, { answers });

    // Update local state
    setQuestions(prev =>
      prev.map(q =>
        q.id === questionId ? { ...q, answers } : q
      )
    );
  } catch (err) {
    console.error("Vote update error:", err);
    toast.error("Could not update vote.");
  }
};

  const handleEditAnswer = (index) => {
    setIsEditing(true);
    setEditAnswerIndex(index);
    setAnswerText(question.answers[index].text);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    const updatedAnswers = question.answers.map((ans, index) =>
      index === editAnswerIndex ? { ...ans, text: answerText.trim() } : ans
    );

    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answers: updatedAnswers } : q))
    );

    setAnswerText("");
    setIsEditing(false);
    setEditAnswerIndex(null);
  };

  const handleDeleteAnswer = (index) => {
    const updatedAnswers = question.answers.filter((_, i) => i !== index);

    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answers: updatedAnswers } : q))
    );
  };

  const handleMarkAsAccepted = (index) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, acceptedAnswer: index } : q))
    );
    toast.success("Marked as Accepted! ✅");
  };

  const [visibleComments, setVisibleComments] = useState({});

  const toggleCommentBox = (index) => {
    setVisibleComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleReplyInput = (answerIdx, commentIdx) => {
  setVisibleReplyInputs((prev) => ({
    ...prev,
    [answerIdx]: {
      ...(prev[answerIdx] || {}),
      [commentIdx]: !prev[answerIdx]?.[commentIdx],
    },
  }));
};

  if (!question) return <p>Question not found!</p>;

  return (
    <div className="container">
      <h1>{question.title}</h1>
      <p>
        <small>Posted by {question.author}</small>
      </p>

      <h2 className="section-heading">Answers</h2>
      {question.answers.length === 0 ? (
        <p className="no-answers">No answers yet.</p>
      ) : (
        <ul className="answer-list">
          {Array.isArray(question.answers) && question.answers.map((ans, idx) => (
            <li
              className={`answer-card ${
                question.acceptedAnswer === idx ? "accepted-answer" : ""
              }`}
              key={idx}
            >
              <div className="answer-top">
                <div className="answer-text">
                  {ans.text}
                  {question.acceptedAnswer === idx && (
                    <span className="accepted-badge">✔ Accepted</span>
                  )}
                  <br />
                  <br />
                  <b>
                    <small>Answered by {ans.author}</small>
                  </b>
                </div>
              </div>

              <div className="answer-bottom">
                <div className="vote-controls">
                  <button onClick={() => handleVote(question.id, idx, +1, user.uid)}>🔼</button>
                  <div>{ans.votes}</div>
                  <button onClick={() => handleVote(question.id, idx, -1, user.uid)}>🔽</button>
                </div>

                <div className="answer-actions">
                  <button onClick={() => toggleCommentBox(idx)}>💬</button>

                  {ans.author === user?.username && (
                    <>
                      <button onClick={() => handleEditAnswer(idx)}>
                        ✏️Edit
                      </button>
                      <button onClick={() => handleDeleteAnswer(idx)}>
                        🗑️Delete
                      </button>
                    </>
                  )}

                  {user?.username === question.author &&
                    question.acceptedAnswer !== idx && (
                      <button onClick={() => handleMarkAsAccepted(idx)}>
                        ✔ Accept
                      </button>
                    )}
                </div>
              </div>

            {/* Conditional Comments Section */}
{visibleComments[idx] && (
  <div className="comments-section" style={{ 
    marginTop: "10px", 
    borderTop: "1px solid #e0e0e0", 
    paddingTop: "10px" 
  }}>
 {ans.comments
  ?.filter((cmt) => cmt.text && cmt.text.trim() !== "")
  .map((cmt, cIdx) => (
  <div 
    key={cIdx} 
    className="comment" 
    style={{ 
      padding: "8px 0",
      borderBottom: "1px solid #f0f0f0",
      marginBottom: "8px" 
    }}
  >
    <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>{cmt.text}</p>
    <small style={{ color: "#666", fontStyle: "italic" }}>— {cmt.author}</small>

    {/* Reply Button */}
    {user && (
      <button 
        onClick={() => toggleReplyInput(idx, cIdx)}
        style={{
          marginTop: "6px",
          background: "none",
          border: "none",
          color: "#007bff",
          cursor: "pointer",
          fontSize: "13px",
        }}
      >
        Reply
      </button>
    )}

    {/* Reply Input */}
    {visibleReplyInputs[idx]?.[cIdx] && (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const replyText = e.target.elements[`reply-${idx}-${cIdx}`].value;
          if (!replyText.trim()) return;

          const newReply = {
            text: replyText,
            author: user.username,
            createdAt: Date.now(),
          };

          addReplyToComment(question.id, idx, cIdx, newReply);
          e.target.reset();
        }}
        style={{
          marginTop: "8px",
          marginLeft: "12px",
          display: "flex",
          gap: "8px",
        }}
      >
       <input
  type="text"
  name={`reply-${idx}-${cIdx}`}
  placeholder="Write a reply..."
  style={{
    flex: 1,
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  }}
/>
<button
  type="submit"
  style={{
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  }}
>
  Post
</button>

      </form>
    )}

    {/* Render Replies */}
    {cmt.replies?.map((rep, rIdx) => (
      <div
        key={rIdx}
        style={{
          marginLeft: "20px",
          marginTop: "6px",
          background: "#f9f9f9",
          padding: "6px 10px",
          borderRadius: "4px",
          fontSize: "13px",
        }}
      >
        <p style={{ margin: 0 }}>{rep.text}</p>
        <small style={{ color: "#666", fontStyle: "italic" }}>— {rep.author}</small>
      </div>
    ))}
  </div>
))}

{/* Comment Input */}
{user && (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      const commentText = e.target.elements[`comment-${idx}`].value;
      if (!commentText.trim()) return;

      const newComment = {
        text: commentText,
        author: user.username,
        createdAt: Date.now(),
        replies: [], // Ensure structure for replies
      };

      addCommentToAnswer(question.id, idx, newComment);
      e.target.reset();
    }}
    style={{ 
      display: "flex", 
      gap: "8px", 
      marginTop: "12px" 
    }}
  >
    <input
      name={`comment-${idx}`}
      placeholder="Add a comment..."
      style={{ 
        flex: 1,
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px",
        color: "black" 
      }}
    />
    <button 
      type="submit"
      style={{
        padding: "8px 12px",
        background: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px"
      }}
    >
      Post
    </button>
  </form>

    )}
  </div>

              )}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={isEditing ? handleSaveEdit : handleAddAnswer}
        style={{ marginTop: "20px" }}
      >
        <textarea
          placeholder="Write your answer..."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            color: "black",
          }}
          required
        />
        <br />
        <button
          type="submit"
          style={{ marginTop: "10px", padding: "10px 20px" }}
        >
          {isEditing ? "Save Edit" : "Post Answer"}
        </button>
      </form>
    </div>
  );
}

export default QuestionPage;