const express = require('express');
const app = express();

// Test specific route first
app.get('/api/tasks/:id', (req, res) => {
  console.log('Single task route hit:', req.params.id);
  res.json({ message: 'Single task route works', id: req.params.id });
});

// Then general route
app.get('/api/tasks', (req, res) => {
  console.log('All tasks route hit');
  res.json({ message: 'All tasks route works', tasks: [] });
});

// Delete route
app.delete('/api/tasks/:id', (req, res) => {
  console.log('Delete route hit:', req.params.id);
  res.json({ message: 'Delete route works', id: req.params.id });
});

// 404 handler
app.use((req, res) => {
  console.log('404:', req.method, req.path);
  res.status(404).json({ error: 'Not found', path: req.path });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server on port ${PORT}`);
  console.log('Test: http://localhost:5001/api/tasks/123');
  console.log('Test: http://localhost:5001/api/tasks');
});