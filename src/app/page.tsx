"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useState } from "react";
import usePersistentState from "./usePersistentState";

const Coin = ({ side, animationKey }: { side: "heads" | "tails" | null, animationKey: number }) => (
  <motion.div
    key={animationKey}
    className="w-40 h-40 sm:w-56 sm:h-56 rounded-full flex items-center justify-center text-5xl sm:text-6xl font-bold text-black bg-gray-400 shadow-lg"
    initial={{ rotateY: 0 }}
    animate={{ rotateY: 360 }}
    transition={{ duration: 0.5 }}
  >
    {side ? (side === "heads" ? "H" : "T") : "?"}
  </motion.div>
);

const D20 = ({ result, animationKey }: { result: number | null, animationKey: number }) => (
  <motion.div
    key={animationKey}
    className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg flex items-center justify-center text-5xl sm:text-6xl font-bold text-white bg-purple-500 shadow-lg"
    initial={{ scale: 0, rotate: 0 }}
    animate={{ scale: 1, rotate: 360 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  >
    {result || "?"}
  </motion.div>
);

export default function Home() {
  const [game, setGame] = usePersistentState<"coin" | "d20">('game', "coin");
  const [side, setSide] = usePersistentState<"heads" | "tails" | null>('side', null);
  const [d20Result, setD20Result] = usePersistentState<number | null>('d20Result', null);
  const [lastResult, setLastResult] = usePersistentState<string | number | null>('lastResult', null);
  const [score, setScore] = usePersistentState<{ heads: number; tails: number; d20: Record<number, number> }>('score', { heads: 0, tails: 0, d20: {} });
  const [animationKey, setAnimationKey] = useState(0);

  const handleAction = () => {
    setAnimationKey(prev => prev + 1);
    let newResult: "heads" | "tails" | number;

    if (game === 'coin') {
      const newSide = Math.random() > 0.5 ? "heads" : "tails";
      setSide(newSide);
      newResult = newSide;
      setScore((prev) => ({ ...prev, [newSide]: prev[newSide] + 1 }));
    } else {
      const newD20Result = Math.floor(Math.random() * 20) + 1;
      setD20Result(newD20Result);
      newResult = newD20Result;
      setScore((prev) => ({ ...prev, d20: { ...prev.d20, [newD20Result]: (prev.d20[newD20Result] || 0) + 1 } }));
    }
    setLastResult(newResult);
  };

  const clearScore = () => {
    setScore({ heads: 0, tails: 0, d20: {} });
    setSide(null);
    setD20Result(null);
    setLastResult(null);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
      <header className="p-4 shadow-md bg-white dark:bg-gray-800">
        <div className="container mx-auto flex justify-center gap-4">
          <button onClick={() => setGame("coin")} className={`px-4 py-2 rounded-md font-semibold ${game === 'coin' ? 'bg-gray-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Coin Flip</button>
          <button onClick={() => setGame("d20")} className={`px-4 py-2 rounded-md font-semibold ${game === 'd20' ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Roll D20</button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={game}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {game === "coin" ? <Coin side={side} animationKey={animationKey} /> : <D20 result={d20Result} animationKey={animationKey} />}
            </motion.div>
          </AnimatePresence>
        </div>
        {lastResult && (
            <div className="mb-4 text-xl">
                Last Result: <span className="font-bold text-blue-500">{lastResult}</span>
            </div>
        )}
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800 shadow-inner sticky bottom-0">
        <div className="container mx-auto w-full max-w-md">
            <button
                onClick={handleAction}
                className="w-full px-8 py-4 mb-2 text-lg font-bold text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
            >
                {game === "coin" ? "Flip Coin" : "Roll D20"}
            </button>
            <div className="flex gap-2">
                <Link href={{ pathname: '/results', query: { lastResult: lastResult || 'N/A', heads: score.heads, tails: score.tails, d20Scores: JSON.stringify(score.d20) } }} className="w-full text-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    View Results
                </Link>
                <button
                    onClick={clearScore}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                    Clear Score
                </button>
            </div>
        </div>
      </footer>
    </div>
  );
}
