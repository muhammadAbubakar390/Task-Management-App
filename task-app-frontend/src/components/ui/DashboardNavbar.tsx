"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardNavbar() {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b flex items-center justify-end px-6">
      <span className="text-sm text-gray-600">
        {user?.email}
      </span>
    </header>
  );
}
