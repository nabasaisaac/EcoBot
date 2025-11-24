import { Recycle } from 'lucide-react';

export const Footer = ({ variant = 'default' }) => {
  if (variant === 'home') {
    return (
      <footer className="w-full border-t border-solid border-gray-200 px-4 sm:px-10 lg:px-20 xl:px-40 py-10">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="size-5" style={{ color: '#17563a' }}>
              <Recycle size={24} />
            </div>
            <p className="text-sm" style={{ color: '#4a5568' }}>© 2024 Autonomous Waste Collector. All Rights Reserved.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:opacity-80" style={{ color: '#4a5568' }} onMouseEnter={(e) => e.target.style.color = '#1a202c'} onMouseLeave={(e) => e.target.style.color = '#4a5568'}>About</a>
            <a href="#" className="transition-colors hover:opacity-80" style={{ color: '#4a5568' }} onMouseEnter={(e) => e.target.style.color = '#1a202c'} onMouseLeave={(e) => e.target.style.color = '#4a5568'}>Research</a>
            <a href="#" className="transition-colors hover:opacity-80" style={{ color: '#4a5568' }} onMouseEnter={(e) => e.target.style.color = '#1a202c'} onMouseLeave={(e) => e.target.style.color = '#4a5568'}>Contact</a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-10 border-t px-4 py-6 text-center" style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
      <p className="text-sm">© 2024 EcoBot Inc. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Support</a>
        <a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Documentation</a>
        <a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Privacy Policy</a>
      </div>
    </footer>
  );
};
