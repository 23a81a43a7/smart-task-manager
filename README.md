# Smart Task Manager AI

Smart Task Manager AI is a comprehensive production-ready web application designed and built with a modern stack:
React (TypeScript, Zustand, TailwindCSS, Framer Motion) on the frontend, and Node.js (Express, TypeScript, MongoDB) on the backend.

## Features
- **User Authentication**: JWT-based login/signup, password hashing with bcrypt
- **Task Management**: CRUD tasks, priority levels, due dates, filtering, search
- **AI Task Suggestions**: Automatically generates tasks based on provided prompts
- **Elegant UI**: Modern Glassmorphism layout with Framer Motion animations and Dark mode toggle
- **Swagger Documentation**: Live API documentation endpoints.

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a cloud URI)
- Docker & Docker Compose (for containerized deployment)

## Setup Instructions

### Environment Variables
1. Navigate to the `server` directory.
2. The `.env.example` has been provided. Create a `.env` file based on it:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### Running Locally (Without Docker)

**Backend:**
1. `cd server`
2. `npm install`
3. `npm run dev` (Runs on http://localhost:5000)

**Frontend:**
1. `cd client`
2. `npm install`
3. `npm run dev` (Runs on http://localhost:5173)

### Running with Docker Compose (Production Ready)
From the root directory:
```bash
docker-compose up --build -d
```
- Frontend will be accessible on `http://localhost:80`
- Backend on `http://localhost:5000`
- MongoDB on `http://localhost:27017`

## API Testing Examples (cURL)

**1. Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "password123"}'
```
*(Extract the `token` from the response for subsequent requests)*

**3. Create a Task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <YOUR_TOKEN>" \
-d '{"title": "Buy groceries", "priority": "High"}'
```

**4. Generate AI Task Suggestion:**
```bash
curl -X POST http://localhost:5000/api/ai/suggest-tasks \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <YOUR_TOKEN>" \
-d '{"prompt": "Plan my weekend trip"}'
```

For more API details, visit the Swagger UI at `http://localhost:5000/api-docs` when the backend is running.
