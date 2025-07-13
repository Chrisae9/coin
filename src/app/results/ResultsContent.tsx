"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResultsContent() {
  const searchParams = useSearchParams();

  const lastResult = searchParams.get('lastResult');
  const heads = searchParams.get('heads');
  const tails = searchParams.get('tails');
  const d20ScoresParam = searchParams.get('d20Scores');

  const d20Scores: Record<string, number> = d20ScoresParam ? JSON.parse(d20ScoresParam) : {};
  const sortedD20Scores: [string, number][] = Object.entries(d20Scores).sort(([a], [b]) => Number(a) - Number(b));

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
      <header className="p-4 shadow-md bg-white dark:bg-gray-800">
        <div className="container mx-auto flex justify-center">
          <h1 className="text-2xl font-bold">Results</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Last Result: <span className="font-bold text-blue-500">{lastResult}</span></h2>
          
          {heads !== null && tails !== null && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Coin Flip Score:</h3>
              <div className="flex justify-around">
                <p>Heads: <span className="font-bold">{heads}</span></p>
                <p>Tails: <span className="font-bold">{tails}</span></p>
              </div>
            </div>
          )}

          {sortedD20Scores.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">D20 Roll Counts:</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 text-sm">
                {sortedD20Scores.map(([roll, count]) => (
                  <p key={roll}>{roll}: <span className="font-bold">{count}</span></p>
                ))}
              </div>
            </div>
          )}
        </div>
        <Link href="/" className="mt-8 px-8 py-4 text-lg font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">
            Back to Game
        </Link>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        <p>Created with Gemini</p>
      </footer>
    </div>
  );
}