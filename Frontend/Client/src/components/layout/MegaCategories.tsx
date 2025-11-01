import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCategories, type CategoryItem } from '../../services/categories';

export default function MegaCategories() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let closeTimer: number | undefined;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCategories();
        setItems(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load categories');
        console.error('Error loading categories in MegaCategories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => { if (closeTimer) window.clearTimeout(closeTimer); setOpen(true); }}
      onMouseLeave={() => { closeTimer = window.setTimeout(() => setOpen(false), 200); }}
      onFocus={() => { if (closeTimer) window.clearTimeout(closeTimer); setOpen(true); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
      tabIndex={0}
    >
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1 rounded transition-colors text-gray-700 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/60"
      >
        {t('navigation.explore')}
      </button>
      {open && (
        <div
          className="absolute left-0 mt-2 w-[680px] p-3 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 rounded-lg shadow-md ring-1 ring-black/5 dark:ring-white/5 z-40"
          onMouseEnter={() => { if (closeTimer) window.clearTimeout(closeTimer); setOpen(true); }}
          onMouseLeave={() => { closeTimer = window.setTimeout(() => setOpen(false), 200); }}
        >
          {loading && (
            <div className="text-center py-4">
              <div className="loading-spinner" aria-label="Loading categories" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading categories...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="text-center py-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs text-indigo-600 hover:text-indigo-700 mt-1"
              >
                Retry
              </button>
            </div>
          )}
          
          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {items.map(cat => (
                <div key={cat.id}>
                  <a 
                    href={`/courses?categoryId=${cat.id}`}
                    className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {cat.name}
                  </a>
                  <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      cat.subcategories.map((sub) => (
                        <li key={sub.id}><a href={`/courses?categoryId=${sub.id}`} className="hover:underline decoration-gray-400/60 hover:text-gray-900 dark:hover:text-white transition-colors">{sub.name}</a></li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">No subcategories</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
          
          {!loading && !error && items.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">No categories available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


