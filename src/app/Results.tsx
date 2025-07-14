"use client";

interface ResultsProps {
  title: string;
  scores: { label: string; value: number }[];
  winningCriteria: (scores: { label: string; value: number }[]) => string[];
}

export default function Results({ title, scores, winningCriteria }: ResultsProps) {
  const winningLabels = winningCriteria(scores);
  const maxCount = scores.length > 0 ? Math.max(...scores.map(s => s.value)) : 0;

  const getHighlightClass = (label: string) => {
    if (winningLabels.length > 1 && winningLabels.includes(label)) {
      return 'bg-yellow-200 dark:bg-yellow-700/50';
    }
    if (winningLabels.length === 1 && winningLabels[0] === label) {
      return 'bg-green-200 dark:bg-green-700/50';
    }
    if (scores.every(s => s.value === 0)) {
        return 'bg-gray-100 dark:bg-gray-700';
    }
    return 'bg-gray-100 dark:bg-gray-700';
  };

  const isBarChart = scores.length > 2;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-center">{title}</h2>
      </div>
      <div className="p-4 overflow-y-auto flex-grow">
        {scores.every(s => s.value === 0) ? (
            <div className="flex-grow flex items-center justify-center h-full">
                <p className="text-gray-500">No results yet!</p>
            </div>
        ) : isBarChart ? (
          <div className="space-y-2">
            {scores.map(({ label, value }) => (
              <div key={label} className={`flex items-center gap-2 p-1 rounded-md transition-colors duration-300 ${getHighlightClass(label)}`}>
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400 w-5 text-right">{label}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-5">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-500 h-5 rounded-full flex items-center justify-end px-1.5"
                    style={{ width: `${(value / maxCount) * 100}%` }}
                  >
                    <span className="text-white text-[10px] font-bold">{value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-around gap-4">
            {scores.map(({ label, value }) => (
              <div key={label} className={`flex flex-col items-center p-3 rounded-lg w-full transition-colors duration-300 ${getHighlightClass(label)}`}>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{value}</span>
                <span className="text-xs text-gray-600 dark:text-gray-300 mt-1">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
