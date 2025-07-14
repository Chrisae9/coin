"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import usePersistentState from "./usePersistentState";
import ResultsOverlay from "./ResultsOverlay";

const Coin = ({ side, animationKey }: { side: "heads" | "tails" | null, animationKey: number }) => (
  <motion.div
    key={animationKey}
    className="w-40 h-40 sm:w-56 sm:h-56 rounded-full flex items-center justify-center text-5xl sm:text-6xl font-bold text-gray-800 bg-gray-200 shadow-xl border-4 border-gray-300"
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
    className="w-40 h-40 sm:w-56 sm:h-56 flex items-center justify-center text-5xl sm:text-6xl font-bold text-white bg-indigo-600 shadow-xl"
    style={{ clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)' }}
    initial={{ scale: 0, rotate: -15 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
  >
    {result || "?"}
  </motion.div>
);

export default function Home() {
  const [game, setGame] = usePersistentState<"coin" | "d20">('game', "coin");
  const [side, setSide] = useState<"heads" | "tails" | null>(null);
  const [d20Result, setD20Result] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<string | number | null>(null);
  const [score, setScore] = useState<{ heads: number; tails: number; d20: Record<number, number> }>({ heads: 0, tails: 0, d20: {} });
  const [animationKey, setAnimationKey] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAction = () => {
    setAnimationKey(prev => prev + 1);
    let newResult: "heads" | "tails" | number;

    if (game === 'coin') {
      const randomBuffer = new Uint8Array(1);
      window.crypto.getRandomValues(randomBuffer);
      const newSide = randomBuffer[0] < 128 ? "heads" : "tails";
      setSide(newSide);
      newResult = newSide;
      setScore((prev) => ({ ...prev, [newSide]: prev[newSide] + 1 }));
    } else {
      const randomValues = new Uint8Array(1);
      let randomByte;
      do {
        window.crypto.getRandomValues(randomValues);
        randomByte = randomValues[0];
      } while (randomByte >= 240);
      const newD20Result = (randomByte % 20) + 1;
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
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col font-sans">
      <header className="py-4 px-6 shadow-md bg-white dark:bg-gray-800">
        <div className="container mx-auto flex justify-center items-center">
          <div className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <button onClick={() => setGame("coin")} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${game === 'coin' ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}>Coin Flip</button>
            <button onClick={() => setGame("d20")} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${game === 'd20' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-400'}`}>D20 Roll</button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6 flex flex-col items-center justify-center text-center">
        <div className="mb-6 h-56 flex items-center">
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
        {game === 'coin' && side && (
            <div className="mb-6 text-xl">
                Last Flip: <span className="font-bold text-indigo-600">{side}</span>
            </div>
        )}
        {game === 'd20' && d20Result && (
            <div className="mb-6 text-xl">
                Last Roll: <span className="font-bold text-indigo-600">{d20Result}</span>
            </div>
        )}
      </main>

      <footer className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-t">
        <div className="container mx-auto w-full max-w-sm">
            <button
                onClick={handleAction}
                className="w-full px-8 py-4 mb-3 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
                {game === "coin" ? "Flip Coin" : "Roll D20"}
            </button>
            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowResults(true)} className="w-full text-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    View Results
                </button>
                <button
                    onClick={clearScore}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    Clear Score
                </button>
            </div>
        </div>
      </footer>

      {showResults && (
        <ResultsOverlay
          lastResult={lastResult}
          heads={score.heads}
          tails={score.tails}
          d20Scores={score.d20}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
