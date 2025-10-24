import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative group">
      <button
        onClick={() => {
          const currentIndex = themes.findIndex(t => t.value === theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          setTheme(themes[nextIndex].value as 'light' | 'dark' | 'system');
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label={`Current theme: ${currentTheme.label}. Click to cycle themes.`}
        title={`Current: ${currentTheme.label}`}
      >
        <CurrentIcon className="w-4 h-4" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentTheme.label}
        </span>
      </button>

      {/* Theme dropdown */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <button
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value as 'light' | 'dark' | 'system')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  theme === themeOption.value 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{themeOption.label}</span>
                {theme === themeOption.value && (
                  <div className="ml-auto w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Simple toggle version for compact spaces
export function ThemeToggleSimple() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-yellow-500" />
      ) : (
        <Moon className="w-4 h-4 text-gray-600" />
      )}
    </button>
  );
}




