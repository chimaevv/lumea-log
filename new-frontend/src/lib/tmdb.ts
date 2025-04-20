// src/lib/tmdb.ts
import qs from "qs";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!;
if (!API_KEY) throw new Error("Missing NEXT_PUBLIC_TMDB_API_KEY");
const API_TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN!;
if (!API_TOKEN) throw new Error("Missing NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN");

function buildUrl(path: string, params: Record<string, any> = {}) {
  const query = qs.stringify({ api_key: API_KEY, ...params });
  return `https://api.themoviedb.org/3${path}?${query}`;
}

export interface Drama {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  overview: string;
}

export async function getTopRatedKdramas(): Promise<Drama[]> {
  const res = await fetch(
    buildUrl("/discover/tv", {
      with_original_language: "ko",
      sort_by: "vote_average.desc",
      "vote_count.gte": 100,
    }),
    { headers: { Authorization: `Bearer ${API_TOKEN}` } }
  );
  const json = await res.json();
  return json.results as Drama[];
}

export async function getPopularKdramas(): Promise<Drama[]> {
  const res = await fetch(
    buildUrl("/discover/tv", {
      with_original_language: "ko",
      sort_by: "popularity.desc",
    }),
    { headers: { Authorization: `Bearer ${API_TOKEN}` } }
  );
  const json = await res.json();
  return json.results as Drama[];
}

export async function getDramaDetails(id: number): Promise<Drama> {
  const res = await fetch(buildUrl(`/tv/${id}`), {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  return (await res.json()) as Drama;
}