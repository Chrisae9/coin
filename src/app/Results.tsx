"use client";

interface ResultsProps {
  title: string;
  scores: { label: string; value: number }[];
  winningCriteria: (scores: { label: string; value: number }[]) => string[];
  total?: number;
}

export default function Results({ title, scores, winningCriteria, total }: ResultsProps) {
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

  const isBarChart = title === 'D20 Rolls';

  const d20ScoresMap = new Map(scores.map(s => [s.label, s.value]));
  const allD20Rolls = Array.from({ length: 20 }, (_, i) => String(i + 1));

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
        <div className="flex justify-between items-baseline px-4 pt-4 pb-2">
            <h3 className="text-lg font-bold">{title}</h3>
            {total !== undefined && <p className="text-sm text-gray-500 dark:text-gray-400">Total: <span className="font-bold">{total}</span></p>}
        </div>
      <div className="px-4 pb-4 overflow-y-auto flex-grow">
        {isBarChart ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            {allD20Rolls.map(label => {
              const value = d20ScoresMap.get(label) || 0;
              if (value === 0) {
                return (
                  <div key={label} className="flex items-center gap-1 p-0.5 rounded-md">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400 w-5 text-right">{label}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4"></div>
                  </div>
                )
              }
              return (
                <div key={label} className={`flex items-center gap-1 p-0.5 rounded-md transition-colors duration-300 ${getHighlightClass(label)}`}>
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400 w-5 text-right">{label}</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-4 rounded-full flex items-center justify-end px-1.5"
                      style={{ width: `${(value / (maxCount || 1)) * 100}%` }}
                    >
                      <span className="text-white text-[10px] font-bold">{value > 0 ? value : ''}</span>
                    </div>
                  </div>
                </div>
              )
            })}
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
