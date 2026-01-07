const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const Task = require('./models/Task');

const app = express();

console.log('=== Debug: Testing route registration ===');

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================
app.get('/api/debug-test/:id', (req, res) => {
  console.log('Debug route hit with id:', req.params.id);
  res.json({ debug: true, id: req.params.id });
});

console.log('Debug route registered: GET /api/debug-test/:id');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Test database
app.get('/api/test-db', async (req, res) => {
  try {
    const taskCount = await Task.count();
    res.json({
      message: 'Database is working',
      taskCount: taskCount,
      tableExists: true
    });
  } catch (error) {
    res.json({
      message: 'Database error',
      error: error.message,
      tableExists: false
    });
  }
});

// Get single task by ID - MUST come BEFORE /api/tasks
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    }
    
    res.json({
      message: 'Task retrieved successfully',
      task: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      error: 'Failed to fetch task',
      message: error.message
    });
  }
});

// Get all tasks - MUST come AFTER /api/tasks/:id
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({
      message: 'Tasks retrieved successfully',
      tasks: tasks
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch tasks',
      message: error.message
    });
  }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title is required'
      });
    }
    
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || null,
      status: status === 'COMPLETED' ? 'COMPLETED' : 'PENDING'
    });
    
    res.status(201).json({
      message: 'Task created successfully',
      task: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      error: 'Failed to create task',
      message: error.message
    });
  }
});

// Update task by ID
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    // Find the task
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    }
    
    // Update fields if provided
    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Title cannot be empty'
        });
      }
      task.title = title.trim();
    }
    
    if (description !== undefined) {
      task.description = description?.trim() || null;
    }
    
    if (status !== undefined && ['PENDING', 'COMPLETED'].includes(status)) {
      task.status = status;
    }
    
    await task.save();
    
    res.json({
      message: 'Task updated successfully',
      task: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      error: 'Failed to update task',
      message: error.message
    });
  }
});

// Delete task by ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the task
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Task not found'
      });
    }
    
    // Delete the task
    await task.destroy();
    
    res.json({
      message: 'Task deleted successfully',
      deletedTaskId: id
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      error: 'Failed to delete task',
      message: error.message
    });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - MUST be LAST route
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method 
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`=== Server Starting ===`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`CORS Origin: ${process.env.CORS_ORIGIN}`);
  
  // Test database connection
  await testConnection();
  
  // Sync database
  try {
    await sequelize.sync();
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
  }
  
  console.log(`=== Server Ready ===`);
  console.log(`Test debug route: http://localhost:${PORT}/api/debug-test/123`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Test DB: http://localhost:${PORT}/api/test-db`);
  console.log(`Tasks: http://localhost:${PORT}/api/tasks`);
  console.log(`Single Task: http://localhost:${PORT}/api/tasks/:id`);
  console.log(`Create: POST http://localhost:${PORT}/api/tasks`);
  console.log(`Update: PUT http://localhost:${PORT}/api/tasks/:id`);
  console.log(`Delete: DELETE http://localhost:${PORT}/api/tasks/:id`);
});