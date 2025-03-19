require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const googleImagesRoutes = require('./routes/googleImages');
const gptRoutes = require('./routes/gpt');
const eventRoutes = require('./routes/ticketmaster');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/images', googleImagesRoutes);
app.use('/api/captions', gptRoutes);
app.use('/api/events', eventRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 