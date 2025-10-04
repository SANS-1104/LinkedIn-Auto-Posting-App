## Backend Folder Structure

backend/
├── config/
│   └── db.js                        # MongoDB connection logic
│   └── generateImage.js  
│   └── googleClient.js  
│
├── controllers/
│   ├── authController.js           # Handles signup, login, profile, preferences
│   └── blogController.js           # Blog generation + auto-post to LinkedIn
|   └── linkedinController.js
|   └── analyticsController.js
|   └── scheduleController.js
│
├── middleware/
│   └── authMiddleware.js           # JWT token verification
│
├── models/
│   └── User.js                     # User schema (name, email, password, LinkedIn info)
│   └── Blog.js
│   └── ScheduledPost.js
│
├── routes/
│   ├── auth.js                     # /api/auth routes (signup, login, profile, prefs)
│   └── blog.js                     # /api routes (generate blog, LinkedIn post)
│   └── googleAuth.js
│
├── scheduler/
│   ├── agenda.js  
|
├── utils/
│   ├── fetchLinkedInAnalytics.js
│   └── postToLinkedIn.js   
|
├── .env                            # Environment variables (DB URI, JWT secret, etc.)
├── index.js                        # Express server entry point
├── package.json                    # Project dependencies and scripts
└── README.md                       # (optional) Setup instructions or project docs


## What Each Folder Does?

---------------------------------------------------------------------------------
| Folder/File      | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `config/db.js`   | Connects to MongoDB using credentials from `.env`          |
| `controllers/`   | Contains logic for auth and blog routes                    |
| `middleware/`    | Contains `authMiddleware.js` to protect routes             |
| `models/User.js` | Defines user schema including LinkedIn fields              |
| `routes/auth.js` | Route handlers for login, signup, user preferences         |
| `routes/blog.js` | Route handlers for blog generation & LinkedIn post         |
| `.env`           | Stores secret keys, DB URI, API keys                       |
| `index.js`       | Sets up Express app, middleware, routes, and DB connection |
---------------------------------------------------------------------------------


