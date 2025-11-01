export type Instructor = {
  id: number;
  name: string;
  avatarUrl: string;
  bio: string;
  totalStudents: number;
  totalReviews: number;
  rating: number;
};

export type Price = {
  current: number;
  former?: number;
  currency: 'USD' | 'VND';
};

export type Lecture = {
  lectureId: string;
  title: string;
  durationMin: number;
  previewable: boolean;
  videoSrc?: string;
};

export type CurriculumSection = {
  sectionId: string;
  title: string;
  lectures: Lecture[];
};

export type Course = {
  courseId: number;
  slug: string;
  title: string;
  shortDescription: string;
  description?: string;
  teacherName?: string;
  categoryName?: string;
  categoryId?: number;
  level?: string;
  language: string;
  price: number;
  discountPrice?: number;
  averageRating: number;
  ratingCount: number;
  viewCount: number;
  enrollmentCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  tags?: string[];
  // Legacy fields for backward compatibility
  instructors?: Instructor[];
  students?: number;
  totalRatings?: number;
  rating?: number;
  durationHours?: number;
  lectures?: number;
  lastUpdated?: string;
  categories?: string[];
  topics?: string[];
  badges?: Array<'Bestseller' | 'Hot & new' | 'Highest rated'>;
  previewVideo?: { src: string; poster: string };
  curriculum?: CurriculumSection[];
  features?: { assignments: boolean; quizzes: boolean; codingExercises: boolean; certificate: boolean };
  subtitles?: string[];
};














