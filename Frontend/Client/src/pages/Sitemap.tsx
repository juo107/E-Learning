import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Settings, 
  HelpCircle, 
  FileText, 
  Shield, 
  Globe,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function Sitemap() {
  const { t } = useTranslation();

  const sitemapSections = [
    {
      title: t('sitemap.learning.title'),
      icon: BookOpen,
      description: t('sitemap.learning.description'),
      links: [
        { name: t('sitemap.learning.allCourses'), href: '/courses', external: false },
        { name: t('sitemap.learning.featured'), href: '/courses?featured=true', external: false },
        { name: t('sitemap.learning.newCourses'), href: '/courses?sort=newest', external: false },
        { name: t('sitemap.learning.popular'), href: '/courses?sort=popular', external: false },
        { name: t('sitemap.learning.freeCourses'), href: '/courses?price=free', external: false },
        { name: t('sitemap.learning.categories'), href: '/categories', external: false },
      ]
    },
    {
      title: t('sitemap.categories.title'),
      icon: GraduationCap,
      description: t('sitemap.categories.description'),
      links: [
        { name: t('sitemap.categories.development'), href: '/courses?category=development', external: false },
        { name: t('sitemap.categories.design'), href: '/courses?category=design', external: false },
        { name: t('sitemap.categories.business'), href: '/courses?category=business', external: false },
        { name: t('sitemap.categories.marketing'), href: '/courses?category=marketing', external: false },
        { name: t('sitemap.categories.itSoftware'), href: '/courses?category=it-software', external: false },
        { name: t('sitemap.categories.personalDev'), href: '/courses?category=personal-development', external: false },
      ]
    },
    {
      title: t('sitemap.student.title'),
      icon: Users,
      description: t('sitemap.student.description'),
      links: [
        { name: t('sitemap.student.dashboard'), href: '/dashboard', external: false },
        { name: t('sitemap.student.myCourses'), href: '/my-courses', external: false },
        { name: t('sitemap.student.progress'), href: '/progress', external: false },
        { name: t('sitemap.student.certificates'), href: '/certificates', external: false },
        { name: t('sitemap.student.wishlist'), href: '/wishlist', external: false },
        { name: t('sitemap.student.profile'), href: '/profile', external: false },
      ]
    },
    {
      title: t('sitemap.instructor.title'),
      icon: GraduationCap,
      description: t('sitemap.instructor.description'),
      links: [
        { name: t('sitemap.instructor.teachOnPlatform'), href: '/instructors', external: false },
        { name: t('sitemap.instructor.createCourse'), href: '/instructors/create', external: false },
        { name: t('sitemap.instructor.myCourses'), href: '/instructors/courses', external: false },
        { name: t('sitemap.instructor.analytics'), href: '/instructors/analytics', external: false },
        { name: t('sitemap.instructor.earnings'), href: '/instructors/earnings', external: false },
        { name: t('sitemap.instructor.community'), href: '/instructors/community', external: false },
      ]
    },
    {
      title: t('sitemap.support.title'),
      icon: HelpCircle,
      description: t('sitemap.support.description'),
      links: [
        { name: t('sitemap.support.helpCenter'), href: '/help', external: false },
        { name: t('sitemap.support.contactUs'), href: '/contact', external: false },
        { name: t('sitemap.support.faq'), href: '/faq', external: false },
        { name: t('sitemap.support.community'), href: '/community', external: false },
        { name: t('sitemap.support.status'), href: '/status', external: false },
        { name: t('sitemap.support.feedback'), href: '/feedback', external: false },
      ]
    },
    {
      title: t('sitemap.company.title'),
      icon: Globe,
      description: t('sitemap.company.description'),
      links: [
        { name: t('sitemap.company.about'), href: '/about', external: false },
        { name: t('sitemap.company.careers'), href: '/careers', external: false },
        { name: t('sitemap.company.blog'), href: '/blog', external: false },
        { name: t('sitemap.company.press'), href: '/press', external: false },
        { name: t('sitemap.company.partners'), href: '/partners', external: false },
        { name: t('sitemap.company.investors'), href: '/investors', external: false },
      ]
    },
    {
      title: t('sitemap.legal.title'),
      icon: Shield,
      description: t('sitemap.legal.description'),
      links: [
        { name: t('sitemap.legal.terms'), href: '/terms', external: false },
        { name: t('sitemap.legal.privacy'), href: '/privacy', external: false },
        { name: t('sitemap.legal.cookies'), href: '/cookies', external: false },
        { name: t('sitemap.legal.accessibility'), href: '/accessibility', external: false },
        { name: t('sitemap.legal.security'), href: '/security', external: false },
        { name: t('sitemap.legal.compliance'), href: '/compliance', external: false },
      ]
    },
    {
      title: t('sitemap.resources.title'),
      icon: FileText,
      description: t('sitemap.resources.description'),
      links: [
        { name: t('sitemap.resources.guides'), href: '/guides', external: false },
        { name: t('sitemap.resources.tutorials'), href: '/tutorials', external: false },
        { name: t('sitemap.resources.webinars'), href: '/webinars', external: false },
        { name: t('sitemap.resources.events'), href: '/events', external: false },
        { name: t('sitemap.resources.api'), href: '/api-docs', external: true },
        { name: t('sitemap.resources.developer'), href: '/developer', external: false },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('sitemap.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('sitemap.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sitemapSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {section.description}
                </p>

                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.href}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="flex-1">{link.name}</span>
                        {link.external && (
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {t('sitemap.stats.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">1,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('sitemap.stats.courses')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">50,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('sitemap.stats.students')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">100+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('sitemap.stats.instructors')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('sitemap.stats.categories')}</div>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            {t('sitemap.search.title')}
          </h3>
          <p className="text-indigo-100 mb-6">
            {t('sitemap.search.description')}
          </p>
          <div className="max-w-md mx-auto">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              {t('sitemap.search.browseCourses')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
