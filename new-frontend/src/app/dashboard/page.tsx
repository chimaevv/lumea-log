"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getTopRatedKdramas,
  getPopularKdramas,
  Drama,
} from "../../lib/tmdb";

function CarouselRow({
  title,
  fetcher,
}: {
  title: string;
  fetcher: () => Promise<Drama[]>;
}) {
  const [items, setItems] = useState<Drama[]>([]);

  useEffect(() => {
    fetcher().then(setItems).catch(console.error);
  }, [fetcher]);

  const scroll = (dir: "left" | "right") => {
    const row = document.getElementById(title);
    if (!row) return;
    row.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bakbak text-white">{title}</h2>
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-80 transition"
        >
          ←
        </button>
        <div
          id={title}
          className="flex space-x-4 overflow-x-auto py-2 scroll-smooth"
        >
          {items.map((d) => (
            <div key={d.id} className="w-48 shrink-0">
              <Link href={`/drama/${d.id}`}>
                {d.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${d.poster_path}`}
                    alt={d.name}
                    width={300}
                    height={450}
                    className="rounded-lg cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-[300px] bg-gray-700 rounded-lg flex items-center justify-center text-white cursor-pointer">
                    No Image
                  </div>
                )}
              </Link>
              <h3 className="mt-2 text-lg font-baloo text-white">
                <Link href={`/drama/${d.id}`}>{d.name}</Link>
              </h3>
              <p className="text-sm text-gray-300">
                ⭐ {d.vote_average.toFixed(1)} ({d.vote_count})
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-80 transition"
        >
          →
        </button>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  return (
    <main className="p-8 bg-[url('/lumeabackground.png')] bg-cover min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        <CarouselRow title="Top Rated K‑Dramas" fetcher={getTopRatedKdramas} />
        <CarouselRow title="Popular K‑Dramas" fetcher={getPopularKdramas} />
      </div>
    </main>
  );
}
