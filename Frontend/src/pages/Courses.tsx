import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  fetchCourses, 
  fetchCoursesByCategory, 
  fetchCategoryStats,
  searchCourses,
  fetchCourseByCode,
  fetchCoursesByTitleExact,
  type CourseCardDto, 
  type Paginated 
} from '../services/courses';
import { fetchCategories } from '../services/categories';
import FilterBar from '../components/filters/FilterBar';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('categoryId') || undefined;
  const searchParam = searchParams.get('search') || '';
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<CourseCardDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef<Map<number, Paginated<CourseCardDto>>>(new Map());
  // Filter/sort state (client-side on current page)
  const [query, setQuery] = useState(searchParam);
  const [categoryId, setCategoryId] = useState<string>(categoryParam || '');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minDuration, setMinDuration] = useState<number | undefined>(undefined);
  const [maxDuration, setMaxDuration] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [isDescending, setIsDescending] = useState<boolean>(true);
  const [level, setLevel] = useState<'Beginner'|'Intermediate'|'Advanced'|''>('');
  const [language, setLanguage] = useState<'Vi'|'En'|''>('');
  const [publishedFilter, setPublishedFilter] = useState<'all'|'published'|'unpublished'>('all');
  const [categoryOptions, setCategoryOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryStats, setCategoryStats] = useState<any>(null);

  // load categories for dropdown
  useEffect(() => {
    fetchCategories().then((items) => {
      const flat: Array<{ id: string; name: string }> = [];
      items.forEach((c) => {
        flat.push({ id: c.id, name: c.name });
        (c.subcategories ?? []).forEach((s) => {
          if (s.id) flat.push({ id: s.id, name: s.name });
        });
      });
      setCategoryOptions(flat);
    });
  }, []);

  // Load category stats when categoryId changes
  useEffect(() => {
    if (categoryId && !isNaN(parseInt(categoryId))) {
      fetchCategoryStats(parseInt(categoryId))
        .then(setCategoryStats)
        .catch(() => setCategoryStats(null));
    } else {
      setCategoryStats(null);
    }
  }, [categoryId]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setError(null);

    const cached = cacheRef.current.get(page);
    if (cached) {
      // Show cached immediately for instant UI; still refresh in background
      setData(cached);
      setPageLoading(true);
    } else if (!data) {
      setLoading(true);
    } else {
      setPageLoading(true);
    }

    // Use optimized API based on filters
    const fetchData = async () => {
      try {
        let res: Paginated<CourseCardDto>;
        
        // Check if categoryId is a valid GUID
        const isValidGuid = categoryId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
        
        // Search logic with fast-path by code/title exact
        const searchKeyword = query || searchParam;
        if (searchKeyword && searchKeyword.trim().length > 0) {
          const normalized = searchKeyword.trim();
          // try code first
          if (/^[A-Za-z0-9_\-]+$/.test(normalized)) {
            const byCode = await fetchCourseByCode(normalized);
            if (byCode) {
              res = {
                data: [{
                  courseId: (byCode.courseId as unknown as string) || '',
                  title: byCode.title,
                  shortDescription: byCode.shortDescription,
                  price: byCode.price,
                  discountPrice: byCode.discountPrice,
                  level: byCode.level as any,
                  language: byCode.language as any,
                  isPublished: byCode.isPublished,
                  averageRating: 0,
                  ratingCount: 0,
                  viewCount: 0,
                  enrollmentCount: 0,
                  isFeatured: false,
                  categoryName: byCode.categoryName,
                  categoryId: (byCode.categoryId as unknown as string) || undefined,
                  createdAt: byCode.createdAt,
                  publishedAt: byCode.publishedAt,
                  thumbnailUrl: byCode.thumbnailUrl || undefined,
                  primaryImageUrl: undefined,
                  promoVideoUrl: undefined,
                  discountPercent: undefined,
                  finalPrice: byCode.discountPrice ?? byCode.price,
                  discountExpiresAt: undefined,
                  hasDiscount: (byCode.discountPrice ?? 0) > 0 && (byCode.discountPrice ?? 0) < (byCode.price ?? 0),
                  effectivePrice: byCode.discountPrice ?? byCode.price ?? 0,
                  currency: 'VND'
                }],
                pageNumber: 1,
                pageSize: 1,
                totalCount: 1,
                totalPages: 1,
                hasPreviousPage: false,
                hasNextPage: false
              };
            } else {
              const exact = await fetchCoursesByTitleExact(normalized);
              if (exact.length > 0) {
                res = { data: exact, pageNumber: 1, pageSize: exact.length, totalCount: exact.length, totalPages: 1, hasPreviousPage: false, hasNextPage: false };
              } else {
                const searchResults = await searchCourses(normalized);
                res = {
                  data: searchResults,
                  pageNumber: 1,
                  pageSize: searchResults.length,
                  totalCount: searchResults.length,
                  totalPages: 1,
                  hasPreviousPage: false,
                  hasNextPage: false
                };
              }
            }
          } else {
            // If not a code-like string, try exact title then fallback ES
            const exact = await fetchCoursesByTitleExact(normalized);
            if (exact.length > 0) {
              res = { data: exact, pageNumber: 1, pageSize: exact.length, totalCount: exact.length, totalPages: 1, hasPreviousPage: false, hasNextPage: false };
            } else {
              const searchResults = await searchCourses(normalized);
              res = {
                data: searchResults,
                pageNumber: 1,
                pageSize: searchResults.length,
                totalCount: searchResults.length,
                totalPages: 1,
                hasPreviousPage: false,
                hasNextPage: false
              };
            }
          }
        } else {
          console.log('📊 Using database API with filters');
          // Use backend API with all filter parameters
          res = await fetchCourses(page, 12, { 
            search: undefined, // Don't use search param for regular filtering
            categoryId: isValidGuid ? categoryId : undefined,
            minPrice: minPrice,
            maxPrice: maxPrice,
            minDuration: minDuration,
            maxDuration: maxDuration,
            sortBy: sortBy,
            isDescending: isDescending,
            level: (level || undefined) as any,
            language: (language || undefined) as any,
            isPublished: publishedFilter === 'all' ? undefined : (publishedFilter === 'published')
          });
        }
        
        if (cancelled) return;
        cacheRef.current.set(page, res);
        setData(res);
        
        // prefetch next page in background
        if (res.hasNextPage && !cacheRef.current.get(page + 1)) {
          if (isValidGuid) {
            fetchCoursesByCategory(parseInt(categoryId), page + 1, 12)
              .then((next) => cacheRef.current.set(page + 1, next))
              .catch(() => {});
          } else {
            fetchCourses(page + 1, 12)
              .then((next) => cacheRef.current.set(page + 1, next))
              .catch(() => {});
          }
        }
      } catch (e) {
        if (!cancelled) setError((e as Error)?.message ?? 'Failed to load');
      } finally {
        if (!cancelled) { setLoading(false); setPageLoading(false); }
      }
    };

    fetchData();

    return () => { cancelled = true; controller.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryParam, categoryId, searchParam, query, minPrice, maxPrice, minDuration, maxDuration, sortBy, isDescending, level, language, publishedFilter]);

  // Derived filtered list for current page (must run on every render to keep hooks order)
  const visible = useMemo(() => {
    const base = (data?.data ?? []).slice();
    let list = base;
    const q = query.trim().toLowerCase();
    if (q) list = list.filter(c => (c.title || '').toLowerCase().includes(q) || (c.shortDescription || '').toLowerCase().includes(q));
    
    // Price filtering
    if (minPrice != null) list = list.filter(c => (c.effectivePrice || 0) >= minPrice);
    if (maxPrice != null) list = list.filter(c => (c.effectivePrice || 0) <= maxPrice);
    
    // Featured first (rating >= 4.5)
    list.sort((a,b) => ((b.averageRating || 0) >= 4.5 ? 1 : 0) - ((a.averageRating || 0) >= 4.5 ? 1 : 0));
    
    return list;
  }, [data, query, minPrice, maxPrice]);

  if (loading) return (
    <div className="p-10 flex items-center justify-center">
      <div className="loading-spinner" aria-label="Loading" />
    </div>
  );
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return null;

  const searchKeyword = query || searchParam;

  return (
    <section className="w-full px-4 py-8">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
        <h1 className="text-2xl font-semibold">
          {searchKeyword ? `Search Results for "${searchKeyword}"` : 
           categoryId ? `Courses · ${categoryOptions.find(c => c.id === categoryId)?.name || 'Category'}` : 'Courses'}
          {searchKeyword && data && (
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
              ({data.totalCount} results)
            </span>
          )}
          {categoryId && categoryStats && !searchKeyword && (
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
              ({categoryStats.publishedCourses} courses)
            </span>
          )}
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {(data.totalCount || 0).toLocaleString()} results
          {categoryStats && (
            <span className="ml-2">
              • {(categoryStats.totalEnrollments || 0).toLocaleString()} enrollments
              • {(categoryStats.averageRating || 0).toFixed(1)} avg rating
            </span>
          )}
        </div>
      </div>

      {/* Category Stats */}
      {categoryStats && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600">{categoryStats.totalCourses}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{categoryStats.publishedCourses}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{(categoryStats.totalEnrollments || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Enrollments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{(categoryStats.averageRating || 0).toFixed(1)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
            </div>
          </div>
        </div>
      )}

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        categoryId={categoryId}
        categories={categoryOptions}
        onCategoryChange={(v) => {
          setCategoryId(v);
          // sync URL param via router and reset cache so results truly update
          const params = new URLSearchParams(searchParams);
          if (v) params.set('category', v); else params.delete('category');
          setSearchParams(params, { replace: true });
          cacheRef.current = new Map();
          setPage(1);
        }}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        minDuration={minDuration}
        onMinDurationChange={setMinDuration}
        maxDuration={maxDuration}
        onMaxDurationChange={setMaxDuration}
        level={level}
        onLevelChange={setLevel as any}
        language={language}
        onLanguageChange={setLanguage as any}
        isPublished={publishedFilter}
        onIsPublishedChange={setPublishedFilter as any}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        isDescending={isDescending}
        onIsDescendingChange={setIsDescending}
        onReset={() => { 
          setQuery(''); 
          setCategoryId(''); 
          setMinPrice(undefined); 
          setMaxPrice(undefined); 
          setMinDuration(undefined); 
          setMaxDuration(undefined); 
          setSortBy('createdAt'); 
          setIsDescending(true); 
          setLevel('');
          setLanguage('');
          setPublishedFilter('all');
          cacheRef.current = new Map(); 
          setPage(1); 
        }}
      />
      <div ref={gridRef} className="relative">
        {pageLoading && (
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px] flex items-center justify-center">
            <div className="loading-spinner" aria-label="Loading page" />
          </div>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${pageLoading ? 'opacity-40' : 'animate-fade-in'}`}>
        {visible.map((c) => {
          const isFeatured = c.averageRating >= 4.5;
          const isFree = c.effectivePrice === 0;
          return (
          <a href={`/course/${c.courseId}`} key={c.courseId} className="rounded-xl bg-white dark:bg-gray-950 border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-0.5 relative overflow-hidden block">
            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800">
              <img
                src={c.thumbnailUrl || `https://picsum.photos/seed/course-${c.courseId}/800/450`}
                alt={c.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
            {(isFeatured || isFree || c.hasDiscount) && (
              <div className="absolute top-2 left-2 flex gap-2">
                {isFeatured && <span className="text-xs font-semibold bg-amber-400 text-black px-2 py-0.5 rounded">Featured</span>}
                {isFree && <span className="text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded">Free</span>}
                {c.hasDiscount && c.discountPercent && (
                  <span className="text-xs font-semibold bg-red-500 text-white px-2 py-0.5 rounded">
                    -{c.discountPercent}%
                  </span>
                )}
              </div>
            )}
            <h3 className="font-semibold line-clamp-2">{c.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{c.shortDescription}</p>
            <div className="mt-2 text-sm">
              <span className="font-semibold">{(c.averageRating || 0).toFixed(1)}</span>
              <span className="ml-1 text-yellow-500">{'★'.repeat(Math.round(c.averageRating || 0))}</span>
              <span className="ml-1 text-gray-500">({c.ratingCount})</span>
            </div>
            <div className="mt-2 text-lg font-bold">
              {c.currency === 'VND' ? (
                c.effectivePrice === 0 ? 'Miễn phí' : (
                  <div className="flex items-center gap-2">
                    {c.hasDiscount && c.price !== c.effectivePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {c.price?.toLocaleString?.('vi-VN') ?? c.price} ₫
                      </span>
                    )}
                    <span className="text-indigo-600">
                      {c.effectivePrice?.toLocaleString?.('vi-VN') ?? c.effectivePrice} ₫
                    </span>
                  </div>
                )
              ) : (c.effectivePrice || 0)}
            </div>
            </div>
          </a>
          );
        })}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button disabled={!data.hasPreviousPage} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 border rounded disabled:opacity-50">Prev</button>
        <span className="text-sm">Page {data.pageNumber} / {data.totalPages}</span>
        <button disabled={!data.hasNextPage} onClick={() => setPage((p) => p + 1)} className="px-3 py-2 border rounded disabled:opacity-50">Next</button>
      </div>
    </section>
  );
}



