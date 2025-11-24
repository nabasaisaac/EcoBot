import { Link, useLocation } from "react-router-dom";

export const Sidebar = ({ variant = "admin" }) => {
  const location = useLocation();

  if (variant === "admin") {
    return (
      <aside className="w-64 bg-card dark:bg-background-dark flex-shrink-0 p-4 border-r border-border-color dark:border-white/10 hidden md:flex flex-col">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">
              smart_toy
            </span>
            <h2 className="text-text-primary dark:text-white text-xl font-bold">
              RoboClean
            </h2>
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
                <h1 className="text-text-primary dark:text-white text-base font-medium leading-normal">
                  Admin User
                </h1>
                <p className="text-text-secondary dark:text-white/70 text-sm font-normal leading-normal">
                  admin@robotics.co
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/live-monitoring"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === "/live-monitoring"
                    ? "bg-primary text-white"
                    : "hover:bg-primary/10 text-text-secondary dark:text-white/70 hover:text-text-primary dark:hover:text-white"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings:
                      location.pathname === "/live-monitoring"
                        ? "'FILL' 1"
                        : "'FILL' 0",
                  }}
                >
                  monitoring
                </span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link
                to="/admin-dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === "/admin-dashboard"
                    ? "bg-primary text-white"
                    : "hover:bg-primary/10 text-text-secondary dark:text-white/70 hover:text-text-primary dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined">smart_toy</span>
                <p className="text-sm font-medium leading-normal">Robots</p>
              </Link>
              <a
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-text-secondary dark:text-white/70 hover:text-text-primary dark:hover:text-white"
                href="#"
              >
                <span className="material-symbols-outlined">history</span>
                <p className="text-sm font-medium leading-normal">History</p>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-text-secondary dark:text-white/70 hover:text-text-primary dark:hover:text-white"
                href="#"
              >
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </a>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-border-color dark:border-white/10">
            <div className="flex justify-between items-center">
              <h3 className="text-text-primary dark:text-white font-medium">
                System Status
              </h3>
              <div className="size-2 rounded-full bg-success animate-pulse"></div>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400">
              All Systems Operational
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
