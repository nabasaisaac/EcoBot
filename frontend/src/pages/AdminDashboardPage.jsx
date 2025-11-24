import { Link } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ThemeToggle } from "../components/ThemeToggle";

export const AdminDashboardPage = () => {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-white">
      <Sidebar variant="admin" />
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* TopNavBar */}
        <header className="flex sticky top-0 items-center justify-between whitespace-nowrap border-b border-white/10 dark:border-gray-200 px-4 sm:px-6 lg:px-10 py-3 bg-background-dark/80 dark:bg-white backdrop-blur-sm">
          <h2 className="text-white dark:text-slate-800 text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">
            Admin Dashboard
          </h2>
          <div className="flex flex-1 justify-end gap-2 sm:gap-4">
            <label className="hidden sm:flex flex-col w-full !h-10 max-w-sm">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-white/70 dark:text-slate-600 flex border border-white/10 dark:border-gray-200 bg-background-dark dark:bg-background-light items-center justify-center pl-3 sm:pl-4 rounded-l-lg border-r-0">
                  <span className="material-symbols-outlined text-lg sm:text-xl">
                    search
                  </span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white dark:text-slate-800 focus:outline-0 focus:ring-1 focus:ring-primary border border-white/10 dark:border-gray-200 bg-background-dark dark:bg-background-light h-full placeholder:text-white/50 dark:placeholder:text-slate-600 px-3 sm:px-4 rounded-l-none border-l-0 pl-2 text-sm sm:text-base font-normal leading-normal"
                  placeholder="Search robots, logs, etc..."
                />
              </div>
            </label>
            <button className="relative flex min-w-9 sm:min-w-10 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 sm:h-10 bg-background-dark dark:bg-background-light border border-white/10 dark:border-gray-200 text-white/70 dark:text-slate-600 gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-2 sm:px-2.5">
              <span className="material-symbols-outlined">notifications</span>
              <div className="absolute top-1.5 right-1.5 size-2.5 bg-critical rounded-full border-2 border-background-dark dark:border-background-light"></div>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 grid grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 sm:gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Active Robots", value: "5/6" },
                { label: "Avg. Battery", value: "88%" },
                {
                  label: "Connectivity",
                  value: "Strong",
                  color: "text-success",
                },
                { label: "Waste Capacity", value: "75%" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-xl p-3 sm:p-4 bg-[#294237]/50 dark:bg-white border border-white/10 dark:border-gray-200"
                >
                  <p className="text-white/70 dark:text-slate-600 text-xs sm:text-sm font-medium leading-normal">
                    {stat.label}
                  </p>
                  <p
                    className={`text-white dark:text-slate-800 tracking-light text-xl sm:text-2xl font-bold leading-tight ${
                      stat.color || ""
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="flex flex-col bg-[#294237]/50 dark:bg-white rounded-xl border border-white/10 dark:border-gray-200 p-3 sm:p-4 gap-3 sm:gap-4">
              <h3 className="text-white dark:text-slate-800 font-bold text-base sm:text-lg">
                Real-Time Fleet Location
              </h3>
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg object-cover"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLBdURdgQ9NNS5duRHchuUEP-VchCS_Gkxb5CDVZmZmENEdA5SRVJc1QNcCSmYwjINtd_vIdw23-0NWXxEHR0aC-bc27jiWY0SRONGCAxVexNeGNRvS1l6h2o-r28Kr-sCvl4x_xop7B2nA0XvNorw-zARWGoZP6twWsvLuznrszwrAehFNxUm8g6SK-4AlUo5XVNkQDb5chZBUrMLXdmHMGIFfrkZB7EQim8Zbk5MAYCLcB55N_pKbBhODKczzDTYnC66lu52ce8")`,
                }}
              />
            </div>

            {/* Shortcut Action Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  icon: "videocam",
                  label: "Live Monitoring",
                  link: "/live-monitoring",
                },
                {
                  icon: "gamepad",
                  label: "Manual Control",
                  link: "/manual-control",
                },
                { icon: "analytics", label: "View Analytics", link: "#" },
                { icon: "build", label: "Maintenance", link: "#" },
              ].map((action, idx) => (
                <Link
                  key={idx}
                  to={action.link}
                  className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#294237]/50 dark:bg-white border border-white/10 dark:border-gray-200 hover:bg-primary/10 dark:hover:bg-gray-100 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-2xl sm:text-3xl text-success dark:text-primary">
                    {action.icon}
                  </span>
                  <p className="font-semibold text-xs sm:text-sm text-white dark:text-slate-800 text-center">
                    {action.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 sm:gap-6">
            {/* Notifications Panel */}
            <div className="flex flex-col bg-[#294237]/50 dark:bg-white rounded-xl border border-white/10 dark:border-gray-200 p-3 sm:p-4 gap-3 sm:gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white dark:text-slate-800 font-bold text-base sm:text-lg">
                  Notifications
                </h3>
                <a
                  className="text-xs sm:text-sm text-success dark:text-primary font-medium"
                  href="#"
                >
                  View all
                </a>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                {[
                  {
                    type: "error",
                    icon: "error",
                    title: "Critical: Obstacle Detected",
                    desc: "Robot RBT-003 has stopped. Manual intervention required.",
                  },
                  {
                    type: "warning",
                    icon: "warning",
                    title: "Alert: Bin Full",
                    desc: "Robot RBT-005 bin is at 95% capacity. Returning to base.",
                  },
                  {
                    type: "info",
                    icon: "info",
                    title: "Info: Route Completed",
                    desc: "Robot RBT-001 has completed its scheduled route.",
                  },
                ].map((notif, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-${notif.type}/10 dark:bg-${notif.type}/20 border border-${notif.type}/30 dark:border-${notif.type}/40`}
                  >
                    <span
                      className={`material-symbols-outlined text-${notif.type} dark:text-${notif.type} mt-0.5 text-base sm:text-lg`}
                    >
                      {notif.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-xs sm:text-sm text-${notif.type} dark:text-${notif.type}`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-white/70 dark:text-slate-600">
                        {notif.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="flex flex-col bg-[#294237]/50 dark:bg-white rounded-xl border border-white/10 dark:border-gray-200 p-3 sm:p-4 gap-3 sm:gap-4 flex-1">
              <h3 className="text-white dark:text-slate-800 font-bold text-base sm:text-lg">
                Recent Activity
              </h3>
              <div className="flex-1 overflow-y-auto pr-2">
                <ul className="flex flex-col gap-3 sm:gap-4">
                  {[
                    {
                      icon: "route",
                      title: "Route Started - RBT-004",
                      time: "2 mins ago",
                      color: "success",
                    },
                    {
                      icon: "delete",
                      title: "Bin Emptied - RBT-002",
                      time: "5 mins ago",
                      color: "success",
                    },
                    {
                      icon: "sensors_off",
                      title: "Lost Connection - RBT-006",
                      time: "8 mins ago",
                      color: "warning",
                    },
                    {
                      icon: "power",
                      title: "Now Charging - RBT-001",
                      time: "15 mins ago",
                      color: "success",
                    },
                    {
                      icon: "block",
                      title: "Obstacle Detected - RBT-003",
                      time: "18 mins ago",
                      color: "error",
                    },
                  ].map((activity, idx) => (
                    <li key={idx} className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`flex items-center justify-center size-7 sm:size-8 rounded-full bg-primary/10 dark:bg-primary/20 text-${activity.color} dark:text-primary`}
                      >
                        <span className="material-symbols-outlined text-sm sm:text-base">
                          {activity.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-white dark:text-slate-800 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-white/50 dark:text-slate-600">
                          {activity.time}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
