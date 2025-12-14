🚀 REPOINSIGHT

Transforming Code Quality Into a Competitive Edge

An AI-powered full-stack platform that analyzes, visualizes, and improves GitHub repositories using intelligent insights, interactive dashboards, and detailed reports.

🛠️ Built With
Frontend

React

Vite

Chart.js

Axios

Socket.io

date-fns

PostCSS

Autoprefixer

Backend

Node.js

Express

MongoDB

Mongoose

OpenAI API

Cheerio

Tooling & Standards

ESLint

npm

JavaScript

Markdown

JSON

dotenv (.env)

Semantic Versioning (SemVer)

Nodemon

🌟 Overview

RepoInsight is a powerful developer-focused tool designed to analyze code repositories and provide meaningful insights to improve code quality, maintainability, and team productivity.

It brings together repository analytics, AI recommendations, and visual dashboards into one unified platform.

❓ Why RepoInsight?

This project aims to enhance code quality and developer collaboration by offering:

Automated repository health checks

AI-driven recommendations

Clear visual metrics and analytics

Professional reports for sharing and review

✨ Key Features
🤖 AI Insights & Recommendations

Code quality evaluation

Improvement suggestions

AI-generated project roadmaps

📊 Interactive Dashboards

Repository health metrics

Commit activity trends

Visual charts, badges, and summaries

🔗 GitHub Integration

Repository URL validation

Live data fetching from GitHub

Project health monitoring

📄 Report Export & Sharing

Export reports as PDF / JSON

Share reports via links or email

🌐 Live Application
🔹 Frontend (Vercel)

👉 https://repo-insight-f7tnqmkkq-kumaran2048s-projects.vercel.app/

🔹 Backend (Render)

👉 https://your-backend.onrender.com

📁 Project Structure
RepoInsight/
│
├── frontend/                # React + Vite (Vercel)
│   ├── public/
│   ├── src/
│   │   ├── api/              # Axios API calls
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Report.jsx
│   │   │   └── NotFound.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json          # React Router redirect config
│   └── package.json
│
├── backend/                 # Express + MongoDB (Render)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md

🔁 Vercel Redirect Configuration (IMPORTANT)

To ensure correct routing when:

Refreshing pages

Opening /dashboard or /report directly

Sharing links

Create the following file:

📄 frontend/vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}


✅ Prevents 404 errors
✅ Ensures React Router works correctly

🔀 Routing Setup (React)
src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Report from "../pages/Report";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

⚙️ Environment Variables
Frontend (frontend/.env)
VITE_API_BASE_URL=https://your-backend.onrender.com

Backend (backend/.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=https://repo-insight-f7tnqmkkq-kumaran2048s-projects.vercel.app

🧪 Local Development
1️⃣ Clone the Repository
git clone https://github.com/Kumaran2048/Repolnsight
cd Repolnsight

2️⃣ Run Frontend
cd frontend
npm install
npm run dev

3️⃣ Run Backend
cd backend
npm install
npm run dev

📌 Future Enhancements

Role-based access (Admin / User)

Repository comparison

CI/CD integration

Team collaboration insights

More AI-driven analytics

🧑‍💻 Author

Kumaran S
GitHub: https://github.com/Kumaran204
