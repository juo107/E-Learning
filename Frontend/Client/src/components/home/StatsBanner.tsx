import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, BookOpen, Award, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

// Hook để animate số từ 0 lên giá trị đích
function useCountUp(targetValue: string, duration: number = 2000, isVisible: boolean) {
  const [displayValue, setDisplayValue] = useState('0');
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    // Parse giá trị target
    const parseValue = (val: string): number => {
      const cleanVal = val.replace(/[^\d.]/g, '');
      const num = parseFloat(cleanVal);
      
      if (val.includes('K')) {
        return num * 1000;
      }
      return num;
    };

    // Format lại giá trị với đơn vị gốc
    const formatValue = (num: number, original: string): string => {
      if (original.includes('K')) {
        const kValue = num / 1000;
        return kValue % 1 === 0 ? `${kValue}K+` : `${kValue.toFixed(1)}K+`;
      }
      if (original.includes('%')) {
        return `${Math.round(num)}%`;
      }
      if (original.includes('+')) {
        return `${Math.round(num)}+`;
      }
      return Math.round(num).toString();
    };

    const targetNum = parseValue(targetValue);
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (targetNum - startValue) * easeOut;
      setDisplayValue(formatValue(currentValue, targetValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasAnimated.current = true;
        setDisplayValue(targetValue); // Đảm bảo hiển thị đúng giá trị cuối
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration, isVisible]);

  return displayValue;
}

// Component cho mỗi stat với animation
function AnimatedStat({ stat, index }: { stat: StatItem; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statRef.current) {
      observer.observe(statRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animatedValue = useCountUp(stat.value, 2000 + index * 200, isVisible);

  return (
    <div
      ref={statRef}
      className="group flex flex-col items-center text-center p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all transform hover:-translate-y-1 w-full"
    >
      <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white group-hover:scale-110 transition-transform">
        {stat.icon}
      </div>
      <div className="mb-2 flex flex-col items-center">
        {stat.prefix && (
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {stat.prefix}
          </span>
        )}
        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          {animatedValue}
        </span>
        {stat.suffix && (
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {stat.suffix}
          </span>
        )}
      </div>
      <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 dark:text-gray-400 mt-1">
        {stat.label}
      </p>
    </div>
  );
}

export default function StatsBanner() {
  const { t } = useTranslation();
  
  const stats: StatItem[] = [
    {
      icon: <Users className="w-8 h-8" />,
      value: '500K+',
      label: t('stats.activeLearners.label'),
      suffix: t('stats.activeLearners.suffix'),
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      value: '10K+',
      label: t('stats.onlineCourses.label'),
      suffix: t('stats.onlineCourses.suffix'),
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: '2.5K+',
      label: t('stats.expertInstructors.label'),
      suffix: t('stats.expertInstructors.suffix'),
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: '180+',
      label: t('stats.countries.label'),
      suffix: t('stats.countries.suffix'),
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: '98%',
      label: t('stats.successRate.label'),
      suffix: t('stats.successRate.suffix'),
    },
  ];

  return (
    <section className="w-full px-4 py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t('stats.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('stats.subtitle')}
          </p>
        </div>

        <div className="w-full overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 w-full max-w-none">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

