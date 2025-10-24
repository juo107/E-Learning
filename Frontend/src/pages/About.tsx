import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: '50,000+', label: t('about.stats.students') },
    { icon: Award, value: '1,000+', label: t('about.stats.courses') },
    { icon: Globe, value: '100+', label: t('about.stats.countries') },
    { icon: Heart, value: '98%', label: t('about.stats.satisfaction') }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    },
    {
      icon: Users,
      title: t('about.values.community.title'),
      description: t('about.values.community.description')
    },
    {
      icon: Target,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description')
    },
    {
      icon: Heart,
      title: t('about.values.passion.title'),
      description: t('about.values.passion.description')
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: t('about.milestones.founded.title'),
      description: t('about.milestones.founded.description')
    },
    {
      year: '2021',
      title: t('about.milestones.firstStudents.title'),
      description: t('about.milestones.firstStudents.description')
    },
    {
      year: '2022',
      title: t('about.milestones.international.title'),
      description: t('about.milestones.international.description')
    },
    {
      year: '2023',
      title: t('about.milestones.awards.title'),
      description: t('about.milestones.awards.description')
    },
    {
      year: '2024',
      title: t('about.milestones.ai.title'),
      description: t('about.milestones.ai.description')
    }
  ];

  const team = [
    {
      name: t('about.team.ceo.name'),
      role: t('about.team.ceo.role'),
      image: '/api/placeholder/300/300',
      description: t('about.team.ceo.description')
    },
    {
      name: t('about.team.cto.name'),
      role: t('about.team.cto.role'),
      image: '/api/placeholder/300/300',
      description: t('about.team.cto.description')
    },
    {
      name: t('about.team.cmo.name'),
      role: t('about.team.cmo.role'),
      image: '/api/placeholder/300/300',
      description: t('about.team.cmo.description')
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
              {t('about.hero.title')}
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              {t('about.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Play className="w-5 h-5" />
                {t('about.hero.watchVideo')}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                {t('about.hero.learnMore')}
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

      {/* Mission Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {t('about.mission.description')}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('about.mission.point1.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('about.mission.point1.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('about.mission.point2.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('about.mission.point2.description')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('about.mission.point3.title')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('about.mission.point3.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-indigo-200" />
                  <h3 className="text-2xl font-bold mb-4">
                    {t('about.mission.impact.title')}
                  </h3>
                  <p className="text-indigo-100 mb-6">
                    {t('about.mission.impact.description')}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">95%</div>
                      <div className="text-sm text-indigo-200">
                        {t('about.mission.impact.completion')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">4.8/5</div>
                      <div className="text-sm text-indigo-200">
                        {t('about.mission.impact.rating')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('about.values.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.timeline.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('about.timeline.description')}
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

      {/* Team Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('about.team.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <div className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              {t('about.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                {t('about.cta.joinUs')}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                {t('about.cta.contactUs')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




