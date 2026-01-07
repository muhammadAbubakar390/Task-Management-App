"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TaskCard from "@/components/ui/TaskCard";
import { Task } from "@/types/task";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks, isTasksLoaded] = useLocalStorage<Task[]>("tasks", []);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle("");
    setDescription("");
    
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 50);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const clearAllTasks = () => {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTasks([]);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (!isTasksLoaded) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Updated Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-gray-600">Create and manage your tasks</p>
        </div>
        
        <div className="flex items-center gap-4">
          {tasks.length > 0 && (
            <>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={clearAllTasks}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* CREATE TASK FORM */}
      <form
        onSubmit={handleAddTask}
        className="bg-white p-4 rounded-lg shadow mb-6 space-y-3"
      >
        <input
          ref={titleInputRef}
          className="w-full border rounded px-3 py-2"
          placeholder="Task title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setDescription("");
              titleInputRef.current?.focus();
            }}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No tasks created yet.</p>
          <p className="text-gray-400 mb-6">Create your first task using the form above!</p>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
          
          <div className="mt-6 text-center text-gray-500 text-sm">
            Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
}