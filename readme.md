DevNote – MERN Notes App Documentation
Project Overview

DevNote is a full-stack notes application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to signup, login, and manage personal notes with features like add, edit, delete, and view notes. The app also includes dark mode toggle for better UI experience.

Tech Stack

Frontend: React, React Router DOM, Bootstrap, Axios

Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

Authentication: JWT (JSON Web Token)

Styling: Bootstrap 5, optional dark mode toggle

Project Structure
devnote/
│
├── server/                  # Backend
│   ├── index.js             # Entry point
│   ├── routes/
│   │   ├── auth.js          # Signup/Login routes
│   │   └── Notes.js         # CRUD routes for notes
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Note.js          # Note schema
│   └── middleware/
│       └── auth.js          # JWT verification middleware
│
├── client/                  # Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Notes.jsx    # Notes management page
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   └── App.jsx
│   └── package.json
│
└── .env                     # Environment variables (MONGO_URI, JWT_SECRET, PORT)

Backend Setup
1. Install Dependencies
cd server
npm install express mongoose dotenv cors bcryptjs jsonwebtoken

2. Environment Variables

Create a .env file in server/:

MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret_key>
PORT=5000

3. Start Backend Server
npm run dev  # using nodemon
# or
node index.js


Server listens on http://localhost:5000

Test with Thunder Client/Postman: GET /api/notes → should return 401 Unauthorized without token.

Frontend Setup
1. Install Dependencies
cd client
npm install

2. Start Frontend
npm run dev


Opens URL like http://localhost:5173 in browser.

Features
1. User Authentication

Signup: /signup

Input: name, email, password

Password is hashed using bcrypt.

JWT token returned upon success.

Login: /login

Input: email, password

Returns JWT token, userId, name.

Protected Routes:

Notes page (/notes) and Profile (/profile) are protected via ProtectedRoute component.

JWT token stored in localStorage and sent in request headers.

2. Notes Management

CRUD operations (Create, Read, Update, Delete) using REST API:

Method	Endpoint	Description	Protected
GET	/api/notes	Get all notes for logged-in user	✅
POST	/api/notes	Add a new note	✅
PUT	/api/notes/:id	Update a note by ID	✅
DELETE	/api/notes/:id	Delete a note by ID	✅

Only the owner of the note can update/delete it.

Notes are sorted by creation date descending.

3. Dark Mode Toggle

On Notes page, a button toggles dark/light theme.

Uses a darkMode state in Notes.jsx.

Example:

<button onClick={() => setDarkMode(!darkMode)}>
  {darkMode ? "Light Mode" : "Dark Mode"}
</button>

4. Frontend Routing
<Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
</Routes>


ProtectedRoute checks if token exists; redirects to login if not.

How to Test the App

Start backend: npm run dev in server/

Start frontend: npm run dev in client/

Signup a user → stores JWT

Login → redirects to /notes

Add/Edit/Delete notes → changes persist in MongoDB

Toggle Dark Mode → UI updates

Check JWT protection: remove token → /notes redirects to login

Best Practices / Notes

JWT secret should be secure and not committed to GitHub.

MongoDB connection string can include username/password.

Dark mode can be persisted in localStorage for future sessions.

Use .env and dotenv for environment variables.

