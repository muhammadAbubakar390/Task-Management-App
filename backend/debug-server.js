const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log('=== Step 1: Testing database imports ===');

try {
  console.log('1. Trying to load database config...');
  const { sequelize, testConnection } = require('./config/database');
  console.log('✅ Database config loaded');
} catch (error) {
  console.log('❌ Database config error:', error.message);
  process.exit(1);
}

try {
  console.log('2. Trying to load Task model...');
  const Task = require('./models/Task');
  console.log('✅ Task model loaded');
} catch (error) {
  console.log('❌ Task model error:', error.message);
  process.exit(1);
}

console.log('=== Step 2: Starting server ===');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'With DB imports' });
});

// Test DB route WITH async but simple
app.get('/api/test-db', async (req, res) => {
  console.log('Test DB route called');
  try {
    const Task = require('./models/Task');
    const count = await Task.count();
    res.json({ 
      message: 'Database query successful', 
      count: count 
    });
  } catch (error) {
    res.json({ 
      message: 'Database query failed', 
      error: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

const PORT = 5002;
app.listen(PORT, async () => {
  console.log(`Server on port ${PORT}`);
  console.log('=== Step 3: Testing database connection ===');
  
  try {
    const { sequelize, testConnection } = require('./config/database');
    await testConnection();
    
    // Sync database
    await sequelize.sync();
    console.log('✅ Database synced');
  } catch (error) {
    console.log('❌ Database sync error:', error.message);
  }
});