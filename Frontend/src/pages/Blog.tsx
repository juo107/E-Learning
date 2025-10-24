import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  User, 
  Tag, 
  ArrowRight,
  Search,
  Filter,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Code,
  Palette,
  Briefcase,
  Heart,
  MessageCircle,
  Share2,
  Clock
} from 'lucide-react';

export default function Blog() {
  const { t } = useTranslation();

  const featuredPost = {
    title: t('blog.featured.title'),
    excerpt: t('blog.featured.excerpt'),
    author: t('blog.featured.author'),
    date: t('blog.featured.date'),
    readTime: t('blog.featured.readTime'),
    category: t('blog.featured.category'),
    image: '/api/placeholder/800/400',
    tags: [t('blog.featured.tag1'), t('blog.featured.tag2'), t('blog.featured.tag3')]
  };

  const categories = [
    { icon: Code, name: t('blog.categories.technology'), count: 24 },
    { icon: Palette, name: t('blog.categories.design'), count: 18 },
    { icon: BookOpen, name: t('blog.categories.education'), count: 32 },
    { icon: Briefcase, name: t('blog.categories.business'), count: 15 },
    { icon: Lightbulb, name: t('blog.categories.innovation'), count: 12 },
    { icon: Heart, name: t('blog.categories.lifestyle'), count: 8 }
  ];

  const posts = [
    {
      title: t('blog.posts.post1.title'),
      excerpt: t('blog.posts.post1.excerpt'),
      author: t('blog.posts.post1.author'),
      date: t('blog.posts.post1.date'),
      readTime: t('blog.posts.post1.readTime'),
      category: t('blog.posts.post1.category'),
      image: '/api/placeholder/400/250',
      tags: [t('blog.posts.post1.tag1'), t('blog.posts.post1.tag2')]
    },
    {
      title: t('blog.posts.post2.title'),
      excerpt: t('blog.posts.post2.excerpt'),
      author: t('blog.posts.post2.author'),
      date: t('blog.posts.post2.date'),
      readTime: t('blog.posts.post2.readTime'),
      category: t('blog.posts.post2.category'),
      image: '/api/placeholder/400/250',
      tags: [t('blog.posts.post2.tag1'), t('blog.posts.post2.tag2')]
    },
    {
      title: t('blog.posts.post3.title'),
      excerpt: t('blog.posts.post3.excerpt'),
      author: t('blog.posts.post3.author'),
      date: t('blog.posts.post3.date'),
      readTime: t('blog.posts.post3.readTime'),
      category: t('blog.posts.post3.category'),
      image: '/api/placeholder/400/250',
      tags: [t('blog.posts.post3.tag1'), t('blog.posts.post3.tag2')]
    },
    {
      title: t('blog.posts.post4.title'),
      excerpt: t('blog.posts.post4.excerpt'),
      author: t('blog.posts.post4.author'),
      date: t('blog.posts.post4.date'),
      readTime: t('blog.posts.post4.readTime'),
      category: t('blog.posts.post4.category'),
      image: '/api/placeholder/400/250',
      tags: [t('blog.posts.post4.tag1'), t('blog.posts.post4.tag2')]
    },
    {
      title: t('blog.posts.post5.title'),
      excerpt: t('blog.posts.post5.excerpt'),
      author: t('blog.posts.post5.author'),
      date: t('blog.posts.post5.date'),
      readTime: t('blog.posts.post5.readTime'),
      category: t('blog.posts.post5.category'),
      image: '/api/placeholder/400/250',
      tags: [t('blog.posts.post5.tag1'), t('blog.posts.post5.tag2')]
    },
    {
      title: t('blog.posts.post6.title'),
      excerpt: t('blog.posts.post6.excerpt'),
      author: t('blog.posts.post6.author'),
      date: t('blog.posts.post6.date'),
      readTime: t('blog.posts.post6.readTime'),
      category: t('blog.posts.post6.category'),
      image: '/api/placeholder/400/250',
      tags: [t('blog.posts.post6.tag1'), t('blog.posts.post6.tag2')]
    }
  ];

  const trendingTags = [
    t('blog.trendingTags.ai'),
    t('blog.trendingTags.react'),
    t('blog.trendingTags.design'),
    t('blog.trendingTags.career'),
    t('blog.trendingTags.learning'),
    t('blog.trendingTags.innovation'),
    t('blog.trendingTags.remote'),
    t('blog.trendingTags.startup')
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              {t('blog.hero.title')}
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              {t('blog.hero.description')}
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('blog.hero.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-64 lg:h-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  {t('blog.readMore')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('blog.sidebar.categories')}
                </h3>
                <div className="space-y-3">
                  {categories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {category.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trending Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('blog.sidebar.trendingTags')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">
                  {t('blog.sidebar.newsletter.title')}
                </h3>
                <p className="text-indigo-100 mb-4">
                  {t('blog.sidebar.newsletter.description')}
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder={t('blog.sidebar.newsletter.emailPlaceholder')}
                    className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    {t('blog.sidebar.newsletter.subscribe')}
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('blog.posts.title')}
                </h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>{t('blog.posts.sortBy')}</option>
                    <option>{t('blog.posts.sortOptions.latest')}</option>
                    <option>{t('blog.posts.sortOptions.popular')}</option>
                    <option>{t('blog.posts.sortOptions.trending')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post, index) => (
                  <article key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <button className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1">
                          {t('blog.readMore')}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">12</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  {t('blog.loadMore')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
