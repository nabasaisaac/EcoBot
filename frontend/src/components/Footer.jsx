import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-solid border-gray-200 dark:border-white/10 px-4 sm:px-10 lg:px-20 xl:px-40 py-10">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="size-5 text-primary">
            <span className="material-symbols-outlined text-3xl">recycling</span>
          </div>
          <p className="text-slate-600 dark:text-white/70 text-sm">
            © 2024 Autonomous Waste Collector. All Rights Reserved.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/about" className="text-slate-600 dark:text-white/70 hover:text-slate-800 dark:hover:text-white transition-colors">
            About
          </Link>
          <a href="#" className="text-slate-600 dark:text-white/70 hover:text-slate-800 dark:hover:text-white transition-colors">
            Research
          </a>
          <a href="#" className="text-slate-600 dark:text-white/70 hover:text-slate-800 dark:hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

