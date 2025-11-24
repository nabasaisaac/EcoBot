import { Link, useLocation } from 'react-router-dom';

export const Sidebar = ({ variant = 'default' }) => {
  const location = useLocation();

  if (variant === 'manual-control') {
    return (
      <aside className="flex w-64 flex-col bg-white p-4 border-r border-border-color">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwicdekxPvjIq9_zAW_V_isJlZRRsGGu2flVk9kf7f9x_8bpSvHaekH_pHvCmhLGxJbsHjQsFaiBN3MmgNlmGblYvSU4oMkRMskANNCvYzE_EFx79w4g2ZrS81IJpKhI3WTHNaXXB-bmC5Zpm_M_nDBh_MKQU76c1ybIa4sPd-qUc0DO86y1InAvjwkY7dfIG3QmH97UmxT4YDLDbaMfhRFAlkZo-zkRYtqFHaLKHnfIeyaKin1fvVN946O3_kStSBlXHhWdV_VaU")',
              }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-dark-text text-base font-semibold leading-normal">ARC-007</h1>
              <p className="text-primary text-sm font-medium leading-normal flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Online
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-1 mt-4">
            <Link
              to="/admin-dashboard"
              className="flex items-center gap-3 px-3 py-2 text-gray-text hover:text-dark-text hover:bg-light-gray rounded-md"
            >
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <p className="text-sm font-medium leading-normal">Dashboard</p>
            </Link>
            <Link
              to="/manual-control"
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary-light text-primary"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                gamepad
              </span>
              <p className="text-sm font-medium leading-normal">Manual Control</p>
            </Link>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-text hover:text-dark-text hover:bg-light-gray rounded-md">
              <span className="material-symbols-outlined text-xl">calendar_today</span>
              <p className="text-sm font-medium leading-normal">Robot Schedule</p>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-text hover:text-dark-text hover:bg-light-gray rounded-md">
              <span className="material-symbols-outlined text-xl">build</span>
              <p className="text-sm font-medium leading-normal">Maintenance Logs</p>
            </a>
          </nav>
        </div>
        <div className="mt-auto flex flex-col gap-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-text hover:text-dark-text hover:bg-light-gray rounded-md">
            <span className="material-symbols-outlined text-xl">settings</span>
            <p className="text-sm font-medium leading-normal">Settings</p>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-text hover:text-dark-text hover:bg-light-gray rounded-md">
            <span className="material-symbols-outlined text-xl">logout</span>
            <p className="text-sm font-medium leading-normal">Logout</p>
          </a>
        </div>
      </aside>
    );
  }

  if (variant === 'admin-dashboard') {
    return (
      <aside className="flex w-64 flex-col bg-container border-r border-border-color">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-2">
              <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-2xl">recycling</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-text-primary text-base font-bold leading-normal">FleetAdmin</h1>
                <p className="text-text-secondary text-sm font-normal leading-normal">IoT Fleet Manager</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 mt-4 px-2">
              <Link
                to="/admin-dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                  location.pathname === '/admin-dashboard'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'hover:bg-gray-100 text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="material-symbols-outlined">dashboard</span>
                <p className="text-sm leading-normal">Dashboard</p>
              </Link>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-text-secondary hover:text-text-primary"
              >
                <span className="material-symbols-outlined">smart_toy</span>
                <p className="text-sm font-medium leading-normal">Robots</p>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-text-secondary hover:text-text-primary"
              >
                <span className="material-symbols-outlined">bar_chart</span>
                <p className="text-sm font-medium leading-normal">Analytics</p>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-text-secondary hover:text-text-primary"
              >
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </a>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-2 border-t border-border-color pt-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJzqf400eRd0EPL4sZkDOvkkMOROg9t-mZj8VY8vH4Z7OefIHtDHczVaLlskzwKQWw1xrMlKI5VtpQ8Kg2dFMg3aCIcj_2_KxIdmgdbcr5tdurtdC96EYaoM-h_sjsq1tLehhDPECf9Dk3C_HQChzb2BE4jsCOEwE3dfZ09ZFjKYzvKeaKgX4rrstfF8cs7XStBTQDmLrAr8ZNPhQPBj-f71car274ZOhIZBSUlu3TnMZgtA4_W-t6wxKVOqZd_hj5wwia19lYMR0")',
                }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-text-primary text-sm font-medium leading-normal">Admin User</h1>
                <p className="text-text-secondary text-xs font-normal leading-normal hover:text-primary cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-card flex-shrink-0 p-4 border-r border-border-color">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
          <h2 className="text-text-primary text-xl font-bold">RoboClean</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center mb-6">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2xWe1S3QubHu_BgC5hQlm4sS_b8hiEusd094csWw1Y8VjWp2jA5RAqp6tYNK4Q0YSb1I6dWdPFKC8xuSusf04CR2tXTBbrjU1W-GhKBdbo9WiE01IdmDpRtKHtwB9FMhrfuGMmYcoMpVs6cRDoCX5U2ycAb9bQcPjNQJHEZlNH23btL9Mq5Fmego8himV5A7BlYaLadRHPJKPZwC6Yvow2j5G--CbnhjRHW1IOAsgajwp1hVTmuzpTwK8piGwTw_46eB0arznroY")',
              }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-text-primary text-base font-medium leading-normal">Admin User</h1>
              <p className="text-text-secondary text-sm font-normal leading-normal">admin@robotics.co</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to="/live-monitoring"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                location.pathname === '/live-monitoring'
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary/10 transition-colors'
              }`}
            >
              <span
                className={`material-symbols-outlined ${location.pathname === '/live-monitoring' ? 'text-white' : 'text-text-secondary'}`}
                style={location.pathname === '/live-monitoring' ? { fontVariationSettings: "'FILL' 1, 'wght' 400" } : {}}
              >
                monitoring
              </span>
              <p className={`text-sm font-medium leading-normal ${location.pathname === '/live-monitoring' ? 'text-white' : 'text-text-primary'}`}>
                Dashboard
              </p>
            </Link>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-text-secondary">smart_toy</span>
              <p className="text-text-primary text-sm font-medium leading-normal">Robots</p>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-text-secondary">history</span>
              <p className="text-text-primary text-sm font-medium leading-normal">History</p>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-text-secondary">settings</span>
              <p className="text-text-primary text-sm font-medium leading-normal">Settings</p>
            </a>
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-border-color">
          <div className="flex justify-between items-center">
            <h3 className="text-text-primary font-medium">System Status</h3>
            <div className="size-2 rounded-full bg-success animate-pulse"></div>
          </div>
          <p className="text-sm text-green-700">All Systems Operational</p>
        </div>
      </div>
    </aside>
  );
};

