# Finance Tracker App

a React application that helps users manage their personal finances by tracking income, expenses, and savings goals.

## Live Demo
https://finance-tracker-app-bay.vercel.app/

## Project Description
This is a React application built with Vite that utilizes Firebase for authentication and data management.
The app also leverages the Context API and Redux for global state management, and integrates Firebase services such as Firestore and Authentication.

Key Features:
- Firebase Authentication (Google sign-in, email/password login)
- Firestore for real-time data storage
- Context API for managing authentication state
- Redux Toolkit for state management (transactions, modals, etc.)
- Vite as the build tool for faster development and bundling

## Installation and Setup
### Prerequisites
- NPM or Yarn
- Firebase Project (set up with Firestore and Authentication enabled)

### Clone the Repository

git clone https://github.com/Ss-e-N-aa/finance-tracker-app.git
cd finance-tracker-app

## Install Dependencies
### Using npm
npm install

### Or using yarn
yarn install

## Start Development Server
### Using npm
npm run dev

### Or using yarn
yarn dev

## Authentication
The app uses Firebase Authentication with both Google Sign-In and email/password options. You can log in using these methods, and your credentials will be securely stored in Firebase.

## Transactions Management
The app allows users to add income and expenses via forms. The data is managed using Redux slices and stored in Firestore.

## State Management
- **Context**: Manages user authentication state globally.
- **Redux**:
- transaction slice handles the state for fetching , adding and deleting the transactions .
- savings goals slice handles the state for fetching , adding , updating and deleting the goals .
- dark mode theme slice handles setting and resetting the theme .
- modal slice handles toggling (opening and closing ) the modals.
- expense / incomes slices handle setting the form inputs.

## Modals
Modals are used to add expenses ,incomes , savings goals and to add funds and update these goals . The modal state is managed via Redux in modal-slice.

## Firebase Integration

### Firebase Authentication
Firebase Authentication is used for user login and signup with Google or email/password. The logic is handled in `src/context/UserContext.js`.

### Firestore
The logic for adding and fetching transactions can be found in `src/store/transactions-slice.js` 
The logic for adding and fetching savings goals can be found in `src/store/savingsGoals-slice.js`

### Firebase Setup
To configure Firebase in your app, Firebase SDK is initialized in `src/firebase.js`. You will need to ensure your Firebase project is properly set up with Firestore and Authentication enabled.

### Usage

Create an account with email/password or Google sign up . 
start adding incomes , expenses and goals .
switch the theme in the Settings page . 
