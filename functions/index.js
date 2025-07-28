import { onDocumentCreate } from "firebase-functions/v2/firestore";
import { onDocumentUpdate } from "firebase-functions/v2/firestore";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import sgMail from "@sendgrid/mail";

// Initialize Firebase Admin
initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

// Set your SendGrid API Key (recommended to use environment variables instead)
sgMail.setApiKey("YOUR_SENDGRID_API_KEY");

// Function: Firestore Trigger on new Answer → Create Notification
export const sendAnswerNotification = onDocumentCreate("answers/{answerId}", async (event) => {
  const answer = event.data.data();
  const questionId = answer.questionId;
  const answererId = answer.userId;

  const questionSnap = await db.collection("questions").doc(questionId).get();
  const question = questionSnap.data();

  if (!question || question.userId === answererId) return;

  const notification = {
    userId: question.userId,
    message: `Your question "${question.title}" received a new answer.`,
    questionId,
    answerId: event.params.answerId,
    type: "answer",
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  };

  await db.collection("notifications").add(notification);
});

// Function: Firestore Trigger on Question Update → Send Email on New Answer
export const sendEmailOnAnswer = onDocumentUpdate("questions/{questionId}", async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  if ((before.answers?.length ?? 0) === (after.answers?.length ?? 0)) {
    return null;
  }

  const newAnswer = after.answers[after.answers.length - 1];
  const recipientEmail = after.authorEmail || "author@example.com";

  const msg = {
    to: recipientEmail,
    from: "no-reply@yourapp.com",
    subject: "Your question got a new answer!",
    text: `New answer: ${newAnswer.text}`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent!");
  } catch (error) {
    console.error("Email send error:", error);
  }

  return null;
});
