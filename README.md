# TaskFlow AI - AI Operations Management Platform

TaskFlow AI is a modern, full-stack project and task management platform designed specifically for AI Operations workflows, such as LLM evaluation, data annotation, and model training pipelines.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Admin and Member roles with specific permissions.
- **Dynamic Dashboard**: Real-time analytics, productivity charts, and system status overview.
- **Project Management**: Create, update, and track AI operation pipelines.
- **Kanban Board**: Drag-and-drop task management for efficient workflow transitions.
- **Real-time Notifications**: Alerts for task assignments and project updates.
- **Modern UI/UX**: Dark mode default, glassmorphism, and responsive design using Tailwind CSS.
- **Activity Logs**: Complete audit trail for all system actions.

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js, JWT Authentication.
- **Database**: MongoDB with Mongoose.
- **State Management**: React Context API.

## 📦 Installation

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and add your MongoDB URI and JWT secret.
4. Seed initial demo data: `npm run data:import`
5. Start the server: `npm run server`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install --legacy-peer-deps`
3. Start the development server: `npm run dev`

## 🔑 Demo Accounts

### Admin
- **Email**: admin@taskflow.ai
- **Password**: admin123

### Member
- **Email**: member@taskflow.ai
- **Password**: member123

## 📂 Folder Structure

```text
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth & Error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── utils/          # Seeder and helpers
└── frontend/
    ├── src/
    │   ├── components/ # Shared UI components
    │   ├── context/    # Auth & Theme state
    │   ├── layouts/    # Page wrappers
    │   ├── pages/      # View components
    │   ├── services/   # API client
    │   └── utils/      # Helpers
```

## 📄 License
MIT
