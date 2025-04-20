// app/profile/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({ subsets:["latin"], weight:["400","700"], display:"swap" });

interface User { id: number; username: string; bio: string; }

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setUser);
  }, []);

  if (!user) return <p>Loading…</p>;

  return (
    <main className={`${baloo.className} min-h-screen bg-[url('/lumeabackground.png')]`}>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-white text-3xl mb-4">@{user.username}</h1>
        <p className="bg-[#2d3842]/60 p-4 rounded text-white">{user.bio}</p>
        <button
          onClick={() => location.href = "/profile/edit"}
          className="mt-4 px-6 py-2 bg-[#3a4855] text-white rounded"
        >
          Edit Profile
        </button>
      </div>
    </main>
  );
}
