# Reddit Clone

A full-stack Reddit-like community platform with posts, comments, voting, and search functionality.

## Features

- 🔐 User authentication (signup/login with JWT)
- 📝 Create, read, update, delete posts
- 💬 Nested comments system
- ⬆️⬇️ Upvote/downvote posts and comments
- 🔍 Search posts by title, content, community, or author
- 🏘️ Community-based organization
- 📱 Responsive design

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Lucide React (icons)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/daconio/antigravity_reddit.git
cd antigravity_reddit
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
```

4. Set up environment variables

Create `server/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/reddit-clone
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=5001
```

5. Start MongoDB (if running locally)
```bash
mongod
```

6. Start the backend server
```bash
cd server
npm run dev
```

7. Start the frontend development server
```bash
# In the project root
npm run dev
```

8. Open http://localhost:5173

## Deployment

### Environment Variables

#### Backend (Railway)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reddit-clone
JWT_SECRET=your-production-secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app
```

### Deploy to Production

1. **Database**: Create a MongoDB Atlas cluster
2. **Backend**: Deploy to Railway
   - Connect GitHub repository
   - Set root directory to `/server`
   - Add environment variables
3. **Frontend**: Deploy to Vercel
   - Connect GitHub repository
   - Add environment variables
   - Auto-deploy on push

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/search?q=query` - Search posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `POST /api/posts/:id/vote` - Vote on post (auth required)

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)
- `POST /api/comments/:id/vote` - Vote on comment (auth required)

## Project Structure

```
antigravity_reddit/
├── public/              # Static files
├── server/             # Backend code
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   └── routes/         # API routes
├── src/                # Frontend code
│   ├── components/     # React components
│   ├── context/        # Context providers
│   ├── pages/          # Page components
│   └── config.js       # API configuration
└── vercel.json         # Vercel deployment config
```

## License

ISC

## Author

daconio
