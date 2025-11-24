import { Link, useLocation } from "react-router-dom";

export const ManualControlSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-white/10 p-4 border-r border-border-color dark:border-white/20">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwicdekxPvjIq9_zAW_V_isJlZRRsGGu2flVk9kf7f9x_8bpSvHaekH_pHvCmhLGxJbsHjQsFaiBN3MmgNlmGblYvSU4oMkRMskANNCvYzE_EFx79w4g2ZrS81IJpKhI3WTHNaXXB-bmC5Zpm_M_nDBh_MKQU76c1ybIa4sPd-qUc0DO86y1InAvjwkY7dfIG3QmH97UmxT4YDLDbaMfhRFAlkZo-zkRYtqFHaLKHnfIeyaKin1fvVN946O3_kStSBlXHhWdV_VaU")`,
            }}
          />
          <div className="flex flex-col">
            <h1 className="text-dark-text dark:text-white text-base font-semibold leading-normal">
              ARC-007
            </h1>
            <p className="text-primary text-sm font-medium leading-normal flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Online
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 mt-4">
          <Link
            to="/admin-dashboard"
            className="flex items-center gap-3 px-3 py-2 text-gray-text dark:text-white/70 hover:text-dark-text dark:hover:text-white hover:bg-light-gray dark:hover:bg-white/10 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <p className="text-sm font-medium leading-normal">Dashboard</p>
          </Link>
          <Link
            to="/manual-control"
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary-light dark:bg-primary/20 text-primary transition-colors"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              gamepad
            </span>
            <p className="text-sm font-medium leading-normal">Manual Control</p>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-text dark:text-white/70 hover:text-dark-text dark:hover:text-white hover:bg-light-gray dark:hover:bg-white/10 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              calendar_today
            </span>
            <p className="text-sm font-medium leading-normal">Robot Schedule</p>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-text dark:text-white/70 hover:text-dark-text dark:hover:text-white hover:bg-light-gray dark:hover:bg-white/10 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-xl">build</span>
            <p className="text-sm font-medium leading-normal">
              Maintenance Logs
            </p>
          </a>
        </nav>
      </div>
      <div className="mt-auto flex flex-col gap-1">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-gray-text dark:text-white/70 hover:text-dark-text dark:hover:text-white hover:bg-light-gray dark:hover:bg-white/10 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          <p className="text-sm font-medium leading-normal">Settings</p>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-gray-text dark:text-white/70 hover:text-dark-text dark:hover:text-white hover:bg-light-gray dark:hover:bg-white/10 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <p className="text-sm font-medium leading-normal">Logout</p>
        </a>
      </div>
    </aside>
  );
};
