import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Zap, 
  Shield,
  Award,
  Coffee,
  Laptop,
  DollarSign,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Star,
  Globe
} from 'lucide-react';

export default function Careers() {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Heart,
      title: t('careers.benefits.health.title'),
      description: t('careers.benefits.health.description')
    },
    {
      icon: Laptop,
      title: t('careers.benefits.remote.title'),
      description: t('careers.benefits.remote.description')
    },
    {
      icon: BookOpen,
      title: t('careers.benefits.learning.title'),
      description: t('careers.benefits.learning.description')
    },
    {
      icon: DollarSign,
      title: t('careers.benefits.equity.title'),
      description: t('careers.benefits.equity.description')
    },
    {
      icon: Coffee,
      title: t('careers.benefits.flexible.title'),
      description: t('careers.benefits.flexible.description')
    },
    {
      icon: Award,
      title: t('careers.benefits.recognition.title'),
      description: t('careers.benefits.recognition.description')
    }
  ];

  const openPositions = [
    {
      title: t('careers.positions.frontend.title'),
      department: t('careers.positions.frontend.department'),
      location: t('careers.positions.frontend.location'),
      type: t('careers.positions.frontend.type'),
      description: t('careers.positions.frontend.description'),
      requirements: [
        t('careers.positions.frontend.req1'),
        t('careers.positions.frontend.req2'),
        t('careers.positions.frontend.req3'),
        t('careers.positions.frontend.req4')
      ]
    },
    {
      title: t('careers.positions.backend.title'),
      department: t('careers.positions.backend.department'),
      location: t('careers.positions.backend.location'),
      type: t('careers.positions.backend.type'),
      description: t('careers.positions.backend.description'),
      requirements: [
        t('careers.positions.backend.req1'),
        t('careers.positions.backend.req2'),
        t('careers.positions.backend.req3'),
        t('careers.positions.backend.req4')
      ]
    },
    {
      title: t('careers.positions.designer.title'),
      department: t('careers.positions.designer.department'),
      location: t('careers.positions.designer.location'),
      type: t('careers.positions.designer.type'),
      description: t('careers.positions.designer.description'),
      requirements: [
        t('careers.positions.designer.req1'),
        t('careers.positions.designer.req2'),
        t('careers.positions.designer.req3'),
        t('careers.positions.designer.req4')
      ]
    },
    {
      title: t('careers.positions.marketing.title'),
      department: t('careers.positions.marketing.department'),
      location: t('careers.positions.marketing.location'),
      type: t('careers.positions.marketing.type'),
      description: t('careers.positions.marketing.description'),
      requirements: [
        t('careers.positions.marketing.req1'),
        t('careers.positions.marketing.req2'),
        t('careers.positions.marketing.req3'),
        t('careers.positions.marketing.req4')
      ]
    }
  ];

  const culture = [
    {
      icon: Users,
      title: t('careers.culture.collaboration.title'),
      description: t('careers.culture.collaboration.description')
    },
    {
      icon: Zap,
      title: t('careers.culture.innovation.title'),
      description: t('careers.culture.innovation.description')
    },
    {
      icon: Globe,
      title: t('careers.culture.diversity.title'),
      description: t('careers.culture.diversity.description')
    },
    {
      icon: Shield,
      title: t('careers.culture.integrity.title'),
      description: t('careers.culture.integrity.description')
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              {t('careers.hero.title')}
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              {t('careers.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                {t('careers.hero.viewPositions')}
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                {t('careers.hero.learnMore')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">{t('careers.stats.employees')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">15</div>
              <div className="text-gray-600 dark:text-gray-400">{t('careers.stats.countries')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">4.8/5</div>
              <div className="text-gray-600 dark:text-gray-400">{t('careers.stats.rating')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-400">{t('careers.stats.retention')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('careers.whyJoin.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('careers.whyJoin.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('careers.culture.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('careers.culture.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {culture.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('careers.positions.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('careers.positions.description')}
            </p>
          </div>
          <div className="space-y-8">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {position.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {position.type}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {position.description}
                    </p>
                  </div>
                  <div className="lg:ml-8">
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      {t('careers.positions.apply')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('careers.positions.requirements')}:
                  </h4>
                  <ul className="space-y-2">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('careers.testimonials.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('careers.testimonials.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "{t('careers.testimonials.testimonial1.content')}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {t('careers.testimonials.testimonial1.author')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('careers.testimonials.testimonial1.role')}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "{t('careers.testimonials.testimonial2.content')}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {t('careers.testimonials.testimonial2.author')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('careers.testimonials.testimonial2.role')}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                "{t('careers.testimonials.testimonial3.content')}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {t('careers.testimonials.testimonial3.author')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('careers.testimonials.testimonial3.role')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {t('careers.cta.title')}
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              {t('careers.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                {t('careers.cta.viewPositions')}
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                {t('careers.cta.contactUs')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
