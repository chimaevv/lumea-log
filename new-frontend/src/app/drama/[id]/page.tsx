import Image from "next/image";
import Link from "next/link";
import { getDramaDetails } from "../../../lib/tmdb";

export const revalidate = 3600; // cache for an hour

export default async function DramaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const drama = await getDramaDetails(id);

  // build full poster URL (if available)
  const posterUrl = drama.poster_path
    ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
    : "";

  return (
    <main className="p-8 bg-[url('/lumeabackground.png')] bg-cover min-h-screen text-white">
      <div className="max-w-4xl mx-auto bg-[#2d3842]/60 p-6 rounded-lg space-y-4">
        <Link href="/dashboard" className="text-gray-400 hover:underline">
          ← Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={drama.name}
              width={300}
              height={450}
              className="rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-48 h-72 bg-gray-700 rounded-lg flex items-center justify-center">
              No Image
            </div>
          )}

          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold">{drama.name}</h1>
            <p className="text-gray-300">{drama.overview}</p>
            <p className="text-xl">
              ⭐ {drama.vote_average.toFixed(1)} ({drama.vote_count} reviews)
            </p>

            <Link
              href={`/log/new?dramaId=${drama.id
                }&title=${encodeURIComponent(drama.name)
                }&posterUrl=${encodeURIComponent(posterUrl)}`}
              className="inline-block px-6 py-3 bg-green-500 rounded hover:bg-green-600"
            >
              Write a log
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
