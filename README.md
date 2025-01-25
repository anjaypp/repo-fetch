# repo-fetch

## Overview

MERN stack application for managing and exploring GitHub user data with comprehensive backend and frontend features.

## Features

### Backend
- GitHub user data retrieval and caching
- Mutual followers identification
- Advanced user search
- Soft user record deletion
- Flexible user data updates
- Sorted user list generation

### Frontend
- GitHub username-based user exploration
- Repository listing and details
- Followers tracking
- Seamless page navigation

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- GitHub API integration

#### Dependencies
- `axios`: API requests
- `mongoose`: Database interactions
- `express`: Web server
- `dotenv`: Environment configuration
- `cors`: Cross-origin resource sharing
- `morgan`: Request logging
- `nodemon`: Development server auto-reload

### Frontend
- React.js
- React Router
- Vite

#### Dependencies
- `react`: UI library
- `react-router-dom`: Navigation
- `react-icons`: Icon library

## Project Setup

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/anjaypp/repo-fetch.git
   cd repo-fetch
   ```

2. Backend setup:
   ```bash
   cd server
   npm install nodemon --save-dev
   npm install
   ```

3. Frontend setup:
   ```bash
   cd client
   npm install
   ```

4. Configure environment:
   Create `.env` in `server` directory:
   ```env
   PORT=4000
   MONGO_URI=<MongoDB Connection String>
   GITHUB_TOKEN=<GitHub Personal Access Token>
   ```

5. Update `package.json` scripts:
   ```json
   "scripts": {
     "start": "nodemon src/server.js",
     "dev": "nodemon src/server.js"
   }
   ```

6. Optional: Create `nodemon.json`:
   ```json
   {
     "watch": ["src"],
     "ext": "js",
     "ignore": ["src/tests"]
   }
   ```

7. Run application:
   ```bash
   # Start backend
   cd server
   nodemon src/server.js

   # Start frontend
   cd client
   npm run dev
   ```

## API Endpoints

### User Management
- `POST /api/v1/users/:username`: Add/retrieve user
- `GET /api/v1/users/:username/friends`: Find mutual followers
- `GET /api/v1/users/search`: Search users
- `DELETE /api/v1/users/:username`: Soft delete user
- `PUT /api/v1/users/:username`: Update user details
- `GET /api/v1/users`: Retrieve sorted user list

### Repository Management
- `POST /api/v1/users/:username`: Fetch repositories
- `GET /api/v1/users/:username/:reponame`: Get repository details

## Project Structure
```
repo-fetch/
│
├── server/
│   └── src/
│       ├── config
│       ├── middleware
│       ├── models/
│       ├── routes/
│       ├── controllers/
│        ├── util/
│       └── server.js
│
└── client/
    └── src/
        ├── components/
        ├── pages/
        └── App.js
```

## Contributing
- Follow project coding standards
- Submit pull requests with clear descriptions
- Include relevant tests

## License
MIT License
