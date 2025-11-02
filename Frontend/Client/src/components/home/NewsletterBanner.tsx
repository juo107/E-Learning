import { useState, useMemo } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NewsletterBanner() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Random professional background images for newsletter
  const backgroundImages = useMemo(() => [
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&auto=format&fit=crop&q=80', // Students studying
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&auto=format&fit=crop&q=80', // Team collaboration
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&auto=format&fit=crop&q=80', // Online learning
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80', // Technology
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&auto=format&fit=crop&q=80', // Professional development
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&auto=format&fit=crop&q=80', // Modern workspace
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1920&auto=format&fit=crop&q=80', // Reading/learning
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&auto=format&fit=crop&q=80', // Business meeting
  ], []);

  const randomBackground = useMemo(() => {
    return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  }, [backgroundImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section className="w-full px-4 py-20 relative overflow-hidden">
      {/* Random professional background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={randomBackground}
          alt="Professional education background"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Light overlay for text readability - let image shine through */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/35 to-black/40 dark:from-black/45 dark:via-black/40 dark:to-black/45"></div>
        {/* Very subtle accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/8 via-purple-500/6 to-pink-500/8"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/30 backdrop-blur-md rounded-full mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {t('newsletter.title')}
          </h2>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {t('newsletter.subtitle')}
          </p>
        </div>

        {isSuccess ? (
          <div className="flex items-center justify-center gap-3 bg-white/30 backdrop-blur-md rounded-xl p-6 text-white shadow-lg">
            <CheckCircle2 className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
            <span className="text-lg font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{t('newsletter.success')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.emailPlaceholder')}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/95 dark:bg-gray-900/95 border-2 border-white/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner w-5 h-5 border-2 border-indigo-600 border-t-transparent"></div>
                  <span>{t('newsletter.subscribing')}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{t('newsletter.subscribe')}</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {t('newsletter.privacy')}
          </p>
        </div>
      </div>
    </section>
  );
}

