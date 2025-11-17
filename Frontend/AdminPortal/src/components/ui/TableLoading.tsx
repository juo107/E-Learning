import { LucideIcon } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import React from 'react';

interface TableLoadingProps {
  loading?: boolean;
  isFiltering?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  skeletonRows?: number;
  skeletonColumns?: number;
  children?: React.ReactNode; // Tbody content khi có data
}

export default function TableLoading({
  loading = false,
  isFiltering = false,
  isEmpty = false,
  emptyMessage = 'No data found',
  emptyIcon: EmptyIcon = BookOpen,
  skeletonRows = 5,
  skeletonColumns = 6,
  children,
}: TableLoadingProps) {
  // Loading state - render skeleton rows
  if (loading && !isFiltering) {
    return (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
        {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            {Array.from({ length: skeletonColumns }).map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <div
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                  style={{
                    width: `${Math.random() * 40 + 60}%`,
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  // Empty state - render empty message
  if (isEmpty && !loading) {
    return (
      <tbody className="bg-white dark:bg-gray-900">
        <tr>
          <td colSpan={skeletonColumns} className="px-6 py-16 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <EmptyIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{emptyMessage}</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  // Normal content - render children (tbody với data)
  return <>{children}</>;
}
