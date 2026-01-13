# 🚀 Quick Start Guide - Running & Testing the Project

This guide will walk you through running and testing the Task Management System.

## Prerequisites Checklist

Before starting, make sure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ A Supabase account and project created
- ✅ Database schema executed in Supabase
- ✅ Environment variables configured

## Step-by-Step: Running the Project

### Step 1: Set Up Environment Variables

#### Backend (Server)
1. Navigate to `Server` folder
2. Create a `.env` file with:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_anon_key_here
   PORT=5000
   ```

#### Frontend (FrontEnd)
1. Navigate to `FrontEnd` folder
2. Create a `.env` file with:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Step 2: Install Dependencies

**Terminal 1 - Backend:**
```bash
cd Server
npm install
```

**Terminal 2 - Frontend:**
```bash
cd FrontEnd
npm install
```

### Step 3: Start the Servers

You need **TWO terminal windows** running simultaneously:

#### Terminal 1: Start Backend Server
```bash
cd Server
npm run dev
```

**Expected Output:**
```
🚀 Server is running on http://localhost:5000
📝 Environment: development
```

#### Terminal 2: Start Frontend Server
```bash
cd FrontEnd
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open the Application

1. Open your browser
2. Navigate to: `http://localhost:5173`
3. You should see the login page

## 🧪 Testing the Application

### Test 1: User Registration

1. **Click "Sign up"** or navigate to `/signup`
2. **Fill in the form:**
   - Email: `test@example.com`
   - Password: `password123` (min 6 characters)
   - Confirm Password: `password123`
3. **Click "Sign up"**
4. **Expected Result:**
   - ✅ Redirects to dashboard
   - ✅ No error messages
   - ✅ You're logged in

### Test 2: User Login

1. **Logout** (click logout button)
2. **Navigate to login page** (`/login`)
3. **Enter credentials:**
   - Email: `test@example.com`
   - Password: `password123`
4. **Click "Sign in"**
5. **Expected Result:**
   - ✅ Redirects to dashboard
   - ✅ Shows your email in the navbar

### Test 3: Create a Task (API Test)

**Option A: Using Browser Console**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this JavaScript:
   ```javascript
   // First, get your auth token from Supabase
   // Then test API call
   fetch('http://localhost:5000/api/tasks', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer YOUR_SUPABASE_TOKEN'
     },
     body: JSON.stringify({
       title: 'Test Task',
       description: 'This is a test task',
       status: 'pending',
       due_date: '2024-12-31T00:00:00Z'
     })
   })
   .then(res => res.json())
   .then(data => console.log('Task created:', data))
   .catch(err => console.error('Error:', err));
   ```

**Option B: Using Postman/Thunder Client**
1. Create a new POST request to `http://localhost:5000/api/tasks`
2. Add Header: `Authorization: Bearer YOUR_TOKEN`
3. Add Body (JSON):
   ```json
   {
     "title": "Test Task",
     "description": "This is a test task",
     "status": "pending",
     "due_date": "2024-12-31T00:00:00Z"
   }
   ```
4. Send request
5. **Expected Result:**
   - ✅ Status: 201 Created
   - ✅ Returns task object with id

### Test 4: View Tasks

1. **After logging in**, you should see the Dashboard
2. **If you created tasks via API**, they should appear
3. **Expected Result:**
   - ✅ Tasks are displayed
   - ✅ Empty state shown if no tasks

### Test 5: Kanban Board (If Integrated)

1. **Navigate to the Kanban Board** (if you've added it to Dashboard)
2. **Expected Result:**
   - ✅ Three columns visible: Pending, In Progress, Completed
   - ✅ Tasks appear in correct columns based on status

### Test 6: Drag and Drop (If Kanban Board is Active)

1. **Drag a task card** from one column to another
2. **Drop it** in a different column
3. **Expected Result:**
   - ✅ Task moves immediately (optimistic update)
   - ✅ Task status updates in database
   - ✅ Task stays in new column after page refresh

### Test 7: Update Task Status

**Using API:**
```bash
# Replace TASK_ID and YOUR_TOKEN with actual values
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "in-progress"}'
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Returns updated task object

### Test 8: Delete Task

**Using API:**
```bash
# Replace TASK_ID and YOUR_TOKEN with actual values
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Result:**
- ✅ Status: 200 OK
- ✅ Returns deleted task object

## 🔍 Troubleshooting

### Backend Server Won't Start

**Error: Missing SUPABASE_URL**
- ✅ Check that `.env` file exists in `Server` folder
- ✅ Verify environment variables are set correctly
- ✅ Restart the server after creating `.env`

**Error: Port already in use**
- ✅ Change `PORT` in `Server/.env` to a different port (e.g., 3001)
- ✅ Update frontend API URL in `FrontEnd/src/services/api.js`

**Error: Cannot find module**
- ✅ Run `npm install` in `Server` folder
- ✅ Check `package.json` exists

### Frontend Won't Start

**Error: Missing VITE_SUPABASE_URL**
- ✅ Check that `.env` file exists in `FrontEnd` folder
- ✅ Verify variables start with `VITE_` prefix
- ✅ Restart dev server after creating `.env`

**Error: React is not defined**
- ✅ Run `npm install` in `FrontEnd` folder
- ✅ Check that `@vitejs/plugin-react` is installed

**Blank Page**
- ✅ Open browser DevTools (F12)
- ✅ Check Console tab for errors
- ✅ Verify backend server is running
- ✅ Check network tab for failed API requests

### Authentication Issues

**Error: Invalid or expired token**
- ✅ Make sure you're logged in
- ✅ Try logging out and logging back in
- ✅ Check Supabase credentials in `.env` files

**Error: Unauthorized**
- ✅ Verify Supabase anon key is correct (not service_role key)
- ✅ Check that RLS policies are enabled in Supabase

### API Connection Issues

**Error: Network Error / CORS Error**
- ✅ Verify backend server is running on port 5000
- ✅ Check `FrontEnd/src/services/api.js` has correct baseURL
- ✅ Ensure CORS is enabled in backend (it should be)

**Error: 404 Not Found**
- ✅ Check API endpoint URL is correct
- ✅ Verify route exists in `Server/src/routes/taskRoutes.js`

## ✅ Success Checklist

Your project is working correctly if:

- [ ] Backend server starts without errors
- [ ] Frontend dev server starts without errors
- [ ] You can register a new user
- [ ] You can log in with registered credentials
- [ ] You can create tasks via API
- [ ] You can view tasks in the dashboard
- [ ] Tasks appear in correct Kanban columns (if implemented)
- [ ] Drag and drop updates task status (if implemented)
- [ ] You can update task status via API
- [ ] You can delete tasks via API

## 🎯 Quick Test Script

Run this in your browser console (after logging in) to test all endpoints:

```javascript
// Get your token first (check localStorage or Supabase session)
const token = 'YOUR_TOKEN_HERE';
const baseURL = 'http://localhost:5000/api';

// Test GET tasks
fetch(`${baseURL}/tasks`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(d => console.log('✅ GET tasks:', d))
.catch(e => console.error('❌ GET error:', e));

// Test POST task
fetch(`${baseURL}/tasks`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Test Task',
    description: 'Testing API',
    status: 'pending'
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ POST task:', d);
  const taskId = d.task?.id;
  
  // Test PUT task
  if (taskId) {
    fetch(`${baseURL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'in-progress' })
    })
    .then(r => r.json())
    .then(d => console.log('✅ PUT task:', d))
    .catch(e => console.error('❌ PUT error:', e));
  }
})
.catch(e => console.error('❌ POST error:', e));
```

## 📝 Next Steps

Once everything is working:

1. **Add more features:**
   - Task creation form in UI
   - Task editing functionality
   - Task deletion with confirmation
   - Due date filtering
   - Search functionality

2. **Enhance UI:**
   - Better loading states
   - Error toast notifications
   - Success messages
   - Task detail modal

3. **Deploy:**
   - Deploy backend to services like Railway, Render, or Heroku
   - Deploy frontend to Vercel, Netlify, or GitHub Pages
   - Update environment variables for production

---

**Need Help?** Check the main `README.md` for detailed documentation.
