# Solution-Quest

**Solution Quest** is a community-driven Q&A forum where users can ask questions, provide answers, and engage in live discussions. Built using **React** and **Firebase**, it aims to streamline the way people share and discover knowledge.

---

## Features

- **User Authentication** (Firebase Auth)
- **Post Questions** with title and tag support
- **Answer & Comment** on questions
- **Threaded Replies** to comments
- **Question Tags & Filters**
- **User Profiles** with activity view
- **Live Q&A Sessions** (Real-time chat)
- **Search & Navigation**

---

## Screenshots

---

## Tech Stack

- **Frontend**: React, CSS Modules / Tailwind
- **Backend**: Firebase Firestore, Firebase Auth, Cloud Functions

---

## Firebase Rules

    rules_version = '2';
    service cloud.firestore {
        match /databases/{database}/documents {
        match /users/{userId} {
                allow read: if true;
                allow write: if request.auth != null && request.auth.uid == userId;
            }
            match /{document=**} {
            allow read, write: if true;
        }
    }
    }


## Folder Structure

```bash
src/
├── Components/        # Reusable UI components
├── context/           # Context Providers (Auth, Questions, Theme)
├── layout/            # Layout components like Sidebar, Topbar
├── pages/             # Page-level components (Home, Profile, Community)
├── styles/            # Global or modular CSS
├── utils/             # Utility functions/helpers
├── App.jsx            # Main App component
├── firebase.js        # Firebase config and initialization
├── index.css          # Global CSS
├── main.jsx           # Root render