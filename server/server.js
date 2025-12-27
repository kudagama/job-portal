const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- 1. CORS Configuration (Updated) ---

const allowedOrigins = [
  "https://job-portal-ejam.vercel.app",
  "https://job-portal-ruddy-xi.vercel.app",
  "http://localhost:5173", 
  "http://localhost:5000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman හෝ Server-to-Server calls (origin නැති) වලට ඉඩ දෙන්න
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // Logs වල බලාගන්න පුළුවන් කවුද Block වුනේ කියලා
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// --- 2. Handle Preflight Requests Explicitly ---
// "Response to preflight request doesn't pass access control check" දෝෂය නවත්වන්න මේක උදව් වෙනවා.
app.options(/.*/, cors());

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

// Local Development සඳහා පමණක් Port Listen කරන්න
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Vercel සඳහා Export කිරීම
module.exports = app;