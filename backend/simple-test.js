const express = require('express');
const app = express();
const PORT = 5001; // Use different port

// Simple route that MUST work
app.get('/api/test-db', (req, res) => {
  console.log('Route hit!');
  res.json({ message: 'This route works' });
});

// Catch-all 404
app.use((req, res) => {
  console.log('404:', req.method, req.path);
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.listen(PORT, () => {
  console.log(`Test server on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/test-db`);
});