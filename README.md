# FAU Sanitary App 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Intro

Sanitary App is a React Native mobile application integrated with Firebase for authentication and cloud storage. The app allows students to report unclean areas on campus by submitting photos, pinning exact locations on a map, and adding descriptions. University staff can manage and respond to these reports, while IT administrators oversee system maintenance and security.

The app ensures efficient reporting, real-time notifications, and streamlined campus cleanliness management.

## Features

## For Students

* Secure account creation and login.

* Submit cleaning requests with photos of dirty areas.

* Pin locations on a map with building names and numbers.

* Add short descriptions or notes.

* Track the status of submitted reports (Pending, In Progress, Cleaned).

* Receive notifications when staff respond or resolve a request.

## For University Staff

* Secure login and account management.

* Receive real-time notifications of cleaning requests.

* View location, photo, and description of reported areas.

* Update task status to Cleaned.

* Automatic filtering of requests outside working hours.

## For IT/System Maintenance Staff

* Secure administrator login.

* Manage all user accounts (create, edit, delete).

* Monitor database integrity and server health.

* View and analyze activity logs.

* Perform system updates, backups, and recovery.

* Ensure compliance with security protocols.

## System Requirements

* Authentication: Firebase Auth for secure login.

* Cloud Storage: Store images in Firebase Cloud Storage.

* Mapping: Google Maps API integration for location tracking.

* Real-Time Notifications: Notify staff of new cleaning requests.

* Role-Based Access Control: Different functionalities for students, staff, and IT administrators.

* Cross-Platform: Deployable on Android, iOS, and Web.

* Backup & Recovery: Daily backups with 24-hour recovery window.

## Technologies Used

* React Native

* Firebase (Auth, Firestore, Cloud Storage)

* Google Maps API

* JavaScript / TypeScript

* Node.js / npm

## Usage

* Students: Log in → Submit cleaning request → Track status → Receive notifications.

* Staff: Log in → View requests → Update task status → Receive notifications.

* IT/Admin: Log in → Manage accounts → Monitor logs → Perform maintenance tasks.

## ⚙️ Installation & Setup

### 🧑‍💻 For Developers

GUIDE: [LINK DOC](https://docs.google.com/document/d/1eogMiXe7ubHG-SY72XXcA0uRPgAkyedBUYy2oHS68fI/edit?usp=sharing)
