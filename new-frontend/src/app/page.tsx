// src/app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl mb-8">Welcome to Lumea Log</h1>
      <div className="space-x-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 bg-green-600 rounded hover:bg-green-700"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
