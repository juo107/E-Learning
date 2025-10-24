import { useEffect, useState } from 'react';

export default function SystemAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">System</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">System health and services</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md border border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="size-3 rounded-full border-2 border-gray-300 border-t-indigo-600 animate-spin" /> Loading system...
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <div className="text-sm text-gray-500 dark:text-gray-400">Coming soon</div>
        </div>
      )}
    </div>
  );
}





