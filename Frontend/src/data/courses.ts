import type { Course } from '../types/course';

const categories = ['Development','Business','Finance & Accounting','IT & Software','Office Productivity','Personal Development','Design','Marketing','Lifestyle','Photography & Video','Health & Fitness','Music','Teaching & Academics'] as const;

const topics = ['JavaScript','TypeScript','React','Node.js','Python','Django','Excel','Photoshop','UI/UX','SQL','AWS','Docker','Kubernetes'];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[rand(0, arr.length - 1)]; }

export const courses: Course[] = Array.from({ length: 24 }).map((_, i) => {
  const cat = pick([...categories]);
  const topic = pick([...topics]);
  const rating = parseFloat((Math.random() * 2 + 3).toFixed(1));
  const totalRatings = rand(200, 15000);
  const students = rand(1000, 120000);
  const hours = rand(3, 48);
  const lectures = rand(20, 250);
  const former = rand(39, 199);
  const current = Math.max(9.99, parseFloat((former * (0.2 + Math.random() * 0.6)).toFixed(2)));

  return {
    id: i + 1,
    slug: `${topic.toLowerCase()}-${i + 1}`,
    title: `${topic} Masterclass ${i + 1}: From Zero to Hero`,
    subtitle: `Learn ${topic} with hands-on projects and modern best practices`,
    description: `Comprehensive ${topic} course covering fundamentals to advanced topics with practical exercises and real-world examples.`,
    instructors: [
      {
        id: i + 100,
        name: `Instructor ${i + 1}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
        bio: 'Seasoned educator with industry experience.',
        totalStudents: rand(5000, 500000),
        totalReviews: rand(200, 40000),
        rating: parseFloat((Math.random() * 0.7 + 4).toFixed(1)),
      },
    ],
    rating,
    totalRatings,
    students,
    level: pick(['Beginner','Intermediate','Expert','All'] as any),
    language: pick(['en','vi','es','jp','ko'] as any),
    subtitles: ['en','vi','es'].slice(0, rand(1, 3)),
    features: { assignments: Math.random() > 0.5, quizzes: Math.random() > 0.5, codingExercises: Math.random() > 0.5, certificate: Math.random() > 0.5 },
    durationHours: hours,
    lectures,
    lastUpdated: new Date(Date.now() - rand(0, 360)*24*3600*1000).toISOString(),
    categories: [cat],
    topics: [topic],
    price: { current, former, currency: 'USD' },
    badges: Math.random() > 0.7 ? ['Bestseller'] : Math.random() > 0.5 ? ['Hot & new'] : undefined,
    previewVideo: { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', poster: `https://picsum.photos/seed/${i + 1}/800/450` },
    curriculum: [
      { sectionId: `s-${i}-1`, title: 'Introduction', lectures: [ { lectureId: `l-${i}-1`, title: 'Welcome', durationMin: rand(2,6), previewable: true }, { lectureId: `l-${i}-2`, title: 'Setup', durationMin: rand(3,10), previewable: true } ] },
      { sectionId: `s-${i}-2`, title: 'Core Concepts', lectures: [ { lectureId: `l-${i}-3`, title: 'Essentials', durationMin: rand(5,20), previewable: false }, { lectureId: `l-${i}-4`, title: 'Project', durationMin: rand(10,40), previewable: false } ] },
    ],
    thumbnailUrl: `https://picsum.photos/seed/thumb-${i + 1}/600/338`,
  } as Course;
});

export const allCategories = Array.from(new Set(courses.flatMap(c => c.categories)));
export const allTopics = Array.from(new Set(courses.flatMap(c => c.topics)));


