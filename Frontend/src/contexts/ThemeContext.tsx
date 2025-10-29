import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark');

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;
      // Luôn dùng dark theme cho phong cách công nghệ
      const shouldBeDark = true;
      setIsDark(true);
      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateTheme();
    localStorage.setItem('theme', 'dark');

    // Listen for system theme changes
    // Không cần lắng nghe thay đổi system vì luôn dark
    return () => {};
  }, [theme]);

  const toggleTheme = () => {
    // No-op: luôn dark
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}




