import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Briefcase, DollarSign, Server, FileText, User, Palette, Megaphone, Glasses, Camera, Dumbbell, Music2, BookOpen, Database, Shield, Cloud, Cpu } from 'lucide-react';
import { fetchCategories, type CategoryItem } from '../../services/categories';

// Icon mapping for categories
const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, any> = {
    'Development': Code,
    'Business': Briefcase,
    'Finance & Accounting': DollarSign,
    'IT & Software': Server,
    'Office Productivity': FileText,
    'Personal Development': User,
    'Design': Palette,
    'Marketing': Megaphone,
    'Lifestyle': Glasses,
    'Photography & Video': Camera,
    'Health & Fitness': Dumbbell,
    'Music': Music2,
    'Teaching & Academics': BookOpen,
    'Data Science': Database,
    'Cybersecurity': Shield,
    'Cloud Computing': Cloud,
    'Programming': Cpu,
  };
  
  return iconMap[categoryName] || Code;
};

export default function CategoryGrid() {
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

  // Use only API data - show root categories
  const displayItems = categories.slice(0, 12).map(cat => ({
    label: cat.name,
    icon: getCategoryIcon(cat.name),
    id: cat.id,
    slug: cat.slug,
    subcategories: cat.subcategories
  }));

  return (
    <section aria-labelledby="top-categories" className="py-10">
      <div className="w-full px-4">
        <h2 id="top-categories" className="text-2xl font-semibold mb-4">
          {t('categories.title')}
        </h2>
        
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950 animate-pulse">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('common.somethingWentWrong')}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {!loading && !error && displayItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayItems.map((item) => (
              <a 
                key={item.label} 
                href={`/courses?category=${item.slug || item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950 hover:shadow-md transition-all"
              >
                <item.icon className="size-6 text-indigo-600 group-hover:scale-105 transition-transform" aria-hidden="true" />
                <div className="mt-3 text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.label}
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && !error && displayItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No categories available</p>
          </div>
        )}
      </div>
    </section>
  );
}


