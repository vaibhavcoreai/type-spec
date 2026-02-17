# TYPE-SPEC // REV_1.1.0

A high-performance, technical-aesthetic typing diagnostic terminal designed for mechanical keyboard enthusiasts and avionics/operations simulation.

![License](https://img.shields.io/badge/License-Private-red.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-12-orange.svg)

## 📡 Terminal Overview

TYPE-SPEC is a specialized typing interface that uses real-world technical dictionaries (Avionics, Space-Ops, Nuclear Engineering) to test operator input velocity and accuracy. 

### Key Systems
- **Hardware-Gated Access**: Restricted to Desktop/Laptop interfaces for optimal mechanical input.
- **Telemetry Subsystem**: Real-time WPM/Accuracy tracking with cloud-synced history.
- **Mechanical Simulation**: Virtual keyboard schematic with audio feedback and localized key-hit reporting.
- **Diagnostic Protocols**: Multiple test modes (Time/Words) across various technical difficulty tiers.

## 🛠️ Deployment Hub

### Prerequisites
- Node.js (v18+)
- Firebase Account (Authentication & Firestore)

### Installation
1. Clone the repository (Private).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize environment variables in `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
4. Boot the system:
   ```bash
   npm run dev
   ```

## 🔒 Security Notice
This project is **Proprietary Software**. Unauthorized copying, modification, or distribution of this code via any medium is strictly prohibited. 

© 2026 Vaibhav Manaji // ALL_SYSTEMS_GO
