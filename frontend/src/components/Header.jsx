import { Link } from 'react-router-dom';

export const Header = ({ variant = 'default' }) => {
  if (variant === 'home') {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-4 sm:px-10 py-3 bg-background-light/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-text-primary">
          <div className="size-6 text-primary">
            <span className="material-symbols-outlined text-4xl">recycling</span>
          </div>
          <h2 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">
            Autonomous Waste Collector
          </h2>
        </div>
        <nav className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link to="/about" className="text-text-secondary text-sm font-medium leading-normal hover:text-primary transition-colors">
              About Robot
            </Link>
            <a href="#" className="text-text-secondary text-sm font-medium leading-normal hover:text-primary transition-colors">
              Research
            </a>
            <a href="#" className="text-text-secondary text-sm font-medium leading-normal hover:text-primary transition-colors">
              Contact
            </a>
          </div>
          <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
            <span className="truncate">Login</span>
          </Link>
        </nav>
        <div className="md:hidden">
          <button className="text-text-primary">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </header>
    );
  }

  if (variant === 'admin') {
    return (
      <header className="flex sticky top-0 items-center justify-between whitespace-nowrap border-b border-border-color px-10 py-3 bg-container/80 backdrop-blur-sm">
        <h2 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">
          Admin Dashboard
        </h2>
        <div className="flex flex-1 justify-end gap-4">
          <label className="flex flex-col w-full !h-10 max-w-sm">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-text-secondary flex border border-border-color bg-background items-center justify-center pl-4 rounded-l-md border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-text-primary focus:outline-0 focus:ring-1 focus:ring-primary border border-border-color bg-background h-full placeholder:text-text-secondary px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Search robots, logs, etc..."
              />
            </div>
          </label>
          <button className="relative flex min-w-10 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 bg-container border border-border-color text-text-secondary gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-2.5">
            <span className="material-symbols-outlined">notifications</span>
            <div className="absolute top-1.5 right-1.5 size-2.5 bg-error rounded-full border-2 border-container"></div>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-color px-4 md:px-10 py-3">
      <div className="flex items-center gap-4 text-on-surface">
        <div className="size-6 text-primary">
          <span className="material-symbols-outlined !text-3xl text-primary">recycling</span>
        </div>
        <h2 className="text-on-surface text-lg font-bold leading-tight tracking-[-0.015em]">
          EcoBot Admin
        </h2>
      </div>
      <div className="hidden md:flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link to="/admin-dashboard" className="text-on-surface-secondary hover:text-primary transition-colors text-sm font-medium leading-normal">
            Dashboard
          </Link>
          <Link to="/live-monitoring" className="text-on-surface-secondary hover:text-primary transition-colors text-sm font-medium leading-normal">
            Robot Status
          </Link>
          <a href="#" className="text-on-surface-secondary hover:text-primary transition-colors text-sm font-medium leading-normal">
            Map View
          </a>
          <Link to="/about" className="text-primary text-sm font-bold leading-normal">
            About
          </Link>
        </div>
        <div className="flex gap-2">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-surface text-on-surface-secondary hover:bg-slate-200 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-surface text-on-surface-secondary hover:bg-slate-200 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNamJeRyzmJ_fcAM8sXKwY-Wp5SDNJ_0i3iQ5RdCsjsG1YiwrKWxUxnPzo_OezZbVq1mzXQ3gvi6QtMME2yW0p7Rga3v-YBN732ggoiZGoMMWOMLQB2BSWOHp8yTBYPRJQOtEAufgKTnfZPj-Whrkz-cmoGWALSng0oJfVFFTZ6PtZEkAV2fp9QHxA-9VCFRmdtLRGf-kmDqpPzOrjlHe26m2G7AFakeMacCePMWa_eOsJcnUz4vzvri7rpngzdNOUAGzCBXMfA20")' }}></div>
      </div>
    </header>
  );
};

