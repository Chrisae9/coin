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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Results</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
        </div>
        
        {lastResult && lastResult !== 'N/A' && (
          <h3 className="text-xl font-bold mb-4">
            Last {isNaN(Number(lastResult)) ? 'Flip' : 'Roll'}: <span className="font-bold text-indigo-600">{lastResult}</span>
          </h3>
        )}
        
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Coin Flip Score:</h4>
          <div className="flex justify-around">
            <p>Heads: <span className="font-bold">{heads}</span></p>
            <p>Tails: <span className="font-bold">{tails}</span></p>
          </div>
        </div>

        {sortedD20Scores.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">D20 Roll Counts:</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 text-sm">
              {sortedD20Scores.map(([roll, count]) => (
                <p key={roll}>{roll}: <span className="font-bold">{count}</span></p>
              ))}
            </div>
          </div>
        )}
        
        <button onClick={onClose} className="mt-6 w-full px-4 py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Back to Game
        </button>
      </div>
    </div>
  );
}
