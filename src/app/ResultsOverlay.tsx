"use client";

interface ResultsOverlayProps {
  lastResult: string | number | null;
  heads: number;
  tails: number;
  d20Scores: Record<string, number>;
  onClose: () => void;
}

export default function ResultsOverlay({ lastResult, heads, tails, d20Scores, onClose }: ResultsOverlayProps) {
  const sortedD20Scores: [string, number][] = Object.entries(d20Scores).sort(([a], [b]) => Number(a) - Number(b));
  const maxD20Count = sortedD20Scores.length > 0 ? Math.max(...sortedD20Scores.map(([, count]) => count)) : 0;
  const winningD20Rolls = sortedD20Scores.filter(([, count]) => count === maxD20Count).map(([roll]) => roll);

  const getCoinHighlightClass = (side: 'heads' | 'tails') => {
    if (heads === tails && heads > 0) return 'bg-yellow-200 dark:bg-yellow-700/50';
    if (side === 'heads' && heads > tails) return 'bg-green-200 dark:bg-green-700/50';
    if (side === 'tails' && tails > heads) return 'bg-green-200 dark:bg-green-700/50';
    return 'bg-gray-100 dark:bg-gray-700';
  };

  const getD20HighlightClass = (roll: string) => {
    if (winningD20Rolls.length > 1 && winningD20Rolls.includes(roll)) {
      return 'bg-yellow-200 dark:bg-yellow-700/50';
    }
    if (winningD20Rolls.length === 1 && winningD20Rolls[0] === roll) {
      return 'bg-green-200 dark:bg-green-700/50';
    }
    return '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Results</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
          </div>
          {lastResult && lastResult !== 'N/A' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last {isNaN(Number(lastResult)) ? 'Flip' : 'Roll'}: <span className="font-semibold text-indigo-500">{lastResult}</span>
            </p>
          )}
        </div>
        
        <div className="p-4 overflow-y-auto">
          {(heads > 0 || tails > 0) && (
            <div className="mb-4">
              <h4 className="text-base font-semibold mb-2 text-center">Coin Flips</h4>
              <div className="flex justify-around gap-4">
                <div className={`flex flex-col items-center p-3 rounded-lg w-full transition-colors duration-300 ${getCoinHighlightClass('heads')}`}>
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{heads}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 mt-1">Heads</span>
                </div>
                <div className={`flex flex-col items-center p-3 rounded-lg w-full transition-colors duration-300 ${getCoinHighlightClass('tails')}`}>
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{tails}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 mt-1">Tails</span>
                </div>
              </div>
            </div>
          )}

          {sortedD20Scores.length > 0 && (
            <div>
              <h4 className="text-base font-semibold mb-3 text-center">D20 Roll Distribution</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {sortedD20Scores.map(([roll, count]) => (
                  <div key={roll} className={`flex items-center gap-2 p-1 rounded-md transition-colors duration-300 ${getD20HighlightClass(roll)}`}>
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 w-5 text-right">{roll}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-5">
                      <div 
                        className="bg-indigo-600 dark:bg-indigo-500 h-5 rounded-full flex items-center justify-end px-1.5"
                        style={{ width: `${(count / maxD20Count) * 100}%` }}
                      >
                        <span className="text-white text-[10px] font-bold">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="w-full px-4 py-2 text-base font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Back to Game
          </button>
        </div>
      </div>
    </div>
  );
}
