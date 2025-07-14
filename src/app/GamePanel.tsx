"use client";

import { motion } from "framer-motion";

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

interface GamePanelProps {
    gameType: 'coin' | 'd20';
    result: 'heads' | 'tails' | number | null;
    animationKey: number;
    lastResultText: string;
    onAction: () => void;
    actionText: string;
}

export default function GamePanel({ gameType, result, animationKey, lastResultText, onAction, actionText }: GamePanelProps) {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <div className="h-56 flex items-center">
                {gameType === 'coin' ? <Coin side={result as "heads" | "tails" | null} animationKey={animationKey} /> : <D20 result={result as number | null} animationKey={animationKey} />}
            </div>
            <div className="mt-6 text-xl h-7">
                {lastResultText}
            </div>
            <button
                onClick={onAction}
                className="w-full max-w-xs px-8 py-4 mt-6 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
                {actionText}
            </button>
        </div>
    )
}
