import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Course } from '../../types/course';
import CourseCard from '../course/CourseCard';

type Props = {
  title: string;
  courses: Course[];
};

export default function Carousel({ title, courses }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="py-10">
      <div className="w-full px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <div className="flex gap-2">
            <button aria-label="Previous" onClick={() => scrollBy(-1)} className="rounded-full p-2 border hover:bg-gray-50 dark:hover:bg-gray-800">
              <ChevronLeft className="size-5" />
            </button>
            <button aria-label="Next" onClick={() => scrollBy(1)} className="rounded-full p-2 border hover:bg-gray-50 dark:hover:bg-gray-800">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
        <div ref={ref} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-none">
          {courses.map((c) => (
            <div key={c.id} className="min-w-[78%] xs:min-w-[60%] sm:min-w-[45%] md:min-w-[32%] lg:min-w-[22%] snap-start">
              <CourseCard course={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


