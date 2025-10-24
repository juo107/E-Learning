type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  categoryId?: string;
  categories?: Array<{ id: string; name: string }>;
  onCategoryChange?: (v: string) => void;
  minPrice?: number;
  onMinPriceChange?: (v: number) => void;
  maxPrice?: number;
  onMaxPriceChange?: (v: number) => void;
  minDuration?: number;
  onMinDurationChange?: (v: number) => void;
  maxDuration?: number;
  onMaxDurationChange?: (v: number) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
  isDescending: boolean;
  onIsDescendingChange: (v: boolean) => void;
  onReset: () => void;
};

export default function FilterBar({
  query, onQueryChange, categoryId, categories, onCategoryChange, 
  minPrice, onMinPriceChange, maxPrice, onMaxPriceChange,
  minDuration, onMinDurationChange, maxDuration, onMaxDurationChange,
  sortBy, onSortByChange, isDescending, onIsDescendingChange, onReset,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-3 rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/70 shadow-sm">
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Tìm kiếm khóa học..."
        className="flex-1 min-w-[220px] rounded-full border border-gray-200 dark:border-gray-800 px-4 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400"
      />
      {onCategoryChange && (
        <select
          value={categoryId ?? ''}
          onChange={(e) => onCategoryChange?.(e.target.value)}
          className="rounded-full border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400"
        >
          <option value="">Tất cả danh mục</option>
          {(categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      )}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minPrice ?? ''}
          onChange={(e) => onMinPriceChange?.(Number(e.target.value) || 0)}
          placeholder="Giá từ"
          className="w-24 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          value={maxPrice ?? ''}
          onChange={(e) => onMaxPriceChange?.(Number(e.target.value) || 0)}
          placeholder="Giá đến"
          className="w-24 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minDuration ?? ''}
          onChange={(e) => onMinDurationChange?.(Number(e.target.value) || 0)}
          placeholder="Thời gian từ (phút)"
          className="w-32 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          value={maxDuration ?? ''}
          onChange={(e) => onMaxDurationChange?.(Number(e.target.value) || 0)}
          placeholder="Thời gian đến (phút)"
          className="w-32 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400"
        />
      </div>
      <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} className="rounded-full border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400">
        <option value="createdAt">Mới nhất</option>
        <option value="title">Tên A-Z</option>
        <option value="price">Giá</option>
        <option value="durationInMinutes">Thời gian</option>
      </select>
      <select value={isDescending ? 'desc' : 'asc'} onChange={(e) => onIsDescendingChange(e.target.value === 'desc')} className="rounded-full border border-gray-200 dark:border-gray-800 px-3 py-2 bg-white dark:bg-gray-950 focus:outline-none focus:border-indigo-400">
        <option value="desc">Giảm dần</option>
        <option value="asc">Tăng dần</option>
      </select>
      <button onClick={onReset} className="px-3 py-2 rounded-full border border-gray-200 dark:border-gray-800 hover:border-indigo-300">Đặt lại</button>
    </div>
  );
}


