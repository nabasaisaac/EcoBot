import { Link } from 'react-router-dom';
import { Recycle, Menu, Search, Bell, Settings } from 'lucide-react';

export const Header = ({ variant = 'default' }) => {
  if (variant === 'home') {
    return (
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-4 sm:px-10 py-3 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-4" style={{ color: '#1a202c' }}>
          <div className="size-6" style={{ color: '#17563a' }}>
            <Recycle size={32} />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]" style={{ color: '#1a202c', fontFamily: 'Space Grotesk, sans-serif' }}>
            Autonomous Waste Collector
          </h2>
        </div>
        <nav className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link to="/about" className="text-sm font-medium leading-normal transition-colors hover:opacity-80" style={{ color: '#4a5568' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#4a5568'}>
              About Robot
            </Link>
            <a href="#" className="text-sm font-medium leading-normal transition-colors hover:opacity-80" style={{ color: '#4a5568' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#4a5568'}>
              Research
            </a>
            <a href="#" className="text-sm font-medium leading-normal transition-colors hover:opacity-80" style={{ color: '#4a5568' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#4a5568'}>
              Contact
            </a>
          </div>
          <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity" style={{ backgroundColor: '#17563a' }}>
            <span className="truncate">Login</span>
          </Link>
        </nav>
        <div className="md:hidden">
          <button style={{ color: '#1a202c' }}>
            <Menu size={24} />
          </button>
        </div>
      </header>
    );
  }

  if (variant === 'admin') {
    return (
      <header className="flex sticky top-0 items-center justify-between whitespace-nowrap border-b px-10 py-3 bg-white/80 backdrop-blur-sm" style={{ borderColor: '#e2e8f0' }}>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]" style={{ color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
          Admin Dashboard
        </h2>
        <div className="flex flex-1 justify-end gap-4">
          <label className="flex flex-col w-full !h-10 max-w-sm">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="flex border items-center justify-center pl-4 rounded-l-md border-r-0" style={{ color: '#64748b', borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}>
                <Search size={20} />
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md focus:outline-0 focus:ring-1 border h-full placeholder:text-opacity-60 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                style={{ color: '#1e293b', borderColor: '#e2e8f0', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif', '--tw-ring-color': '#17563a' }}
                placeholder="Search robots, logs, etc..."
              />
            </div>
          </label>
          <button className="relative flex min-w-10 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 border gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-2.5" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#64748b' }}>
            <Bell size={20} />
            <div className="absolute top-1.5 right-1.5 size-2.5 rounded-full border-2" style={{ backgroundColor: '#ef4444', borderColor: '#ffffff' }}></div>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid px-4 md:px-10 py-3" style={{ borderColor: '#e2e8f0' }}>
      <div className="flex items-center gap-4" style={{ color: '#0f172a' }}>
        <div className="size-6" style={{ color: '#17563a' }}>
          <Recycle size={24} />
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]" style={{ color: '#0f172a', fontFamily: 'Space Grotesk, sans-serif' }}>
          EcoBot Admin
        </h2>
      </div>
      <div className="hidden md:flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link to="/admin-dashboard" className="text-sm font-medium leading-normal transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>
            Dashboard
          </Link>
          <Link to="/live-monitoring" className="text-sm font-medium leading-normal transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>
            Robot Status
          </Link>
          <a href="#" className="text-sm font-medium leading-normal transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>
            Map View
          </a>
          <Link to="/about" className="text-sm font-bold leading-normal" style={{ color: '#17563a' }}>
            About
          </Link>
        </div>
        <div className="flex gap-2">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-slate-200 transition-colors" style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>
            <Bell size={20} />
          </button>
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-slate-200 transition-colors" style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>
            <Settings size={20} />
          </button>
        </div>
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNamJeRyzmJ_fcAM8sXKwY-Wp5SDNJ_0i3iQ5RdCsjsG1YiwrKWxUxnPzo_OezZbVq1mzXQ3gvi6QtMME2yW0p7Rga3v-YBN732ggoiZGoMMWOMLQB2BSWOHp8yTBYPRJQOtEAufgKTnfZPj-Whrkz-cmoGWALSng0oJfVFFTZ6PtZEkAV2fp9QHxA-9VCFRmdtLRGf-kmDqpPzOrjlHe26m2G7AFakeMacCePMWa_eOsJcnUz4vzvri7rpngzdNOUAGzCBXMfA20")' }}></div>
      </div>
    </header>
  );
};
