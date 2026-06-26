<div align="center">
  <h1>VERITAS//FEED</h1>
  <p><b>Real-time visual intelligence and disinformation detection platform.</b></p>

  <p>
    <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/Framework-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Routing-TanStack_Router-FF4154?style=for-the-badge" alt="TanStack" />
    <img src="https://img.shields.io/badge/Database-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  </p>
</div>

<br />

## 📡 Overview

**VERITAS//FEED** is an advanced operational dashboard designed to surface actionable intelligence. 

Analysts often struggle to identify, track, and verify rapidly evolving disinformation narratives because critical data is typically siloed across disconnected text tables and scattered feeds. **VERITAS//FEED** transforms this experience by presenting intelligence visually—allowing investigators to spot connections, measure impact, and detect anomalies *before* digging into the raw data.

## ✨ Key Features

- **🔴 Live Intelligence Feed:** Monitor incoming data streams, validation queues, and breaking narratives in real time.
- **🔗 Entity Knowledge Graphs:** Visualize the hidden relationships between threat actors, sources, and emerging disinformation campaigns.
- **⚡ Real-Time Synchronization:** Fully integrated with Firebase Firestore, ensuring that all team members see updates, metrics, and investigation statuses instantly without refreshing.
- **📊 Interactive Visualizations:** Turn complex, dense datasets into intuitive, actionable visual insights instead of static text blocks.
- **🚀 Automated CI/CD:** Seamlessly built and deployed to Firebase Hosting via GitHub Actions on every push to the main branch.

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Routing:** TanStack Router (Fully type-safe)
- **Styling:** Tailwind CSS, custom UI components
- **Backend & Database:** Firebase Firestore (Real-time NoSQL document store)
- **Deployment:** Firebase Hosting (Static SPA), GitHub Actions

## 🚀 Getting Started

To run the platform locally on your machine:

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1divy2/veritas-feed.git
   cd veritas-feed
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local server URL provided in the terminal (usually `http://localhost:5173`).

## 📦 Deployment

This project features a fully configured CI/CD pipeline. 

Any push to the `main` branch will trigger a GitHub Action that:
1. Installs dependencies
2. Compiles a production-ready SPA build using Vite
3. Injects the required static `index.html`
4. Automatically deploys the application to Firebase Hosting

**Live URL:** [https://veritas-646ca.web.app](https://veritas-646ca.web.app)

---

<div align="center">
  <small>Built with ⚡ by <a href="https://github.com/1divy2">Divy</a></small>
</div>
