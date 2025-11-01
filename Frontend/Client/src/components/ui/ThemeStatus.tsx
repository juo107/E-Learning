import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeStatus() {
  const { theme, isDark } = useTheme();

  const getThemeInfo = () => {
    switch (theme) {
      case 'light':
        return { icon: Sun, label: 'Light Mode', color: 'text-yellow-500' };
      case 'dark':
        return { icon: Moon, label: 'Dark Mode', color: 'text-blue-400' };
      case 'system':
        return { icon: Monitor, label: `System (${isDark ? 'Dark' : 'Light'})`, color: 'text-gray-500' };
      default:
        return { icon: Sun, label: 'Light Mode', color: 'text-yellow-500' };
    }
  };

  const { icon: Icon, label, color } = getThemeInfo();

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <Icon className={`w-4 h-4 ${color}`} />
      <span>{label}</span>
    </div>
  );
}




