import axios from 'axios';
import { Task } from '../pages/Tasks';

const API_URL = 'http://localhost:5000/api/tasks';

// Fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export interface NewTask {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

// Create a new task
export const createTask = async (taskData: NewTask): Promise<Task> => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

// Update a task
export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await axios.put(`${API_URL}/${id}`, taskData);
  return response.data;
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const toggleComplete = async (id: string, completed: boolean) => {
  const response = await axios.put(`${API_URL}/${id}`, { completed });
  return response.data;
}

