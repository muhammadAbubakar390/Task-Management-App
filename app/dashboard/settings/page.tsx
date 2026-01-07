// src/app/dashboard/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
};

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveType, setSaveType] = useState<"success" | "error">("success");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          ...formData,
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    try {
      // Simulate API call - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage (simulating DB update)
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSaveType("success");
      setSaveMessage("Profile updated successfully!");
    } catch (error) {
      setSaveType("error");
      setSaveMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setSaveType("error");
      setSaveMessage("New passwords don't match!");
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setSaveType("error");
      setSaveMessage("Password must be at least 6 characters!");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      // Simulate API call - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, you would send this to your backend
      console.log("Password change request:", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      setSaveType("success");
      setSaveMessage("Password changed successfully!");
    } catch (error) {
      setSaveType("error");
      setSaveMessage("Failed to change password. Please check your current password.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveType === "success" 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Theme & Preferences */}
        <div className="lg:col-span-1 space-y-6">
          {/* Theme Toggle Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Theme Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium dark:text-gray-300">Theme</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors"
                  aria-label="Toggle theme"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>
                  Current theme: <span className="font-medium">{theme === "dark" ? "Dark" : "Light"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Account Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Account Information</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                <p className="font-mono text-sm dark:text-gray-300">{user?.id || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-medium dark:text-gray-300">{user?.role || "USER"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="dark:text-gray-300">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString() 
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile & Password Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Update Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Update Profile</h2>
            
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Update Profile"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Password Change Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Change Password</h2>
            
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter new password"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Changing Password..." : "Change Password"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Danger Zone</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      alert("Account deletion would be processed here. This is a demo.");
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}