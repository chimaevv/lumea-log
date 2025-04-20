// app/profile/edit/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Baloo_2 } from "next/font/google";
import { useRouter } from "next/navigation";

const baloo = Baloo_2({ subsets:["latin"], weight:["400","700"], display:"swap" });

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(user => {
        setUsername(user.username);
        setBio(user.bio);
      });
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:4000/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, bio }),
    });
    router.push("/profile");
  };

  return (
    <main className={`${baloo.className} min-h-screen bg-[url('/lumeabackground.png')]`}>
      <div className="max-w-md mx-auto p-6 bg-[#2d3842]/60 rounded">
        <input
          className="w-full mb-4 p-3 rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <textarea
          className="w-full mb-4 p-3 rounded"
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="w-full py-2 bg-[#3a4855] text-white rounded"
        >
          Update
        </button>
      </div>
    </main>
  );
}
