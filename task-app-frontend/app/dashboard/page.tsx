"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task } from "@/types/task";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks, isTasksLoaded] = useLocalStorage<Task[]>("tasks", []);

  const handleCreateTask = () => {
    router.push("/dashboard/tasks");
  };

  const handleViewTasks = () => {
    router.push("/dashboard/tasks");
  };

  const handleTaskClick = () => {
    router.push("/dashboard/tasks");
  };

  if (!isTasksLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  const taskCount = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === "PENDING").length;
  const completedTasks = tasks.filter(task => task.status === "COMPLETED").length;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Optional: Sign Up Banner - Only show if no tasks */}
      {taskCount === 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">Want more features?</h3>
              <p className="text-gray-600 text-sm">Sign up for a full account to save tasks across devices</p>
            </div>
            <Link 
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium transition-colors whitespace-nowrap"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasks Card */}
        <div 
          onClick={handleViewTasks}
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Tasks</h3>
              <p className="text-gray-600 text-sm">
                {taskCount === 0 
                  ? "No tasks yet" 
                  : `${taskCount} total task${taskCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            <div className={`text-lg font-bold ${
              taskCount === 0 ? 'text-gray-400' : 'text-blue-600'
            }`}>
              {taskCount}
            </div>
          </div>
          
          {taskCount > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending:</span>
                <span className="font-medium text-yellow-600">{pendingTasks}</span>
              </div>
              {completedTasks > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">{completedTasks}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Notifications</h3>
          <div className="space-y-3">
            {taskCount === 0 ? (
              <p className="text-gray-600 text-sm">No notifications</p>
            ) : (
              <>
                {pendingTasks > 0 && (
                  <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded border border-yellow-100">
                    <div className="w-2 h-2 mt-1.5 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        You have {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}
                {completedTasks > 0 && (
                  <div className="flex items-start space-x-2 p-3 bg-green-50 rounded border border-green-100">
                    <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {completedTasks} task{completedTasks !== 1 ? 's' : ''} completed
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handleCreateTask}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors cursor-pointer"
            >
              Create New Task
            </button>
            
            {taskCount > 0 && (
              <button
                onClick={handleViewTasks}
                className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium transition-colors cursor-pointer"
              >
                View All Tasks
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks Section */}
      {tasks.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Recent Tasks</h3>
            <button
              onClick={handleViewTasks}
              className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div 
                key={task.id} 
                onClick={handleTaskClick}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    task.status === "COMPLETED" ? "bg-green-500" : "bg-yellow-500"
                  }`}></div>
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {task.description.length > 60 
                          ? `${task.description.substring(0, 60)}...` 
                          : task.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    task.status === "COMPLETED" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {tasks.length > 5 && (
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                ... and {tasks.length - 5} more task{tasks.length - 5 !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="mt-8 bg-white p-8 rounded-lg shadow text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first task. Click "Create New Task" above to begin.
            </p>
            <button
              onClick={handleCreateTask}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
            >
              Create Your First Task
            </button>
          </div>
        </div>
      )}
    </>
  );
}