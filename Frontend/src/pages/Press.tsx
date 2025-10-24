import { useTranslation } from 'react-i18next';
import { 
  Download, 
  Calendar, 
  FileText,
  Image,
  Video,
  Globe,
  Mail,
  Phone,
  MapPin,
  Award,
  TrendingUp,
  Users,
  BookOpen,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function Press() {
  const { t } = useTranslation();

  const pressReleases = [
    {
      title: t('press.releases.release1.title'),
      date: t('press.releases.release1.date'),
      summary: t('press.releases.release1.summary'),
      category: t('press.releases.release1.category')
    },
    {
      title: t('press.releases.release2.title'),
      date: t('press.releases.release2.date'),
      summary: t('press.releases.release2.summary'),
      category: t('press.releases.release2.category')
    },
    {
      title: t('press.releases.release3.title'),
      date: t('press.releases.release3.date'),
      summary: t('press.releases.release3.summary'),
      category: t('press.releases.release3.category')
    },
    {
      title: t('press.releases.release4.title'),
      date: t('press.releases.release4.date'),
      summary: t('press.releases.release4.summary'),
      category: t('press.releases.release4.category')
    }
  ];

  const mediaKit = [
    {
      title: t('press.mediaKit.logos.title'),
      description: t('press.mediaKit.logos.description'),
      icon: Image,
      size: '2.5 MB'
    },
    {
      title: t('press.mediaKit.photos.title'),
      description: t('press.mediaKit.photos.description'),
      icon: Image,
      size: '15.2 MB'
    },
    {
      title: t('press.mediaKit.videos.title'),
      description: t('press.mediaKit.videos.description'),
      icon: Video,
      size: '45.8 MB'
    },
    {
      title: t('press.mediaKit.factSheet.title'),
      description: t('press.mediaKit.factSheet.description'),
      icon: FileText,
      size: '1.2 MB'
    }
  ];

  const coverage = [
    {
      title: t('press.coverage.article1.title'),
      source: t('press.coverage.article1.source'),
      date: t('press.coverage.article1.date'),
      excerpt: t('press.coverage.article1.excerpt'),
      link: '#'
    },
    {
      title: t('press.coverage.article2.title'),
      source: t('press.coverage.article2.source'),
      date: t('press.coverage.article2.date'),
      excerpt: t('press.coverage.article2.excerpt'),
      link: '#'
    },
    {
      title: t('press.coverage.article3.title'),
      source: t('press.coverage.article3.source'),
      date: t('press.coverage.article3.date'),
      excerpt: t('press.coverage.article3.excerpt'),
      link: '#'
    }
  ];

  const awards = [
    {
      title: t('press.awards.award1.title'),
      organization: t('press.awards.award1.organization'),
      year: t('press.awards.award1.year'),
      description: t('press.awards.award1.description'),
      icon: Award
    },
    {
      title: t('press.awards.award2.title'),
      organization: t('press.awards.award2.organization'),
      year: t('press.awards.award2.year'),
      description: t('press.awards.award2.description'),
      icon: Award
    },
    {
      title: t('press.awards.award3.title'),
      organization: t('press.awards.award3.organization'),
      year: t('press.awards.award3.year'),
      description: t('press.awards.award3.description'),
      icon: Award
    }
  ];

  const stats = [
    { icon: Users, value: '50,000+', label: t('press.stats.students') },
    { icon: BookOpen, value: '1,000+', label: t('press.stats.courses') },
    { icon: Globe, value: '100+', label: t('press.stats.countries') },
    { icon: TrendingUp, value: '95%', label: t('press.stats.satisfaction') }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              {t('press.hero.title')}
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              {t('press.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                {t('press.hero.downloadKit')}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                {t('press.hero.contactUs')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Press Releases */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('press.releases.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('press.releases.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {release.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {release.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {release.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {release.date}
                  </div>
                  <button className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1">
                    {t('press.readMore')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Kit */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('press.mediaKit.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('press.mediaKit.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaKit.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {item.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {item.size}
                  </div>
                  <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    {t('press.download')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Media Coverage */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('press.coverage.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('press.coverage.description')}
            </p>
          </div>
          <div className="space-y-6">
            {coverage.map((article, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {article.source}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {article.excerpt}
                    </p>
                    <a
                      href={article.link}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
                    >
                      {t('press.readArticle')}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Awards */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('press.awards.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('press.awards.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, index) => {
              const Icon = award.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {award.title}
                  </h3>
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                    {award.organization}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {award.year}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {award.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {t('press.contact.title')}
              </h2>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                {t('press.contact.description')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{t('press.contact.email.title')}</h3>
                <p className="text-indigo-100">press@elearning.com</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{t('press.contact.phone.title')}</h3>
                <p className="text-indigo-100">+1 (555) 123-4567</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{t('press.contact.address.title')}</h3>
                <p className="text-indigo-100">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
