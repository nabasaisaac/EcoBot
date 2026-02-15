import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, LogOut, Menu, X, Navigation, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Sidebar = ({ variant = 'manual-control', isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isManual = location.pathname === '/manual-control';
  const isAutonomous = location.pathname === '/autonomous-nav';
  const isUsers = location.pathname === '/user-management';

  const handleLogout = () => {
    logout();
    navigate('/');
    onToggle?.();
  };

  if (variant === 'manual-control') {
    return (
      <>
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white border lg:hidden"
          style={{ borderColor: '#e5e7eb' }}
        >
          {isOpen ? <X size={24} style={{ color: '#111827' }} /> : <Menu size={24} style={{ color: '#111827' }} />}
        </button>
        {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 flex w-64 flex-col bg-white p-4 border-r transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          style={{ borderColor: '#e5e7eb' }}
        >
          <div className="flex flex-col gap-4 h-full">
            <Link
              to="/"
              onClick={() => onToggle?.()}
              className="flex gap-3 items-center hover:opacity-90 transition-opacity"
            >
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwicdekxPvjIq9_zAW_V_isJlZRRsGGu2flVk9kf7f9x_8bpSvHaekH_pHvCmhLGxJbsHjQsFaiBN3MmgNlmGblYvSU4oMkRMskANNCvYzE_EFx79w4g2ZrS81IJpKhI3WTHNaXXB-bmC5Zpm_M_nDBh_MKQU76c1ybIa4sPd-qUc0DO86y1InAvjwkY7dfIG3QmH97UmxT4YDLDbaMfhRFAlkZo-zkRYtqFHaLKHnfIeyaKin1fvVN946O3_kStSBlXHhWdV_VaU")',
                }}
              />
              <div className="flex flex-col">
                <h1 className="text-base font-semibold" style={{ color: '#111827' }}>
                  EcoBot
                </h1>
                <p
                  className="text-sm font-medium flex items-center gap-1.5"
                  style={{ color: '#17563a' }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#17563a' }}
                  />{" "}
                  Online
                </p>
              </div>
            </Link>
            <nav className="flex flex-col gap-1 mt-4">
              <Link
                to="/manual-control"
                onClick={() => onToggle?.()}
                className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100"
                style={isManual ? { backgroundColor: '#e8f5ee', color: '#17563a' } : { color: '#6b7280' }}
              >
                <Gamepad2 size={20} fill={isManual ? '#17563a' : 'none'} style={isManual ? {} : { color: '#6b7280' }} />
                <p className="text-sm font-medium">Manual Control</p>
              </Link>
              <Link
                to="/autonomous-nav"
                onClick={() => onToggle?.()}
                className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100"
                style={isAutonomous ? { backgroundColor: '#e8f5ee', color: '#17563a' } : { color: '#6b7280' }}
              >
                <Navigation size={20} style={{ color: isAutonomous ? '#17563a' : '#6b7280' }} />
                <p className="text-sm font-medium">Autonomous Nav</p>
              </Link>
              <Link
                to="/user-management"
                onClick={() => onToggle?.()}
                className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100"
                style={isUsers ? { backgroundColor: '#e8f5ee', color: '#17563a' } : { color: '#6b7280' }}
              >
                <Users size={20} style={{ color: isUsers ? '#17563a' : '#6b7280' }} />
                <p className="text-sm font-medium">User Management</p>
              </Link>
            </nav>
            <div className="mt-auto">
              <button type="button" onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-gray-100 w-full text-left" style={{ color: '#6b7280' }}>
                <LogOut size={20} />
                <p className="text-sm font-medium">Logout</p>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }
  return null;
};
