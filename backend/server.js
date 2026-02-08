const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const setAvailabilityRoute = require('./routes/setAvailability');

require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/set-availability', setAvailabilityRoute);


// Health check (VERY IMPORTANT for Render testing)
app.get('/', (req, res) => {
  res.send('Holisol backend is running 🚀');
});

// Environment variables (NO FALLBACK)
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not defined');
  process.exit(1);
}

// Connect DB & start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
