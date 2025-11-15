import { useLocation } from 'react-router-dom';

export default function Placeholder() {
  const location = useLocation();
  const path = location.pathname;
  const title = path.split('/').pop()?.replace(/-/g, ' ') || 'Page';
  const formattedTitle = title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {formattedTitle}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          This page is under development. Coming soon...
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <span className="text-sm font-medium">Path:</span>
          <code className="text-sm font-mono">{path}</code>
        </div>
      </div>
    </div>
  );
}

