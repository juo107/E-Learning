import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Globe,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  FileText,
  Calendar,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Star,
  CheckCircle,
  Lightbulb,
  Shield,
  Target
} from 'lucide-react';

export default function Investors() {
  const { t } = useTranslation();

  const keyMetrics = [
    {
      icon: Users,
      value: '50,000+',
      label: t('investors.metrics.students'),
      change: '+25%',
      changeType: 'positive'
    },
    {
      icon: DollarSign,
      value: '$2.5M',
      label: t('investors.metrics.revenue'),
      change: '+40%',
      changeType: 'positive'
    },
    {
      icon: Globe,
      value: '100+',
      label: t('investors.metrics.countries'),
      change: '+15%',
      changeType: 'positive'
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: t('investors.metrics.satisfaction'),
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const financialHighlights = [
    {
      title: t('investors.financial.revenue.title'),
      value: '$2.5M',
      description: t('investors.financial.revenue.description'),
      icon: DollarSign
    },
    {
      title: t('investors.financial.growth.title'),
      value: '40%',
      description: t('investors.financial.growth.description'),
      icon: TrendingUp
    },
    {
      title: t('investors.financial.margin.title'),
      value: '35%',
      description: t('investors.financial.margin.description'),
      icon: BarChart3
    },
    {
      title: t('investors.financial.retention.title'),
      value: '85%',
      description: t('investors.financial.retention.description'),
      icon: Target
    }
  ];

  const documents = [
    {
      title: t('investors.documents.quarterly.title'),
      description: t('investors.documents.quarterly.description'),
      date: t('investors.documents.quarterly.date'),
      size: '2.5 MB',
      icon: FileText
    },
    {
      title: t('investors.documents.annual.title'),
      description: t('investors.documents.annual.description'),
      date: t('investors.documents.annual.date'),
      size: '8.2 MB',
      icon: FileText
    },
    {
      title: t('investors.documents.presentation.title'),
      description: t('investors.documents.presentation.description'),
      date: t('investors.documents.presentation.date'),
      size: '15.8 MB',
      icon: FileText
    },
    {
      title: t('investors.documents.financials.title'),
      description: t('investors.documents.financials.description'),
      date: t('investors.documents.financials.date'),
      size: '3.1 MB',
      icon: FileText
    }
  ];

  const leadership = [
    {
      name: t('investors.leadership.ceo.name'),
      role: t('investors.leadership.ceo.role'),
      experience: t('investors.leadership.ceo.experience'),
      description: t('investors.leadership.ceo.description')
    },
    {
      name: t('investors.leadership.cfo.name'),
      role: t('investors.leadership.cfo.role'),
      experience: t('investors.leadership.cfo.experience'),
      description: t('investors.leadership.cfo.description')
    },
    {
      name: t('investors.leadership.cto.name'),
      role: t('investors.leadership.cto.role'),
      experience: t('investors.leadership.cto.experience'),
      description: t('investors.leadership.cto.description')
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: t('investors.milestones.founded.title'),
      description: t('investors.milestones.founded.description')
    },
    {
      year: '2021',
      title: t('investors.milestones.seed.title'),
      description: t('investors.milestones.seed.description')
    },
    {
      year: '2022',
      title: t('investors.milestones.seriesA.title'),
      description: t('investors.milestones.seriesA.description')
    },
    {
      year: '2023',
      title: t('investors.milestones.expansion.title'),
      description: t('investors.milestones.expansion.description')
    },
    {
      year: '2024',
      title: t('investors.milestones.seriesB.title'),
      description: t('investors.milestones.seriesB.description')
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
              {t('investors.hero.title')}
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              {t('investors.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                {t('investors.hero.downloadReports')}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                {t('investors.hero.contactUs')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('investors.metrics.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('investors.metrics.description')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {keyMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {metric.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mb-2">
                    {metric.label}
                  </div>
                  <div className={`text-sm font-medium ${
                    metric.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {metric.change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Highlights */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('investors.financial.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('investors.financial.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {financialHighlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {highlight.title}
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                    {highlight.value}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('investors.documents.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('investors.documents.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documents.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {doc.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {doc.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {doc.date}
                        </div>
                        <div>{doc.size}</div>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        {t('investors.documents.download')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('investors.leadership.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('investors.leadership.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {leader.name}
                </h3>
                <div className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                  {leader.role}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {leader.experience}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {leader.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Milestones */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('investors.milestones.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('investors.milestones.description')}
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-indigo-200 dark:bg-indigo-800"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-indigo-600 rounded-full border-4 border-white dark:border-gray-900 z-10 flex-shrink-0"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Investment Highlights */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('investors.highlights.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('investors.highlights.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('investors.highlights.growth.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('investors.highlights.growth.description')}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('investors.highlights.innovation.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('investors.highlights.innovation.description')}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('investors.highlights.market.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('investors.highlights.market.description')}
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
                {t('investors.cta.title')}
              </h2>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                {t('investors.cta.description')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                {t('investors.cta.downloadReports')}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                {t('investors.cta.contactUs')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




