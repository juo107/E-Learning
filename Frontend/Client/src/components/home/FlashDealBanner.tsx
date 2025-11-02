import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchActivePromotions, getBestPromotion, getPromotionLink, type PromotionDto } from '../../services/promotions';

interface FlashDealBannerProps {
  // Props đã bị loại bỏ - chỉ sử dụng promotion từ API
}

export default function FlashDealBanner({}: FlashDealBannerProps = {}) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(true);
  const [promotion, setPromotion] = useState<PromotionDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Random professional background images for flash deals
  const backgroundImages = useMemo(() => [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&auto=format&fit=crop&q=80', // Team collaboration
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&auto=format&fit=crop&q=80', // Education
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&auto=format&fit=crop&q=80', // Online learning
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80', // Technology
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&auto=format&fit=crop&q=80', // Professional development
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&auto=format&fit=crop&q=80', // Students studying
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&auto=format&fit=crop&q=80', // Modern workspace
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&auto=format&fit=crop&q=80', // Business meeting
  ], []);

  const randomBackground = useMemo(() => {
    return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  }, [backgroundImages]);

  // Fetch active promotions from API
  useEffect(() => {
    let cancelled = false;

    const loadPromotion = async () => {
      try {
        setLoading(true);
        const response = await fetchActivePromotions();
        
        if (cancelled) return;

        if (response.success && response.data && response.data.length > 0) {
          const bestPromotion = getBestPromotion(response.data);
          if (bestPromotion) {
            setPromotion(bestPromotion);
          }
        } else {
          // Không có promotion thì set null
          setPromotion(null);
        }
      } catch (error) {
        console.error('Failed to load promotion:', error);
        if (!cancelled) {
          setPromotion(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPromotion();

    // Auto-refresh mỗi 30 giây để cập nhật ngay lập tức khi có promotion mới
    const refreshInterval = setInterval(() => {
      if (!cancelled) {
        loadPromotion();
      }
    }, 30000); // 30 giây

    // Refresh khi window được focus lại (user quay lại tab)
    const handleFocus = () => {
      if (!cancelled) {
        loadPromotion();
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      cancelled = true;
      clearInterval(refreshInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Chỉ sử dụng promotion từ API, không có fallback
  // Nếu không có promotion thì không hiển thị banner

  // Countdown timer effect - chỉ chạy khi có promotion
  useEffect(() => {
    if (!promotion) return;

    // Parse endDate - đảm bảo xử lý đúng timezone
    // Backend trả về DateTime có thể là UTC hoặc có timezone info
    // Nếu không có timezone info, treat như UTC string và convert
    let endDate: Date;
    if (typeof promotion.endDate === 'string') {
      // Nếu string có 'Z' hoặc '+', nó đã có timezone info
      if (promotion.endDate.includes('Z') || promotion.endDate.includes('+') || promotion.endDate.includes('-', 10)) {
        endDate = new Date(promotion.endDate);
      } else {
        // Nếu không có timezone, treat như UTC và append 'Z'
        endDate = new Date(promotion.endDate + 'Z');
      }
    } else {
      endDate = new Date(promotion.endDate);
    }
    
    const timer = setInterval(() => {
      const now = new Date().getTime(); // Current time in UTC milliseconds
      const endTime = endDate.getTime(); // End time in UTC milliseconds
      const distance = endTime - now;

      if (distance < 0) {
        setIsActive(false);
        return;
      }

      // Tính toán đúng cách: days, hours, minutes, seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [promotion]);

  // Chỉ hiển thị banner khi có promotion từ API và đang active
  // Không hiển thị khi đang loading hoặc không có promotion
  if (loading) {
    return null; // Không hiển thị gì khi đang load
  }

  if (!promotion) {
    return null; // Không hiển thị banner nếu không có promotion
  }

  // Kiểm tra promotion có còn hợp lệ không (trong thời gian hiệu lực)
  // Parse dates đúng cách với timezone
  const parseDate = (dateString: string | Date): Date => {
    if (dateString instanceof Date) return dateString;
    if (typeof dateString === 'string') {
      // Nếu có timezone info, parse trực tiếp
      if (dateString.includes('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
        return new Date(dateString);
      }
      // Nếu không có timezone, treat như UTC
      return new Date(dateString + 'Z');
    }
    return new Date(dateString);
  };

  const now = new Date();
  const startDate = parseDate(promotion.startDate);
  const endDate = parseDate(promotion.endDate);
  
  if (!promotion.isActive || now < startDate || now > endDate) {
    return null; // Không hiển thị nếu promotion không active hoặc đã hết hạn
  }

  if (!isActive) {
    return null; // Không hiển thị nếu countdown đã hết
  }

  // Lấy dữ liệu từ promotion
  const title = promotion.name || t('flashDeal.title');
  const discount = Math.round(promotion.value); // Hiển thị đúng phần trăm từ promotion
  const description = promotion.description || t('flashDeal.description');
  const linkTo = getPromotionLink(promotion);

  return (
    <section className="w-full px-4 py-12 relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/8 via-red-500/6 to-pink-500/8"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-white text-sm font-semibold mb-4 shadow-lg">
              <Zap className="w-4 h-4" />
              <span>{t('flashDeal.badge')}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {title || t('flashDeal.title')}
            </h2>
            
            <p className="text-lg md:text-xl text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              {description || t('flashDeal.description')}
            </p>

            {/* Countdown Timer */}
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center gap-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{t('flashDeal.endsIn')}</span>
              </div>
              <div className="flex gap-3">
                {[
                  { label: t('flashDeal.days') || 'Days', value: timeLeft.days },
                  { label: t('flashDeal.hours'), value: timeLeft.hours },
                  { label: t('flashDeal.minutes'), value: timeLeft.minutes },
                  { label: t('flashDeal.seconds'), value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/30 backdrop-blur-md rounded-lg px-4 py-2 min-w-[70px] text-center shadow-lg"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to={linkTo}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-red-600 font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('flashDeal.shopNow', { discount })}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right: Visual Element */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="text-8xl md:text-9xl font-extrabold text-white/60 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] select-none">
                {discount}%
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-2xl md:text-3xl font-bold bg-gradient-to-br from-white/40 to-white/30 backdrop-blur-md px-6 py-3 rounded-xl shadow-2xl border border-white/20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                  {t('flashDeal.off')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

