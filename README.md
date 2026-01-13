# Task Management System

A full-stack task management application built with React, Express, and Supabase. Features a Kanban board interface for organizing tasks with drag-and-drop functionality, user authentication, and real-time task updates.

## 🚀 Features

- **User Authentication**: Secure login and signup using Supabase Auth
- **Kanban Board**: Visual task management with three columns (Pending, In Progress, Completed)
- **Drag & Drop**: Intuitive task organization with `@hello-pangea/dnd`
- **RESTful API**: Complete CRUD operations for tasks
- **Row Level Security**: Database-level security ensuring users can only access their own tasks
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **@hello-pangea/dnd** - Drag and drop functionality
- **Axios** - HTTP client
- **Supabase JS** - Authentication and database client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Supabase** - Backend as a Service (Database, Auth, RLS)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)** policies for data isolation

## 📁 Project Structure

```
TaskManagSys/
├── FrontEnd/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── config/          # Configuration files
│   │   │   └── supabaseClient.js
│   │   ├── services/       # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env                 # Frontend environment variables
│
├── Server/                  # Express backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   │   └── taskController.js
│   │   ├── routes/         # API routes
│   │   │   └── taskRoutes.js
│   │   ├── middleware/     # Express middleware
│   │   │   └── authMiddleware.js
│   │   └── config/         # Configuration
│   │       └── supabaseClient.js
│   ├── supabase_schema.sql # Database schema
│   ├── server.js           # Express app entry point
│   ├── package.json
│   └── .env                # Backend environment variables
│
└── README.md               # This file
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Supabase Account** - [Sign up for free](https://supabase.com)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TaskManagSys
```

### 2. Set Up Supabase Database

1. Create a new project in [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor** and run the SQL schema from `Server/supabase_schema.sql`
3. This will create the `tasks` table with Row Level Security policies

### 3. Set Up Backend (Server)

1. Navigate to the Server directory:
   ```bash
   cd Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `Server` directory:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_KEY=your_supabase_anon_key_here
   
   # Server Configuration (optional)
   PORT=3000
   ```

4. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to **Settings** > **API**
   - Copy the **Project URL** → `SUPABASE_URL`
   - Copy the **anon public** key → `SUPABASE_KEY`
   - ⚠️ **Important**: Use the **anon** key (not service_role) to respect RLS policies

5. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000` (or the port specified in `.env`)

### 4. Set Up Frontend (FrontEnd)

1. Open a **new terminal** and navigate to the FrontEnd directory:
   ```bash
   cd FrontEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `FrontEnd` directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

   ⚠️ **Note**: The `VITE_` prefix is required for Vite to expose these variables to client-side code.

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (Vite default port)

### 5. Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Create a new account or sign in
3. Start managing your tasks!

## 🔐 Environment Variables

### Server `.env` Example

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
PORT=3000
```

### FrontEnd `.env` Example

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📡 API Endpoints

All endpoints require authentication via Bearer token in the `Authorization` header.

### Tasks

- `GET /api/tasks` - Get all tasks (optional: `?status=pending|in-progress|completed`)
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "status": "pending",
    "due_date": "2024-01-20T00:00:00Z"
  }
  ```
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## 🗄️ Database Schema

The `tasks` table includes:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `title` (TEXT, Required)
- `description` (TEXT, Optional)
- `status` (TEXT: 'pending', 'in-progress', 'completed')
- `due_date` (TIMESTAMPTZ, Optional)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

Row Level Security (RLS) policies ensure users can only access their own tasks.

## 🛡️ Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) at the database level
- **API Protection**: All task endpoints require valid authentication
- **Environment Variables**: Sensitive data stored in `.env` files (not committed to git)

## 📝 Available Scripts

### Server
- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload

### FrontEnd
- `npm run dev` - Start the Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for backend infrastructure
- [Vite](https://vitejs.dev) for the build tool
- [Tailwind CSS](https://tailwindcss.com) for styling
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag and drop functionality

---

**Happy Task Managing! 🎉**
