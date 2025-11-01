import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCategories, type CategoryItem } from '../../services/categories';
import TopicChips from './TopicChips';

export default function FeaturedTopicsByCategory() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load categories');
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Generate topics from subcategories or use default topics
  const getTopicsForCategory = (category: CategoryItem): string[] => {
    if (category.subcategories && category.subcategories.length > 0) {
      return category.subcategories.map(sub => sub.name);
    }
    
    // Fallback topics based on category name - using i18n keys
    const fallbackTopics: Record<string, string[]> = {
      'Web Development': [
        t('topics.javascript'), t('topics.react'), t('topics.nodejs'), 
        t('topics.python'), t('topics.sql'), t('topics.docker')
      ],
      'Mobile Development': [
        t('topics.ios'), t('topics.android'), t('topics.flutter'), 
        t('topics.reactNative'), t('topics.kotlin')
      ],
      'Data Science': [
        t('topics.machineLearning'), t('topics.python'), t('topics.tensorflow'), 
        t('topics.pandas'), t('topics.statistics')
      ],
      'Cloud Computing': [
        t('topics.aws'), t('topics.azure'), t('topics.kubernetes'), 
        t('topics.docker'), t('topics.terraform')
      ],
      'Programming Languages': [
        t('topics.python'), t('topics.java'), t('topics.javascript'), 
        t('topics.csharp'), t('topics.go')
      ],
      'UI/UX Design': [
        t('topics.figma'), t('topics.adobeXd'), t('topics.sketch'), 
        t('topics.userResearch'), t('topics.prototyping')
      ]
    };

    return fallbackTopics[category.name] || [category.name];
  };

  if (loading) {
    return (
      <section className="py-10">
        <div className="w-full px-4">
          <h2 className="text-2xl font-semibold mb-4">{t('courses.featured')} {t('courses.topics')} {t('common.by')} {t('categories.title')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-950 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10">
        <div className="w-full px-4">
          <h2 className="text-2xl font-semibold mb-4">{t('courses.featured')} {t('courses.topics')} {t('common.by')} {t('categories.title')}</h2>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">{t('common.somethingWentWrong')}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show first 6 categories from API only
  const displayCategories = categories.slice(0, 6);

  if (displayCategories.length === 0) {
    return null; // Don't render if no categories
  }

  return (
    <section className="py-10">
      <div className="w-full px-4">
        <h2 className="text-2xl font-semibold mb-4">
          {t('courses.featured')} {t('courses.topics')} {t('common.by')} {t('categories.title')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => {
            const topics = getTopicsForCategory(category);
            return (
              <div key={category.id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-950 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <TopicChips topics={topics} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
