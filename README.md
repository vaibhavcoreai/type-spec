# TYPE-SPEC // REV_1.1.0

A high-performance, technical-aesthetic typing diagnostic terminal designed for mechanical keyboard enthusiasts and avionics/operations simulation.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/Status-Stable-emerald.svg)
![Vibe Coding](https://img.shields.io/badge/Built_With-Vibe_Coding-magenta.svg)

## 📡 Terminal Overview

**TYPE-SPEC** is not just a typing test; it's a specialized input diagnostic interface. Built with a focus on immersive aesthetics and technical precision, it uses real-world technical dictionaries (Avionics, Space-Ops, Nuclear Engineering) to challenge operators.

This project was built using **Vibe Coding**—leveraging advanced AI collaboration to focus on intent, aesthetic flow, and rapid system integration rather than traditional boilerplate manual labor.

### 🚀 Key Features

- **Mechanical Feedback System**: An interactive virtual schematic with audio feedback and localized key-hit reporting.
- **Hardware-Gated Access**: A custom security layer (**MobileGate**) ensures the interface is only accessible on Desktop/Laptop hardware for optimal mechanical input.
- **Unified Telemetry Dashboard**: Real-time WPM (Velocity) and Accuracy (Targeting) tracking with persistent cloud synchronization via Firebase.
- **Secure Authentication**: Encrypted operator login protocols including Email/Password and Google G-Suite Federation.
- **Technical Protocols**: Multiple test modes (Time vs. Words) with dynamic text generation from specialized industry dictionaries.
- **Premium Aesthetics**: A "DOS-meets-Next-Gen" interface featuring glassmorphism, technical borders, and floating shadow effects.

## 🛠️ Deployment Hub

### Prerequisites
- Node.js (v18+)
- Firebase Account (Authentication & Firestore enabled)

### Installation
1. Clone the repository.
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

## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

© 2026 Vaibhav Manaji // ALL_SYSTEMS_GO
