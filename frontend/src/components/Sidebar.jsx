import { Link, useLocation } from 'react-router-dom';

export const Sidebar = ({ variant = 'admin' }) => {
  const location = useLocation();

  if (variant === 'admin') {
    return (
      <aside className="w-64 bg-[#131f1a] dark:bg-[#131f1a] flex-shrink-0 p-4 border-r border-white/10">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-success text-3xl">smart_toy</span>
            <h2 className="text-white text-xl font-bold">RoboClean</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center mb-6">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2xWe1S3QubHu_BgC5hQlm4sS_b8hiEusd094csWw1Y8VjWp2jA5RAqp6tYNK4Q0YSb1I6dWdPFKC8xuSusf04CR2tXTBbrjU1W-GhKBdbo9WiE01IdmDpRtKHtwB9FMhrfuGMmYcoMpVs6cRDoCX5U2ycAb9bQcPjNQJHEZlNH23btL9Mq5Fmego8himV5A7BlYaLadRHPJKPZwC6Yvow2j5G--CbnhjRHW1IOAsgajwp1hVTmuzpTwK8piGwTw_46eB0arznroY")`,
                }}
              />
              <div className="flex flex-col">
                <h1 className="text-white text-base font-medium leading-normal">Admin User</h1>
                <p className="text-[#9ac1af] text-sm font-normal leading-normal">admin@robotics.co</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/live-monitoring"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/live-monitoring'
                    ? 'bg-primary/30'
                    : 'hover:bg-primary/20'
                }`}
              >
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontVariationSettings: location.pathname === '/live-monitoring' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  monitoring
                </span>
                <p className="text-white text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link
                to="/admin-dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/admin-dashboard'
                    ? 'bg-primary/30'
                    : 'hover:bg-primary/20'
                }`}
              >
                <span className="material-symbols-outlined text-white">smart_toy</span>
                <p className="text-white text-sm font-medium leading-normal">Robots</p>
              </Link>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors" href="#">
                <span className="material-symbols-outlined text-white">history</span>
                <p className="text-white text-sm font-medium leading-normal">History</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors" href="#">
                <span className="material-symbols-outlined text-white">settings</span>
                <p className="text-white text-sm font-medium leading-normal">Settings</p>
              </a>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3 p-4 bg-[#294237]/50 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium">System Status</h3>
              <div className="size-2 rounded-full bg-success animate-pulse"></div>
            </div>
            <p className="text-sm text-green-300">All Systems Operational</p>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};

