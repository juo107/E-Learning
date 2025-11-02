import CategoryGrid from '../components/home/CategoryGrid';
import TopicChips from '../components/home/TopicChips';
import Carousel from '../components/home/Carousel';
import TypingText from '../components/home/TypingText';
import FeaturedTopicsByCategory from '../components/home/FeaturedTopicsByCategory';
import PromoBanner from '../components/home/PromoBanner';
import FlashDealBanner from '../components/home/FlashDealBanner';
import StatsBanner from '../components/home/StatsBanner';
import NewsletterBanner from '../components/home/NewsletterBanner';
import TestimonialCarousel from '../components/home/TestimonialCarousel';
import { Link } from 'react-router-dom';
import { courses, allTopics } from '../data/courses';
import { useEffect, useRef, useState } from 'react';
import { fetchCourses, type CourseCardDto } from '../services/courses';
import { useTranslation } from 'react-i18next';

function getStudentsAreViewingMock() {
  return [...courses].sort((a, b) => (b.students || 0) - (a.students || 0)).slice(0, 12);
}

function getBestsellers() {
  const best = courses.filter((c) => (c.badges ?? []).includes('Bestseller'));
  const top = best.length >= 10 ? best : courses;
  return [...top].sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0)).slice(0, 12);
}

export default function Home() {
  const { t } = useTranslation();
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
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">{t('home.hero.title')}</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
              <TypingText text={t('home.hero.subtitle')} speedMs={18} startDelayMs={600} />
            </p>
            <div className="mt-3 text-xl md:text-2xl font-semibold text-white drop-shadow-[0_0_10px_rgba(99,102,241,0.75)]">
              <TypingText text={t('home.hero.developedBy')} speedMs={22} startDelayMs={1400} />
            </div>
            <div className="mt-8 mx-auto w-full max-w-3xl">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200/70 dark:border-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80"
                  alt="Students learning together in modern classroom"
                  className="w-full h-[240px] md:h-[320px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end md:justify-center">
                  <div className="text-left max-w-md">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-white text-xs font-semibold mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {t('home.hero.trendingNow')}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{t('home.hero.masterSkills')}</h2>
                    <p className="mt-2 text-white/85 text-sm md:text-base">{t('home.hero.masterDescription')}</p>
                    <div className="mt-4">
                      <Link to="/courses" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">
                        {t('home.hero.exploreCourses')}
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
          <span>{t('home.trustedBy.title')}</span>
          {['Nasdaq','Volkswagen','Box','NetApp','Eventbrite'].map((n) => (
            <span key={n} className="font-semibold opacity-80">{n}</span>
          ))}
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <CategoryGrid />

      {/* STATS BANNER */}
      <StatsBanner />

      {/* FLASH DEAL BANNER - Sẽ tự động load promotion từ API */}
      <FlashDealBanner />

      {/* STUDENTS ARE VIEWING (live from API when available) */}
      <section className="py-10">
        <div className="w-full px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{t('home.studentsAreViewing.title')}</h2>
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
              <Link to="/courses" className="ml-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">{t('home.studentsAreViewing.viewAll')}</Link>
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
                      {(() => {
                        // Professional fallback images for courses
                        const professionalCourseImages = [
                          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80', // Online learning
                          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', // Technology
                          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80', // Development
                          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80', // Business
                          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80', // Education
                          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80', // Reading
                          'https://images.unsplash.com/photo-1488196741107-c637cc2cdd45?w=800&auto=format&fit=crop&q=80', // Writing
                          'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', // Design
                        ];
                        const fallbackImage = professionalCourseImages[(c.courseId ?? c.id) % professionalCourseImages.length];
                        return (
                          <img 
                            src={c.thumbnailUrl || fallbackImage} 
                            alt={c.title} 
                            loading="lazy" 
                            className="aspect-video w-full object-cover" 
                          />
                        );
                      })()}
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
      <Carousel title={t('home.bestsellers.title')} courses={bests} />

      {/* TESTIMONIAL CAROUSEL */}
      <TestimonialCarousel />

      {/* FEATURED TOPICS BY CATEGORY */}
      <FeaturedTopicsByCategory />

      {/* PROMO BANNER */}
      <PromoBanner />

      {/* NEWSLETTER BANNER */}
      <NewsletterBanner />

      {/* THIN PROMO moved to global under Header */}
    </div>
  );
}

