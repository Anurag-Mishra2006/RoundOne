# ![RoundLogo](./public/logo.svg)RoundOne

> **Crack your next FAANG interview.** Stop reading tutorials. Start practicing under pressure.

![RoundOne Landing Page](./public/image.png)

RoundOne is a comprehensive, all-in-one interview preparation platform built specifically for software engineers. It brings together an **AI-powered voice mock interview**, **custom code execution engine**, **DSA interview practice**, **interrogative resume building**, **ATS analysis**, and **structured interview preparation** into one unified platform.

**Live:** [roundoneprep.me](https://roundoneprep.me/)  
**Backend:** [RoundOne-backend](https://github.com/Anurag-Mishra2006/RoundOne-backend)

Engineered by [Anurag Mishra](https://github.com/Anurag-Mishra2006).

---

## ✨ Core Features

### 🎙️ 1. AI Voice Mock Interview — Core Feature

A personalized, voice-based interview experience built around your **resume, target company, and target role**.

- **Resume-Based Interview:** Upload your resume and let the AI generate questions based on your projects, experience, and skills.
    
- **Company & Role Targeting:** Select your target company and role to generate relevant interview questions.
    
- **Structured Interview:** Each interview consists of **5 HR, 5 Technical, and 1 DSA question**.
    
- **AI Interviewer:** Generates and asks interview questions dynamically.
    
- **Text-to-Speech & Speech-to-Text:** Converts AI responses into natural speech and transcribes spoken responses.
    
- **Technical Evaluation:** AI evaluates answers based on correctness, reasoning, communication, and technical depth.
    
- **Interview Report:** Receive a detailed performance report after completing the interview.
    
- **Shareable Reports & Competition:** Share your interview report with friends and maintain a friendly competitive environment.
    

---

### 🧠 2. DSA Mock Interview

Practice DSA interview questions in a structured, company-focused environment.

- **Company-Focused Questions:** Select a company and practice relevant DSA questions.
    
- **Progressive Difficulty:** Practice **Easy, Medium, and Hard** questions.
    
- **Timed Environment:** Solve problems under interview-style time pressure.
    
- **Integrated Coding Editor:** Write solutions using the Monaco Editor.
    
- **Code Evaluation:** Run and submit solutions using the custom execution engine.
    
- **Performance Tracking:** Review previous attempts and identify areas for improvement.
    

---

### 💻 3. DSA Mock Arena — Contest Mode

A strict, simulated Online Assessment (OA) environment designed to replicate the pressure of real software engineering interviews.

- **Dynamic Question Generation:** Practice company-focused question sets across different difficulty levels.
    
- **Timed Environment:** 90-minute countdown timer to simulate real OA conditions.
    
- **Anti-Cheat Measures:** Tab-switch detection and automatic submission mechanisms.
    
- **Custom Docker Judge:** User-submitted code is compiled and executed inside isolated Docker containers against test cases.
    
- **Asynchronous Evaluation:** BullMQ and Redis handle code execution jobs without blocking the main API server.
    
- **Multi-Language Support:** Execute solutions in **C++, Python, Java, and JavaScript**.
    

---

### 🛠️ 4. AI Resume Builder & ATS Checker

Build a stronger, impact-focused resume and evaluate how well it performs against ATS systems.

#### Resume Builder

- **Interrogative AI:** Instead of simply asking users to fill out generic fields, the AI asks targeted questions to uncover meaningful project impact.
    
- **Impact-Oriented Bullets:** Converts raw experiences into concise, measurable resume bullets.
    
- **Structured Resume:** Generates a clean, professional, single-column resume.
    
- **PDF Export:** Export the finished resume as a PDF.
    

#### ATS Checker

- **ATS Score:** Evaluate your resume on a 100-point scale.
    
- **Keyword & Role Analysis:** Identify missing keywords and determine which roles your resume is best aligned with.
    
- **Actionable Feedback:** Get suggestions for improving ATS compatibility.
    

---

### 📈 5. Analytics Dashboard & Learning Hub

Track preparation progress and maintain consistency.

- **Consistency Heatmap:** GitHub-style activity visualization for DSA and interview preparation.
    
- **Progress Tracking:** Monitor learning progress across different preparation paths.
    
- **Performance Analytics:** Review mock interview and coding performance.
    
- **Learning Hub:** Follow structured resources and roadmaps such as Striver's A2Z and System Design.
    

---

## 🏗️ System Architecture

RoundOne is designed around an asynchronous architecture so that resource-intensive tasks such as code execution and AI processing do not block the main API server.

```text
                         ┌─────────────────────┐
                         │      Frontend       │
                         │ React + TypeScript  │
                         │ Vite + Tailwind     │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / API
                                    ▼
                         ┌─────────────────────┐
                         │      Backend        │
                         │ Node.js + Express   │
                         │     TypeScript      │
                         └───────┬─────┬───────┘
                                 │     │
                    ┌────────────┘     └──────────────┐
                    ▼                                 ▼
             ┌─────────────┐                   ┌─────────────┐
             │ PostgreSQL  │                   │    Redis    │
             │   + Prisma  │                   │  + BullMQ   │
             └─────────────┘                   └──────┬──────┘
                                                      │
                                                      │ Jobs
                                                      ▼
                                             ┌─────────────────┐
                                             │  Worker Process │
                                             └────────┬────────┘
                                                      │
                                                      ▼
                                             ┌─────────────────┐
                                             │ Docker Sandbox  │
                                             │ Code Execution  │
                                             └─────────────────┘
```

---

## 🧰 Tech Stack

### Frontend

- **Core:** React 19, TypeScript, Vite 8
    
- **Styling:** Tailwind CSS 4, Framer Motion
    
- **State & Routing:** Zustand, React Router
    
- **Editor & Content:** Monaco Editor, React PDF, React Markdown
    
- **Analytics:** Google Analytics
    

### Backend

- **Core:** Node.js, Express 5, TypeScript
    
- **Database & ORM:** PostgreSQL, Prisma ORM 7
    
- **Validation & Auth:** Zod, JWT, BcryptJS
    
- **File Handling:** Multer, PDF-Parse
    

### Infrastructure & Workers

- **Message Queue:** BullMQ, Redis (ioredis)
    
- **Execution:** Docker (Custom Code Execution Engine)
    

### AI & Integrations

- **AI Models:** Google Gemini, OpenAI
    
- **Speech:** Groq Whisper, Edge-TTS
    
- **Media Storage:** Cloudinary
    
- **Emails:** Brevo, Resend, Nodemailer, EmailJS
    
- **Analytics:** Google Analytics Data API
    

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18+)
    
- PostgreSQL
    
- Redis
    
- Docker
    
- Git
    

> **Note:** Docker must be running for the custom code execution engine to work.

---

### 1. Clone the Repository

```bash
git clone https://github.com/Anurag-Mishra2006/roundone.git
cd roundone
```

---

### 2. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=3000

DATABASE_URL="postgresql://user:password@localhost:5432/roundone"

REDIS_HOST="localhost"
REDIS_PORT=6379

JWT_SECRET="your_secret_here"

# AI API Keys
GROQ_API_KEY="your_groq_api_key"
OPENAI_API_KEY="your_openai_api_key"
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_BACKEND_URL="http://localhost:3000"
```

> Add or remove environment variables according to the services configured in your local setup.

---

### 3. Install Dependencies

#### Backend

```bash
cd backend

npm install

npx prisma generate
npx prisma db push
npm run build
```

#### Frontend

```bash
cd ../frontend

npm install
```

---

### 4. Run the Application

RoundOne requires multiple processes during local development. Ensure **Redis, PostgreSQL, and Docker** are running.

#### Terminal 1 — Backend API & BullMQ Workers

```bash
cd backend

npm run dev
```

> **Note:** BullMQ workers are instantiated and run concurrently within the main backend process.

#### Terminal 2 — Frontend

```bash
cd frontend

npm run dev
```

---

## 🔒 Security & Code Sandboxing

Running arbitrary user-submitted code requires strong isolation. RoundOne's execution engine uses Docker containers to isolate submitted programs from the host environment.

The execution layer is designed around restrictions such as:

- **Execution Time Limits:** Prevents infinite loops and excessive CPU consumption.
    
- **Memory Limits:** Helps prevent memory exhaustion.
    
- **Network Isolation:** Containers can run without network access.
    
- **Background Processing:** BullMQ workers process execution jobs independently from the API server.
    

> **Security Note:** Docker isolation should not be treated as a complete security boundary without additional hardening. If deploying the execution engine publicly, container privileges, resource limits, namespaces, filesystem access, and capabilities must be configured carefully.

---

## 🎯 Project Goals

RoundOne aims to bring the most important parts of software engineering interview preparation into a single platform. Instead of switching between multiple tools for DSA practice, mock interviews, resume building, ATS checking, and performance tracking — **RoundOne brings them together in one place.**

---

## ☕ Support

If you find RoundOne useful, consider giving the repository a ⭐ on GitHub. Your support helps motivate continued development and improvement of the project!

---

## 📄 License

This project is proprietary.

```
Copyright © 2026 Anurag Mishra. All rights reserved.
```
