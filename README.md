# 🚀 CodeSync Pro


React • TypeScript • Node.js • Express • MongoDB • Socket.IO • WebRTC • Judge0 • RAG • Vector Search • Agentic AI

🚀 CodeSync Pro
AI-Powered Collaborative Coding & Interview Platform

CodeSync Pro is a full-stack platform that combines coding practice, real-time collaborative coding, AI assistance, code execution, live chat, and video meetings in one place.

It is designed for developers, students, and interview preparation.

✨ Features
🧑‍💻 Coding Practice
Curated coding problems
Search and filtering
Difficulty levels
Solved / unsolved tracking
Monaco Editor
Multiple programming languages
Custom input
Run Code
Submit Solution
Test case evaluation
Runtime and memory information
Submission history
⚡ Real-Time Collaborative Coding
Create and join coding rooms
Real-time code synchronization
Real-time language synchronization
Active users panel
Typing indicators
Socket.IO-powered collaboration
💬 Real-Time Chat
Live room messaging
Persistent chat history
Sender information
Message timestamps
Typing indicators
📹 Video Meetings
Incoming video call requests
Accept / decline calls
Microphone controls
Camera controls
Screen sharing
End call
WebRTC peer-to-peer communication
🤖 AI Coding Assistant

The integrated AI assistant helps with:

Code explanations
Debugging
Complexity analysis
Algorithm discussions
Problem solving
Interview preparation
Coding guidance
🧠 RAG & Vector Search

The AI system can retrieve relevant knowledge before generating a response.

User Question
      ↓
Embedding Generation
      ↓
Vector Search
      ↓
Relevant Knowledge
      ↓
Context Construction
      ↓
LLM
      ↓
AI Response
⚡ Agentic AI

CodeSync Pro also includes an agent-style AI workflow:

User Request
      ↓
Intent Detection
      ↓
Task Planning
      ↓
Tool Selection
      ↓
Tool Execution
      ↓
Context / Results
      ↓
Final AI Response
🎯 Online Code Execution

Code execution is powered by Judge0.

Currently supported languages:

JavaScript
TypeScript
Python
Java
C++

The platform handles:

Compilation errors
Runtime errors
Wrong answers
Test case evaluation
Runtime information
Memory information
Submission records
🛠️ Tech Stack
Frontend
React
TypeScript
Vite
React Router
Zustand
Axios
Monaco Editor
Socket.IO Client
WebRTC
CSS
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Socket.IO
AI
LLM integration
RAG
Embeddings
Vector Search
Agentic AI
Tool-based workflows
Code Execution
Judge0
📂 Project Structure
codesync-pro/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── assets/
│       ├── App.tsx
│       └── main.tsx
│
├── server/
│   └── src/
│       ├── ai/
│       │   ├── rag/
│       │   ├── agentController.js
│       │   ├── agentRoutes.js
│       │   ├── agentService.js
│       │   └── agentTools.js
│       │
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── sockets/
│       ├── data/
│       └── server.js
│
└── README.md
🔐 Authentication

CodeSync Pro uses JWT-based authentication.

Register / Login
       ↓
JWT Token
       ↓
Authenticated Requests
       ↓
Protected Routes
🚀 Getting Started

Anyone can run the project locally by following the steps below.

1. Clone the Repository
git clone https://github.com/yashika548/Codesync-pro.git
cd Codesync-pro
2. Backend Setup

Open a terminal inside the project directory.

cd server

Install backend dependencies:

npm install

Start the backend:

npm run dev

The backend will run on:

http://localhost:5000
3. Frontend Setup

Keep the backend terminal running.

Open a new terminal.

From the project root:

cd client

Install frontend dependencies:

npm install

Start the frontend:

npm run dev

The frontend will normally run on:

http://localhost:5173

Open the frontend URL in your browser.

4. Environment Variables

Create a file:

server/.env

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_ai_api_key

Use the environment variables required by your local configuration.

⚠️ Never commit .env files, passwords, database credentials, or API keys to GitHub.

🧪 Using CodeSync Pro
Coding Practice
Register / Login
      ↓
Dashboard
      ↓
Problems
      ↓
Select a Problem
      ↓
Write Code
      ↓
Run Code
      ↓
Submit Solution
      ↓
View Result
      ↓
Submission History
Collaborative Coding
Create Room / Join Room
      ↓
Collaborative Editor
      ↓
Real-Time Code Sync
      ↓
Chat
      ↓
Video Meeting
      ↓
Solve Together
AI Assistant
Ask a Coding Question
      ↓
Intent Detection
      ↓
Planning
      ↓
RAG / Tools
      ↓
Context Retrieval
      ↓
AI Response
🏗️ Architecture
                         CodeSync Pro
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        React Client      Socket.IO          WebRTC
             │                │                │
             └────────────────┼────────────────┘
                              │
                              ▼
                     Node.js + Express
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
         MongoDB            Judge0           AI Layer
                                                │
                              ┌─────────────────┼────────────────┐
                              │                 │                │
                              ▼                 ▼                ▼
                             LLM          RAG / Vector        Agentic
                                           Search              AI
📡 Main Modules
Module	Purpose
Authentication	User registration and login
Dashboard	Coding progress and recent activity
Problems	Coding problem library
Code Editor	Write and execute code
Judge0	Code execution and evaluation
Submissions	Submission tracking
Rooms	Collaborative coding
Socket.IO	Real-time synchronization
Chat	Room communication
WebRTC	Video meetings
AI Assistant	AI-powered coding assistance
RAG	Knowledge retrieval
Vector Search	Semantic retrieval
Agentic AI	Planning and tool execution
🔒 Security Notes
JWT authentication is used for protected routes.
Environment variables are used for secrets.
.env files should never be committed.
API keys should never be exposed in frontend source code.
Database credentials should remain private.
🔮 Future Improvements
Larger coding problem library
Personalized learning paths
AI-generated coding questions
Adaptive difficulty
Advanced coding analytics
AI mock interviews
Interview performance analysis
Production vector database infrastructure
Cloud deployment
Monitoring and observability
🤝 Contributing

Contributions are welcome.

Create a feature branch:

git checkout -b feature/your-feature

Make your changes and test them.

Then:

git add .
git commit -m "feat: describe your change"

Push the branch:

git push origin feature/your-feature

Then open a Pull Request on GitHub.

⭐ Support the Project

If you like CodeSync Pro:

⭐ Star the repository

🍴 Fork the repository

🐛 Report bugs

💡 Suggest improvements

👨‍💻 Author

Yashika

GitHub:
https://github.com/yashika548

📜 License

This project is intended for learning, development, and portfolio purposes.

❤️ Built With

React • TypeScript • Node.js • Express • MongoDB • Socket.IO • WebRTC • Judge0 • RAG • Vector Search • Agentic AI
