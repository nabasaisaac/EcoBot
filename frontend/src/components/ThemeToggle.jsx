import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center size-10 rounded-lg bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-white dark:text-white">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
};

