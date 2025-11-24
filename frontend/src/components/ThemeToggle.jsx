import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center size-10 rounded-lg bg-white dark:bg-white/10 border border-border-color dark:border-white/20 text-text-secondary dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/20 transition-colors"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-lg">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
};
