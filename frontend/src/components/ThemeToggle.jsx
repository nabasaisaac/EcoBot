import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center size-10 rounded-lg bg-white/10 dark:bg-gray-200 hover:bg-white/20 dark:hover:bg-gray-300 transition-colors border border-white/20 dark:border-gray-300"
      aria-label="Toggle theme"
    >
      <span className="material-symbols-outlined text-white dark:text-slate-800">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
};
