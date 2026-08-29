# 🚀 LearnPath AI — AI-Powered Learning Companion & Adaptive Engineering Ecosystem

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

**LearnPath AI** is an intelligent, full-stack adaptive learning and career acceleration platform designed to take software engineers and students from foundational concepts to Staff-level production mastery.

---

## 🌟 Key Features

### 1. 🗺️ 14 Deep Canonical Learning Paths
- Comprehensive, multi-tiered curriculum for top engineering domains:
  - **Generative AI & LLM Systems Engineering**
  - **Java Backend & Microservices**
  - **Full Stack Development (React/Node)**
  - **DevOps & Cloud SRE**
  - **Python / FastAPI Engineering**
  - **Data Engineering & Analytics**
  - **Golang Systems Engineering**
  - **Cybersecurity, Mobile Development, and more**
- Integrated video lessons, structured markdown notes, and progress trackers.

### 2. ⚡ Live LeetCode Analytics & 85+ Curated DSA Sheet
- **Live LeetCode Sync**: Connect any username or profile URL to fetch real-time problem-solving breakdown, global ranking, acceptance rate, contest rating, and language statistics.
- **85+ Topic-Wise DSA Problems**: Easy, Medium, and Hard problems with starter code, optimal solution patterns, and live execution test cases.

### 3. 🎨 Interactive Algorithm Visualizer Studio
- Step-by-step visual animation studio with speed controls for fundamental algorithms:
  - **Sorting**: Bubble Sort, Quick Sort, Merge Sort
  - **Graphs & Grids**: Dijkstra's Algorithm, Breadth-First Search (BFS), Depth-First Search (DFS), A* Pathfinding
  - **Trees**: Binary Search Tree (BST) Traversals, Invert Tree
  - **Dynamic Programming & Pointers**: Kadane's Max Subarray, Two Sum

### 4. 🎙️ 30-Minute AI Mock Voice Interviewer
- Fully simulated technical interview experience featuring:
  - **Live Camera & Audio Feed** integration.
  - **Speech-to-Text (STT)** & **Real-Time Voice Speech Synthesis (TTS)**.
  - Progressive 6-question role-specific curriculum with follow-ups.
  - Detailed end-of-round **Staff Engineer Scorecard** (Technical Accuracy, System Depth, Communication Clarity, and Dynamic Hiring Recommendation).

### 5. 📄 AI Resume Builder & Gap Analyzer
- Interactive resume editor with live PDF export (`html2pdf`).
- **ATS Keyword Matcher**: Upload or paste job descriptions to analyze resume keyword match score, missing competencies, and tailored roadmap recommendations.

### 6. 💼 Live Job Matching via Adzuna API
- Real-time job search integrated with the Adzuna API.
- Filter by domain keyword, location (e.g. Bangalore, Mumbai, Remote), and match job openings directly to your claimed technical skill inventory.

### 7. 🤖 Contextual RAG AI Engineering Tutor
- 24/7 AI technical mentor powered by Google Gemini AI for debugging, architecture trade-offs, and algorithm explanations.

---

## 🛠️ Architecture & Tech Stack

```
LearnPath AI Architecture
├── Frontend (Clean Light SaaS)
│   ├── React 18 & Babel Standalone
│   ├── Canvas Confetti & Visualizer Canvas Engine
│   └── Modern CSS3 Tokens & Glassmorphic Components
│
├── Backend (RESTful Web Service)
│   ├── Spring Boot 3.4
│   ├── Google Gemini AI Client (RAG & Interview Prompts)
│   ├── Adzuna Job Search API Integration
│   └── In-Memory / JPA User Profile Services
```

---

## ⚡ Quickstart & Setup Guide

### Prerequisites
- **Java 17 or higher** (`java -version`)
- **Maven 3.8+** (or use included `./mvnw`)
- **Node.js** (Optional, for running static file server e.g. `npx serve`)

### 1. Clone the Repository
```bash
git clone https://github.com/hjkhairnar2104-code/HCLHACK.git
cd HCLHACK
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your API keys:
```bash
cp .env.example .env
```
Edit `.env`:
```properties
GEMINI_API_KEY=your_gemini_api_key_here
ADZUNA_APP_ID=your_adzuna_app_id_here
ADZUNA_APP_KEY=your_adzuna_app_key_here
PORT=8085
```

### 3. Run Backend (Spring Boot)
```bash
cd backend

# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
The backend will start on **`http://localhost:8085`**.

### 4. Run Frontend
Open `frontend/index.html` directly in your browser, or run a local static server:
```bash
cd frontend
npx serve -l 3000
```
Visit **`http://localhost:3000`** in your browser.

---

## 🔒 Security & Best Practices
- **Never commit `.env`** or private API keys to GitHub.
- Use `.env.example` as a template for team collaboration and CI/CD deployments.
