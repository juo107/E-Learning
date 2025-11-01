import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchService, SearchResult } from '../../services/search';

type Suggestion = {
  id: string;
  label: string;
  type: 'course' | 'instructor' | 'topic';
  courseId?: string; // for direct navigation (GUID)
};

type Props = {
  className?: string;
  placeholder?: string;
};

export default function GlobalSearch({ className, placeholder = 'Search for anything' }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [remote, setRemote] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  // debounce
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Remove static fallback; rely on backend search for accuracy

  // Remote suggestions from Elasticsearch
  useEffect(() => {
    let aborted = false;
    const run = async () => {
      const term = debounced;
      if (term.length < 2) { setRemote([]); setLoading(false); setError(null); return; }
      setLoading(true); setError(null);
      try {
        // Use Elasticsearch search for better relevance
        const results: SearchResult[] = await SearchService.searchCourses(term);
        if (aborted) return;
        
        const mapped: Suggestion[] = results.slice(0, 6).map((course) => ({
          id: course.courseId,
          label: course.title,
          type: 'course' as const,
          courseId: course.courseId
        }));
        
        setRemote(mapped.filter(s => !!s.label && !!s.courseId));
      } catch (e: any) {
        if (!aborted) { setRemote([]); setError(e?.message || 'Failed to search'); }
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    run();
    return () => { aborted = true; };
  }, [debounced]);

  const suggestions = useMemo(() => {
    return remote;
  }, [remote]);

  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions.length]);

  const submit = async (text?: string) => {
    const q = (text ?? query).trim();
    if (!q) return;
    const current = suggestions[activeIndex];
    setOpen(false);
    if (current && current.type === 'course' && current.courseId) {
      navigate(`/course/${current.courseId}`);
    } else {
      navigate(`/courses?search=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className={`relative ${className ?? ''}`} role="search" aria-label="Global search">
      <div className="flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 transition">
        <Search className="size-4 text-gray-500" aria-hidden="true" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { const v = e.target.value; setQuery(v); setOpen(v.trim().length >= 2); }}
          onFocus={() => setOpen(query.trim().length >= 2)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, Math.max(suggestions.length - 1, 0))); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
            if (e.key === 'Enter') { submit(suggestions[activeIndex]?.label ?? query); }
            if (e.key === 'Escape') { setOpen(false); }
          }}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-gray-400"
        />
        <button
          aria-label="Search"
          onClick={() => submit(query)}
          className="hidden xs:inline-flex items-center gap-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-1.5"
        >
          Search
        </button>
        {loading && <div aria-hidden className="size-4 rounded-full border-2 border-gray-300 border-t-indigo-600 animate-spin" />}
        {query && (
          <button aria-label="Clear" onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="text-gray-500 hover:text-gray-700">
            <X className="size-4" />
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
          role="listbox"
        >
          {suggestions.map((s, idx) => (
            <li key={s.id} role="option" aria-selected={idx === activeIndex}>
              <button
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${idx === activeIndex ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={async () => {
                  setOpen(false);
                  if (s.type === 'course' && s.courseId) {
                    navigate(`/course/${s.courseId}`);
                  } else {
                    await submit(s.label);
                  }
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1">
                    <span className="text-xs uppercase text-gray-500 mr-2">{s.type}</span>
                    <span className="font-medium">{s.label}</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && !loading && suggestions.length === 0 && debounced.length >= 2 && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
          {error ? 'Không tìm thấy gợi ý' : 'Không có gợi ý'}
        </div>
      )}
    </div>
  );
}


