"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewLog() {
  const router = useRouter();
  const params = useSearchParams();

  // read our three URL params
  const presetDramaId = params.get("dramaId");
  const presetTitle = params.get("title") || "";
  const presetPoster = params.get("posterUrl") || "";

  const [dramas, setDramas] = useState<{ id: string; title: string }[]>([]);
  const [dramaId, setDramaId] = useState<string>(presetDramaId || "");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  // if no dramaId in URL, fetch list to choose from
  useEffect(() => {
    if (!presetDramaId) {
      fetch("http://localhost:4000/dramas")
        .then((r) => r.json())
        .then((data) => setDramas(data.map((d: any) => ({ id: d.id, title: d.title }))));
    }
  }, [presetDramaId]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:4000/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dramaId,
        rating,
        comment,
      }),
    });
    router.push("/profile");
  };

  return (
    <main className="min-h-screen bg-[url('/lumeabackground.png')] bg-cover flex items-center justify-center">
      <div className="bg-[#2d3842]/60 p-8 rounded-lg w-full max-w-2xl space-y-6 text-white">
        <h2 className="text-2xl font-bold">Write a log…</h2>

        {presetPoster && (
          <img
            src={presetPoster}
            alt={presetTitle}
            className="w-32 rounded-lg mb-4"
          />
        )}

        {presetTitle ? (
          <p>
            <strong>{presetTitle}</strong>
          </p>
        ) : (
          <select
            className="w-full p-3 rounded bg-gray-700"
            value={dramaId}
            onChange={(e) => setDramaId(e.target.value)}
          >
            <option value="">Select a drama</option>
            {dramas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        )}

        <textarea
          className="w-full h-32 p-3 rounded bg-gray-700"
          placeholder="Add a review…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div>
          <span className="mr-2">Rating:</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className={`px-2 ${rating >= n ? "text-yellow-400" : "text-white"
                }`}
            >
              ★
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-green-500 rounded hover:bg-green-600"
        >
          submit :D
        </button>
      </div>
    </main>
  );
}