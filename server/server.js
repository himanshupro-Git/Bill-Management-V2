const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bill Manager API is running',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});