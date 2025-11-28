import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, Calendar, Wrench, Settings, LogOut, Activity, Bot, History, Recycle, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Sidebar = ({ variant = 'default', isOpen, onToggle }) => {
  const location = useLocation();

  if (variant === 'manual-control') {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white border lg:hidden"
          style={{ borderColor: '#e5e7eb' }}
        >
          {isOpen ? <X size={24} style={{ color: '#111827' }} /> : <Menu size={24} style={{ color: '#111827' }} />}
        </button>

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 flex w-64 flex-col bg-white p-4 border-r transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ borderColor: '#e5e7eb' }}
        >
          <div className="flex flex-col gap-4 h-full">
            <div className="flex gap-3 items-center">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwicdekxPvjIq9_zAW_V_isJlZRRsGGu2flVk9kf7f9x_8bpSvHaekH_pHvCmhLGxJbsHjQsFaiBN3MmgNlmGblYvSU4oMkRMskANNCvYzE_EFx79w4g2ZrS81IJpKhI3WTHNaXXB-bmC5Zpm_M_nDBh_MKQU76c1ybIa4sPd-qUc0DO86y1InAvjwkY7dfIG3QmH97UmxT4YDLDbaMfhRFAlkZo-zkRYtqFHaLKHnfIeyaKin1fvVN946O3_kStSBlXHhWdV_VaU")',
                }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-base font-semibold leading-normal" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>ARC-007</h1>
                <p className="text-sm font-medium leading-normal flex items-center gap-1.5" style={{ color: '#17563a' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#17563a' }}></span>
                  Online
                </p>
              </div>
            </div>
            <nav className="flex flex-col gap-1 mt-4">
              <Link
                to="/admin-dashboard"
                onClick={() => onToggle && onToggle()}
                className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100"
                style={{ color: '#6b7280' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.backgroundColor = '#f0f2f5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <LayoutDashboard size={20} />
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link
                to="/manual-control"
                onClick={() => onToggle && onToggle()}
                className="flex items-center gap-3 px-3 py-2 rounded-md"
                style={{ backgroundColor: '#e8f5ee', color: '#17563a' }}
              >
                <Gamepad2 size={20} fill="#17563a" />
                <p className="text-sm font-medium leading-normal">Manual Control</p>
              </Link>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100" style={{ color: '#6b7280' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.backgroundColor = '#f0f2f5'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <Calendar size={20} />
                <p className="text-sm font-medium leading-normal">Robot Schedule</p>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100" style={{ color: '#6b7280' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.backgroundColor = '#f0f2f5'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <Wrench size={20} />
                <p className="text-sm font-medium leading-normal">Maintenance Logs</p>
              </a>
            </nav>
            <div className="mt-auto flex flex-col gap-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100" style={{ color: '#6b7280' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.backgroundColor = '#f0f2f5'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <Settings size={20} />
                <p className="text-sm font-medium leading-normal">Settings</p>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100" style={{ color: '#6b7280' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.backgroundColor = '#f0f2f5'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <LogOut size={20} />
                <p className="text-sm font-medium leading-normal">Logout</p>
              </a>
            </div>
          </div>
        </aside>
      </>
    );
  }

  if (variant === 'admin-dashboard') {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white border lg:hidden"
          style={{ borderColor: '#e2e8f0' }}
        >
          {isOpen ? <X size={24} style={{ color: '#1e293b' }} /> : <Menu size={24} style={{ color: '#1e293b' }} />}
        </button>

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
        >
          <div className="flex h-full flex-col justify-between p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-2">
                <div className="flex items-center justify-center size-10 rounded-lg text-white" style={{ backgroundColor: '#17563a' }}>
                  <Recycle size={20} />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-base font-bold leading-normal" style={{ color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>FleetAdmin</h1>
                  <p className="text-sm font-normal leading-normal" style={{ color: '#64748b' }}>IoT Fleet Manager</p>
                </div>
              </div>
              <nav className="flex flex-col gap-2 mt-4 px-2">
                <Link
                  to="/admin-dashboard"
                  onClick={() => onToggle && onToggle()}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md ${location.pathname === '/admin-dashboard' ? 'font-semibold' : 'font-medium'}`}
                  style={location.pathname === '/admin-dashboard' ? { backgroundColor: 'rgba(23, 86, 58, 0.1)', color: '#17563a' } : { color: '#64748b' }}
                  onMouseEnter={(e) => { if (location.pathname !== '/admin-dashboard') { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#1e293b'; } }}
                  onMouseLeave={(e) => { if (location.pathname !== '/admin-dashboard') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
                >
                  <LayoutDashboard size={20} />
                  <p className="text-sm leading-normal">Dashboard</p>
                </Link>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium" style={{ color: '#64748b' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#1e293b'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                  <Bot size={20} />
                  <p className="text-sm leading-normal">Robots</p>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium" style={{ color: '#64748b' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#1e293b'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                  <BarChart3 size={20} />
                  <p className="text-sm leading-normal">Analytics</p>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium" style={{ color: '#64748b' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#1e293b'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
                  <Settings size={20} />
                  <p className="text-sm leading-normal">Settings</p>
                </a>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-2 border-t pt-4" style={{ borderColor: '#e2e8f0' }}>
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJzqf400eRd0EPL4sZkDOvkkMOROg9t-mZj8VY8vH4Z7OefIHtDHczVaLlskzwKQWw1xrMlKI5VtpQ8Kg2dFMg3aCIcj_2_KxIdmgdbcr5tdurtdC96EYaoM-h_sjsq1tLehhDPECf9Dk3C_HQChzb2BE4jsCOEwE3dfZ09ZFjKYzvKeaKgX4rrstfF8cs7XStBTQDmLrAr8ZNPhQPBj-f71car274ZOhIZBSUlu3TnMZgtA4_W-t6wxKVOqZd_hj5wwia19lYMR0")',
                  }}
                ></div>
                <div className="flex flex-col">
                  <h1 className="text-sm font-medium leading-normal" style={{ color: '#1e293b' }}>Admin User</h1>
                  <p className="text-xs font-normal leading-normal cursor-pointer transition-colors hover:opacity-80" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#17563a'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>
                    Logout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white border lg:hidden"
        style={{ borderColor: '#e2e8f0' }}
      >
        {isOpen ? <X size={24} style={{ color: '#1a202c' }} /> : <Menu size={24} style={{ color: '#1a202c' }} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0 p-4 border-r transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl" style={{ color: '#17563a' }}>
              <Bot size={32} />
            </span>
            <h2 className="text-xl font-bold" style={{ color: '#1a202c', fontFamily: 'Space Grotesk, sans-serif' }}>RoboClean</h2>
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
                <h1 className="text-base font-medium leading-normal" style={{ color: '#1a202c' }}>Admin User</h1>
                <p className="text-sm font-normal leading-normal" style={{ color: '#4a5568' }}>admin@robotics.co</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/live-monitoring"
                onClick={() => onToggle && onToggle()}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${location.pathname === '/live-monitoring' ? 'text-white' : ''}`}
                style={location.pathname === '/live-monitoring' ? { backgroundColor: '#17563a' } : { color: '#1a202c' }}
                onMouseEnter={(e) => { if (location.pathname !== '/live-monitoring') { e.currentTarget.style.backgroundColor = 'rgba(23, 86, 58, 0.1)'; } }}
                onMouseLeave={(e) => { if (location.pathname !== '/live-monitoring') { e.currentTarget.style.backgroundColor = 'transparent'; } }}
              >
                <Activity size={20} fill={location.pathname === '/live-monitoring' ? '#ffffff' : 'none'} color={location.pathname === '/live-monitoring' ? '#ffffff' : '#4a5568'} />
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors" style={{ color: '#1a202c' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(23, 86, 58, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Bot size={20} color="#4a5568" />
                <p className="text-sm font-medium leading-normal">Robots</p>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors" style={{ color: '#1a202c' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(23, 86, 58, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <History size={20} color="#4a5568" />
                <p className="text-sm font-medium leading-normal">History</p>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors" style={{ color: '#1a202c' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(23, 86, 58, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Settings size={20} color="#4a5568" />
                <p className="text-sm font-medium leading-normal">Settings</p>
              </a>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3 p-4 rounded-lg border" style={{ backgroundColor: '#f9fafb', borderColor: '#e2e8f0' }}>
            <div className="flex justify-between items-center">
              <h3 className="font-medium" style={{ color: '#1a202c' }}>System Status</h3>
              <div className="size-2 rounded-full animate-pulse" style={{ backgroundColor: '#38a169' }}></div>
            </div>
            <p className="text-sm" style={{ color: '#15803d' }}>All Systems Operational</p>
          </div>
        </div>
      </aside>
    </>
  );
};
