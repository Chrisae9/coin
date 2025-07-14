"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import usePersistentState from "./usePersistentState";
import Results from "./Results";

const Coin = ({ side, animationKey }: { side: "heads" | "tails" | null, animationKey: number }) => (
  <motion.div
    key={animationKey}
    className="w-40 h-40 rounded-full flex items-center justify-center text-5xl font-bold text-gray-800 bg-gray-200 shadow-xl border-4 border-gray-300"
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
    className="w-40 h-40 flex items-center justify-center text-5xl font-bold text-white bg-blue-600 shadow-xl"
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
  const [score, setScore] = useState<{ heads: number; tails: number; d20: Record<number, number> }>({ heads: 0, tails: 0, d20: {} });
  const [animationKey, setAnimationKey] = useState(0);
  const [d20AnimationKey, setD20AnimationKey] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const hasResults = score.heads > 0 || score.tails > 0 || Object.keys(score.d20).length > 0;

  const totalFlips = score.heads + score.tails;
  const totalRolls = Object.values(score.d20).reduce((a, b) => a + b, 0);

  const handleCoinFlip = () => {
    setAnimationKey(prev => prev + 1);
    const randomBuffer = new Uint8Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const newSide = randomBuffer[0] < 128 ? "heads" : "tails";
    setSide(newSide);
    setScore((prev) => ({ ...prev, [newSide]: prev[newSide] + 1 }));
  };

  const handleD20Roll = () => {
    setD20AnimationKey(prev => prev + 1);
    const randomValues = new Uint8Array(1);
    let randomByte;
    do {
      window.crypto.getRandomValues(randomValues);
      randomByte = randomValues[0];
    } while (randomByte >= 240);
    const newD20Result = (randomByte % 20) + 1;
    setD20Result(newD20Result);
    setScore((prev) => ({ ...prev, d20: { ...prev.d20, [newD20Result]: (prev.d20[newD20Result] || 0) + 1 } }));
  };

  const clearScore = () => {
    setScore({ heads: 0, tails: 0, d20: {} });
    setSide(null);
    setD20Result(null);
  };

  const coinScores = [{label: 'Heads', value: score.heads}, {label: 'Tails', value: score.tails}];
  const d20Scores = Object.entries(score.d20).map(([roll, count]) => ({label: roll, value: count})).sort((a,b) => Number(a.label) - Number(b.label));

  const coinWinningCriteria = (scores: {label: string, value: number}[]) => {
    const heads = scores.find(s => s.label === 'Heads')?.value || 0;
    const tails = scores.find(s => s.label === 'Tails')?.value || 0;
    if (heads === tails && heads > 0) return ['Heads', 'Tails'];
    if (heads > tails) return ['Heads'];
    if (tails > heads) return ['Tails'];
    return [];
  }

  const d20WinningCriteria = (scores: {label: string, value: number}[]) => {
    const filteredScores = scores.filter(s => s.value > 0);
    if (filteredScores.length === 0) return [];
    const max = Math.max(...filteredScores.map(s => s.value));
    if (max === 0) return [];
    return filteredScores.filter(s => s.value === max).map(s => s.label);
  }

  // Mobile View
  const mobileView = (
    <div className="flex flex-col h-dvh overflow-hidden">
        <header className="py-4 px-6 shadow-md bg-white dark:bg-gray-800">
          <div className="container mx-auto flex justify-center items-center">
            <div className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <button onClick={() => setGame("coin")} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${game === 'coin' ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}>Coin Flip</button>
              <button onClick={() => setGame("d20")} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${game === 'd20' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow' : 'text-gray-600 dark:text-gray-400'}`}>D20 Roll</button>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-6 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div key={game} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {game === 'coin' ? (
                <div className="flex flex-col items-center">
                  <div className="h-56 flex items-center">
                    <Coin side={side} animationKey={animationKey} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-56 flex items-center">
                    <D20 result={d20Result} animationKey={d20AnimationKey} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-t">
          <div className="container mx-auto w-full max-w-sm">
              <button
                  onClick={game === 'coin' ? handleCoinFlip : handleD20Roll}
                  className="w-full px-8 py-4 mb-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                  {game === "coin" ? "Flip Coin" : "Roll D20"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                  <button 
                      onClick={() => setShowResults(true)} 
                      disabled={!hasResults}
                      className="w-full text-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      View Results
                  </button>
                  <button
                      onClick={clearScore}
                      disabled={!hasResults}
                      className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      Clear Score
                  </button>
              </div>
          </div>
        </footer>
    </div>
  );

  // Desktop View
  const desktopView = (
    <div className="h-dvh flex flex-col bg-gray-100 dark:bg-gray-800">
      <main className="flex-grow p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Coin Flip Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col p-6 items-center justify-between">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Coin Flip</h2>
          <div className="flex-grow flex items-center justify-center">
            <Coin side={side} animationKey={animationKey} />
          </div>
          <button
            onClick={handleCoinFlip}
            className="w-full px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md mt-4"
          >
            Flip Coin
          </button>
        </div>

        {/* D20 Roll Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col p-6 items-center justify-between">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">D20 Roll</h2>
          <div className="flex-grow flex items-center justify-center">
            <D20 result={d20Result} animationKey={d20AnimationKey} />
          </div>
          <button
            onClick={handleD20Roll}
            className="w-full px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md mt-4"
          >
            Roll D20
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Results</h2>
          <div className="flex-grow flex flex-col justify-around">
            <div className="flex-1 pb-2">
              <Results title="Coin Flips" scores={coinScores} winningCriteria={coinWinningCriteria} total={totalFlips} />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
            <div className="flex-1 pt-2">
              <Results title="D20 Rolls" scores={d20Scores} winningCriteria={d20WinningCriteria} total={totalRolls} />
            </div>
          </div>
          <button
            onClick={clearScore}
            disabled={!hasResults}
            className="mt-6 w-full px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Clear All Scores
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <div className="lg:hidden">
        {mobileView}
      </div>
      <div className="hidden lg:block">
        {desktopView}
      </div>

      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 p-4 flex items-center justify-center lg:hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col mx-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Results</h2>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="mb-4">
                        <Results title="Coin Flips" scores={coinScores} winningCriteria={coinWinningCriteria} total={totalFlips} />
                    </div>
                    <Results title="D20 Rolls" scores={d20Scores} winningCriteria={d20WinningCriteria} total={totalRolls} />
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={() => setShowResults(false)} className="w-full px-4 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        Back to Game
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
