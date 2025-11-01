import CategoryGrid from '../components/home/CategoryGrid';
import TopicChips from '../components/home/TopicChips';
import Carousel from '../components/home/Carousel';
import TypingText from '../components/home/TypingText';
import FeaturedTopicsByCategory from '../components/home/FeaturedTopicsByCategory';
import PromoBanner from '../components/home/PromoBanner';
import { Link } from 'react-router-dom';
import { courses, allTopics } from '../data/courses';
import { useEffect, useRef, useState } from 'react';
import { fetchCourses, type CourseCardDto } from '../services/courses';

function getStudentsAreViewingMock() {
  return [...courses].sort((a, b) => (b.students || 0) - (a.students || 0)).slice(0, 12);
}

function getBestsellers() {
  const best = courses.filter((c) => (c.badges ?? []).includes('Bestseller'));
  const top = best.length >= 10 ? best : courses;
  return [...top].sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0)).slice(0, 12);
}

export default function Home() {
  const [viewingApi, setViewingApi] = useState<CourseCardDto[]>([]);
  const [viewingLoading, setViewingLoading] = useState(true);
  const viewingScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setViewingLoading(true);
      try {
        const res = await fetchCourses(1, 12);
        const list = (res as any).data ?? (Array.isArray(res) ? res : []);
        if (!alive) return;
        setViewingApi(list);
      } catch (e: any) {
        if (!alive) return;
        console.error('Failed to load courses:', e?.message);
      } finally {
        if (alive) setViewingLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const viewing = getStudentsAreViewingMock();
  const bests = getBestsellers();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* subtle radial glow background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.25),transparent_60%)]" />
        <div className="relative w-full px-4 py-16 md:py-24 min-h-[56vh] flex items-center justify-center">
          <div className="max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]">
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">Learn without limits</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
              <TypingText text="Build skills for today, tomorrow, and beyond. Learn from experts around the world." speedMs={18} startDelayMs={600} />
            </p>
            <div className="mt-3 text-xl md:text-2xl font-semibold text-white drop-shadow-[0_0_10px_rgba(99,102,241,0.75)]">
              <TypingText text="Developed by Juo" speedMs={22} startDelayMs={1400} />
            </div>
            <div className="mt-8 mx-auto w-full max-w-3xl">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200/70 dark:border-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop"
                  alt="Learn without limits poster"
                  className="w-full h-[240px] md:h-[320px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end md:justify-center">
                  <div className="text-left max-w-md">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-white text-xs font-semibold mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Trending now
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">Master modern skills with expert-led courses</h2>
                    <p className="mt-2 text-white/85 text-sm md:text-base">Up-skill in development, design, data, and more. New content weekly.</p>
                    <div className="mt-4">
                      <Link to="/courses" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">
                        Explore courses
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <TopicChips topics={allTopics.slice(0, 10).filter((topic): topic is string => Boolean(topic))} />
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-6 border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="w-full px-4 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
          <span>Trusted by companies of all sizes:</span>
          {['Nasdaq','Volkswagen','Box','NetApp','Eventbrite'].map((n) => (
            <span key={n} className="font-semibold opacity-80">{n}</span>
          ))}
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <CategoryGrid />

      {/* STUDENTS ARE VIEWING (live from API when available) */}
      <section className="py-10">
        <div className="w-full px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Students are viewing</h2>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous"
                onClick={() => { const el = viewingScrollRef.current; if (el) el.scrollBy({ left: -el.clientWidth * 0.9, behavior: 'smooth' }); }}
                className="rounded-full p-2 border hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button
                aria-label="Next"
                onClick={() => { const el = viewingScrollRef.current; if (el) el.scrollBy({ left: el.clientWidth * 0.9, behavior: 'smooth' }); }}
                className="rounded-full p-2 border hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <Link to="/courses" className="ml-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link>
            </div>
          </div>
          <div className="relative">
            {viewingLoading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="loading-spinner" aria-label="Loading" />
              </div>
            )}
            <div ref={viewingScrollRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-none">
              {(viewingApi.length > 0 ? viewingApi : viewing).map((c: any) => (
                <div key={c.courseId ?? c.id} className="min-w-[78%] xs:min-w-[60%] sm:min-w-[45%] md:min-w-[32%] lg:min-w-[22%] snap-start">
                  {/* Map API dto to CourseCard-like simple card with hover popover */}
                  <a href={`/course/${c.courseId ?? c.id}`} className="block group relative border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-950 hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img src={c.thumbnailUrl || `https://picsum.photos/seed/course-${c.courseId ?? c.id}/800/450`} alt={c.title} loading="lazy" className="aspect-video w-full object-cover" />
                      {c.averageRating >= 4.5 && (
                        <span className="absolute left-2 top-2 rounded bg-amber-500 text-black text-xs font-semibold px-2 py-0.5">Featured</span>
                      )}
                      {c.effectivePrice === 0 && (
                        <span className="absolute right-2 top-2 rounded bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5">Free</span>
                      )}
                      {c.hasDiscount && c.discountPercent && (
                        <span className="absolute left-2 top-2 rounded bg-red-500 text-white text-xs font-semibold px-2 py-0.5">
                          -{c.discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold line-clamp-2">{c.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{c.shortDescription}</p>
                      <div className="mt-1 text-sm">
                        {c.averageRating > 0 && (
                          <>
                            <span className="font-semibold text-yellow-600">{c.averageRating?.toFixed?.(1) ?? c.averageRating}</span>
                            <span className="ml-1 text-yellow-500">{'★'.repeat(Math.round(c.averageRating))}</span>
                            <span className="ml-1 text-gray-500">({c.ratingCount?.toLocaleString?.() ?? c.ratingCount})</span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 text-lg font-bold">
                        {c.effectivePrice === 0 ? (
                          'Miễn phí'
                        ) : (
                          <div className="flex items-center gap-2">
                            {c.hasDiscount && c.price !== c.effectivePrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {c.currency === 'VND' ? `${c.price?.toLocaleString?.('vi-VN') ?? c.price} ₫` : c.price}
                              </span>
                            )}
                            <span className="text-indigo-600">
                              {c.currency === 'VND' ? `${c.effectivePrice?.toLocaleString?.('vi-VN') ?? c.effectivePrice} ₫` : c.effectivePrice}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover popover (desktop) */}
                    <div className="hidden md:block">
                      <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute z-10 w-80 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl -translate-y-full left-0">
                          <div className="font-semibold mb-1 line-clamp-2">{c.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{c.shortDescription}</div>
                          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                            <li>Lifetime access</li>
                            <li>Certificate of completion</li>
                            <li>Practical projects</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <Carousel title="Bestsellers" courses={bests} />

      {/* FEATURED TOPICS BY CATEGORY */}
      <FeaturedTopicsByCategory />

      {/* PROMO BANNER */}
      <PromoBanner />

      {/* THIN PROMO moved to global under Header */}
    </div>
  );
}

