// src/app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Task App</h1>
      <p className="text-gray-600 mb-8">Manage your tasks efficiently</p>
      
      <div className="space-y-4">
        {/* Use Link for client-side navigation */}
        <Link 
          href="/login"
          className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
        >
          Login
        </Link>
        
        {/* Or use button with router.push */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}