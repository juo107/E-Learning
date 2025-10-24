import { useTranslation } from 'react-i18next';
import { 
  Handshake, 
  Globe, 
  Users,
  TrendingUp,
  Shield,
  Lightbulb,
  BookOpen,
  ExternalLink,
  CheckCircle,
  Star,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function Partners() {
  const { t } = useTranslation();

  const partnerTypes = [
    {
      icon: BookOpen,
      title: t('partners.types.educational.title'),
      description: t('partners.types.educational.description'),
      benefits: [
        t('partners.types.educational.benefit1'),
        t('partners.types.educational.benefit2'),
        t('partners.types.educational.benefit3')
      ]
    },
    {
      icon: TrendingUp,
      title: t('partners.types.technology.title'),
      description: t('partners.types.technology.description'),
      benefits: [
        t('partners.types.technology.benefit1'),
        t('partners.types.technology.benefit2'),
        t('partners.types.technology.benefit3')
      ]
    },
    {
      icon: Globe,
      title: t('partners.types.global.title'),
      description: t('partners.types.global.description'),
      benefits: [
        t('partners.types.global.benefit1'),
        t('partners.types.global.benefit2'),
        t('partners.types.global.benefit3')
      ]
    },
    {
      icon: Shield,
      title: t('partners.types.corporate.title'),
      description: t('partners.types.corporate.description'),
      benefits: [
        t('partners.types.corporate.benefit1'),
        t('partners.types.corporate.benefit2'),
        t('partners.types.corporate.benefit3')
      ]
    }
  ];

  const currentPartners = [
    {
      name: t('partners.current.microsoft.name'),
      type: t('partners.current.microsoft.type'),
      description: t('partners.current.microsoft.description'),
      logo: '/api/placeholder/200/100',
      website: '#'
    },
    {
      name: t('partners.current.google.name'),
      type: t('partners.current.google.type'),
      description: t('partners.current.google.description'),
      logo: '/api/placeholder/200/100',
      website: '#'
    },
    {
      name: t('partners.current.amazon.name'),
      type: t('partners.current.amazon.type'),
      description: t('partners.current.amazon.description'),
      logo: '/api/placeholder/200/100',
      website: '#'
    },
    {
      name: t('partners.current.ibm.name'),
      type: t('partners.current.ibm.type'),
      description: t('partners.current.ibm.description'),
      logo: '/api/placeholder/200/100',
      website: '#'
    },
    {
      name: t('partners.current.oracle.name'),
      type: t('partners.current.oracle.type'),
      description: t('partners.current.oracle.description'),
      logo: '/api/placeholder/200/100',
      website: '#'
    },
    {
      name: t('partners.current.salesforce.name'),
      type: t('partners.current.salesforce.type'),
      description: t('partners.current.salesforce.description'),
      logo: '/api/placeholder/200/100',
      website: '#'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: t('partners.benefits.growth.title'),
      description: t('partners.benefits.growth.description')
    },
    {
      icon: Users,
      title: t('partners.benefits.network.title'),
      description: t('partners.benefits.network.description')
    },
    {
      icon: Lightbulb,
      title: t('partners.benefits.innovation.title'),
      description: t('partners.benefits.innovation.description')
    },
    {
      icon: Shield,
      title: t('partners.benefits.support.title'),
      description: t('partners.benefits.support.description')
    }
  ];

  const successStories = [
    {
      title: t('partners.success.story1.title'),
      partner: t('partners.success.story1.partner'),
      result: t('partners.success.story1.result'),
      description: t('partners.success.story1.description')
    },
    {
      title: t('partners.success.story2.title'),
      partner: t('partners.success.story2.partner'),
      result: t('partners.success.story2.result'),
      description: t('partners.success.story2.description')
    },
    {
      title: t('partners.success.story3.title'),
      partner: t('partners.success.story3.partner'),
      result: t('partners.success.story3.result'),
      description: t('partners.success.story3.description')
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
              {t('partners.hero.title')}
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              {t('partners.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Handshake className="w-5 h-5" />
                {t('partners.hero.becomePartner')}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                {t('partners.hero.learnMore')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Types */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('partners.types.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('partners.types.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnerTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {type.description}
                  </p>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Partners */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('partners.current.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('partners.current.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPartners.map((partner, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {partner.name}
                </h3>
                <div className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                  {partner.type}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {partner.description}
                </p>
                <a
                  href={partner.website}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center justify-center gap-1"
                >
                  {t('partners.visitWebsite')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('partners.benefits.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('partners.benefits.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
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

      {/* Success Stories */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('partners.success.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('partners.success.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {story.title}
                </h3>
                <div className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                  {story.partner}
                </div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                  {story.result}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {story.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partnership Process */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('partners.process.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('partners.process.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('partners.process.step1.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('partners.process.step1.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('partners.process.step2.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('partners.process.step2.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('partners.process.step3.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('partners.process.step3.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('partners.process.step4.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('partners.process.step4.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {t('partners.cta.title')}
              </h2>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                {t('partners.cta.description')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{t('partners.contact.email.title')}</h3>
                <p className="text-indigo-100">partners@elearning.com</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{t('partners.contact.phone.title')}</h3>
                <p className="text-indigo-100">+1 (555) 123-4567</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{t('partners.contact.address.title')}</h3>
                <p className="text-indigo-100">San Francisco, CA</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                {t('partners.cta.becomePartner')}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                {t('partners.cta.downloadKit')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
