// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export const taskService = {
  // Get all tasks
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const data = await response.json();
    return data.tasks;
  },

  // Get single task
  async getTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch task');
    const data = await response.json();
    return data.task;
  },

  // Create task
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    const data = await response.json();
    return data.task;
  },

  // Update task
  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to update task');
    const data = await response.json();
    return data.task;
  },

  // Delete task
  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },
};