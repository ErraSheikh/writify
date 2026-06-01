# Writify - MERN Blog Platform

## Overview

Writify is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) blogging platform that allows users to create, publish, and manage blogs. Users can register, log in, write articles using a rich text editor, like blogs, save blogs for later reading, comment on posts, and manage their profiles. An admin dashboard is also included for platform management.


## Features

### User Features

* User Registration and Login
* JWT Authentication & Authorization
* Create, Edit, and Delete Blogs
* Rich Text Blog Editor
* Upload Blog Thumbnails
* Like and Unlike Blogs
* Save/Bookmark Blogs
* Comment on Blogs
* User Profile Management
* View Other User Profiles
* Search Blogs
* Browse Blogs by Category
* View Related Blogs
* View Recent Blogs

## Live Demo

### Frontend (Vercel)

https://writify-mnu6.vercel.app

### Backend API (Railway)

https://writify-production-2685.up.railway.app

### Working Application

https://writify-mnu6.vercel.app


### Admin Features

* View All Users
* Delete Users
* View All Blogs
* Delete Blogs
* View All Comments
* Delete Comments
* Dashboard Statistics

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* Axios
* React Quill New
* Context API
* CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* Multer
* CORS
* dotenv

### Deployment

* Frontend: Vercel
* Backend: Railway
* Database: MongoDB Atlas

---

## Project Structure

```text
writify/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env
    └── package.json
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/ErraSheikh/writify.git
cd writify
```


### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
node server.js
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

## API Routes

### Authentication

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/users
* DELETE /api/auth/users/:id
* PUT /api/auth/profile
* GET /api/auth/profile/:id

### Blogs

* GET /api/blogs
* GET /api/blogs/:id
* POST /api/blogs
* PUT /api/blogs/:id
* DELETE /api/blogs/:id
* PUT /api/blogs/:id/like
* PUT /api/blogs/:id/save
* GET /api/blogs/search
* GET /api/blogs/recent

### Comments

* GET /api/comments/:blogId
* POST /api/comments/:blogId
* DELETE /api/comments/:id
* GET /api/comments/all

---

## Authentication Flow

1. User registers or logs in.
2. Backend validates credentials.
3. JWT token is generated.
4. Token is stored in localStorage.
5. Axios automatically sends token in Authorization headers.
6. Protected routes verify the token before granting access.

---

## File Upload System

Writify uses Multer for image uploads.

* Blog thumbnails can be uploaded.
* Profile images can be uploaded.
* Images are stored inside the `uploads` directory.
* Uploaded files are served as static resources by Express.

---

## Deployment

### Frontend

Deployed on Vercel.

### Backend

Deployed on Railway.

### Database

Hosted on MongoDB Atlas.

The backend is configured using CORS to allow requests from both the deployed frontend and localhost for development purposes.

---

## Challenges Faced

### React Quill Compatibility Issue

React 19 removed support for `findDOMNode`, causing the original `react-quill` package to crash.

#### Solution

* Removed `react-quill`
* Installed `react-quill-new`
* Updated editor imports
* Maintained the same editor functionality

### Deployment Build Errors

Vercel treated ESLint warnings as build failures.

#### Solution

```env
CI=false
DISABLE_ESLINT_PLUGIN=true
```

This allowed successful frontend deployment.

---

## Future Enhancements

* Blog Categories Management
* Blog Analytics
* Email Notifications
* User Following System
* Dark Mode
* Richer Text Formatting Options
* Blog Draft Saving
* Real-Time Notifications

---

## Author

Developed as a MERN Stack Web Development Project using MongoDB, Express.js, React.js, and Node.js.
