export const Footer = ({ variant = 'default' }) => {
  if (variant === 'home') {
    return (
      <footer className="w-full border-t border-solid border-gray-200 px-4 sm:px-10 lg:px-20 xl:px-40 py-10">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="size-5 text-primary">
              <span className="material-symbols-outlined text-3xl">recycling</span>
            </div>
            <p className="text-text-secondary text-sm">© 2024 Autonomous Waste Collector. All Rights Reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">About</a>
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Research</a>
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-10 border-t border-border-color px-4 py-6 text-center text-on-surface-secondary">
      <p className="text-sm">© 2024 EcoBot Inc. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="#" className="text-xs hover:text-primary transition-colors">Support</a>
        <a href="#" className="text-xs hover:text-primary transition-colors">Documentation</a>
        <a href="#" className="text-xs hover:text-primary transition-colors">Privacy Policy</a>
      </div>
    </footer>
  );
};

