import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = ({ variant = "default" }) => {
  if (variant === "home") {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-white/10 px-4 sm:px-10 py-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-text-primary dark:text-white">
          <div className="size-6 text-primary">
            <span className="material-symbols-outlined text-4xl">
              recycling
            </span>
          </div>
          <h2 className="text-text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Autonomous Waste Collector
          </h2>
        </div>
        <nav className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link
              to="/about"
              className="text-text-secondary dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors"
            >
              About Robot
            </Link>
            <a
              href="#"
              className="text-text-secondary dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors"
            >
              Research
            </a>
            <a
              href="#"
              className="text-text-secondary dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors"
            >
              Contact
            </a>
          </div>
          <Link to="/login">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
              <span className="truncate">Login</span>
            </button>
          </Link>
          <ThemeToggle />
        </nav>
        <div className="md:hidden">
          <button className="text-text-primary dark:text-white">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </header>
    );
  }

  return null;
};
