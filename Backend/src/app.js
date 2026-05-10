const express = require ('express');
const cors = require ('cors');
const path = require('path');

const app = express(); 
app.use (express.json());


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://memo-ai-rosy.vercel.app",
  "https://memoai-m7ho.onrender.com"
];


app.use(cors({
  origin: function (origin, callback) {
    // Allow local development and any vercel deployment
    if (!origin || 
        origin.startsWith("http://localhost") ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200
}));


// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//Test route to confirm 
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

//Auth routes
const authRoutes = require('./routes/auth.route');
app.use('/api/auth', authRoutes);

//User routes
const userRoutes = require('./routes/user.route');
app.use('/api/user', userRoutes);

//Todo routes
const userTodoRoutes = require('./routes/userTodos.route');
app.use('/api/todos', userTodoRoutes);

//Notification routes
const notificationRoutes = require('./routes/notification.route');
app.use('/api/notifications', notificationRoutes);

//Recording routes
const recordingRoutes = require('./routes/recordings.route');
app.use('/api/recordings', recordingRoutes);

module.exports = app;