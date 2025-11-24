import { Link } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ThemeToggle } from "../components/ThemeToggle";

export const AdminDashboardPage = () => {
  return (
    <div className="flex h-screen bg-background dark:bg-background-dark font-sans text-text-primary dark:text-white">
      <Sidebar variant="admin" />
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* TopNavBar */}
        <header className="flex sticky top-0 items-center justify-between whitespace-nowrap border-b border-border-color dark:border-white/10 px-10 py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm">
          <h2 className="text-text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Admin Dashboard
          </h2>
          <div className="flex flex-1 justify-end gap-4">
            <label className="flex flex-col w-full !h-10 max-w-sm">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-text-secondary dark:text-white/70 flex border border-border-color dark:border-white/20 bg-background dark:bg-white/10 items-center justify-center pl-4 rounded-l-md border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-text-primary dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-border-color dark:border-white/20 bg-background dark:bg-white/10 h-full placeholder:text-text-secondary dark:placeholder:text-white/50 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  placeholder="Search robots, logs, etc..."
                />
              </div>
            </label>
            <button className="relative flex min-w-10 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 bg-white dark:bg-white/10 border border-border-color dark:border-white/20 text-text-secondary dark:text-white/70 gap-2 text-sm font-bold leading-normal tracking-[0.015em] px-2.5">
              <span className="material-symbols-outlined">notifications</span>
              <div className="absolute top-1.5 right-1.5 size-2.5 bg-error rounded-full border-2 border-white dark:border-background-dark"></div>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  className="flex flex-col gap-2 rounded-lg p-4 bg-white dark:bg-white/10 border border-border-color dark:border-white/20"
                >
                  <p className="text-text-secondary dark:text-white/70 text-sm font-medium leading-normal">
                    {stat.label}
                  </p>
                  <p
                    className={`text-text-primary dark:text-white tracking-light text-2xl font-bold leading-tight ${
                      stat.color || ""
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="flex flex-col bg-white dark:bg-white/10 rounded-lg border border-border-color dark:border-white/20 p-4 gap-4">
              <h3 className="text-text-primary dark:text-white font-bold text-lg">
                Real-Time Fleet Location
              </h3>
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-md object-cover"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLBdURdgQ9NNS5duRHchuUEP-VchCS_Gkxb5CDVZmZmENEdA5SRVJc1QNcCSmYwjINtd_vIdw23-0NWXxEHR0aC-bc27jiWY0SRONGCAxVexNeGNRvS1l6h2o-r28Kr-sCvl4x_xop7B2nA0XvNorw-zARWGoZP6twWsvLuznrszwrAehFNxUm8g6SK-4AlUo5XVNkQDb5chZBUrMLXdmHMGIFfrkZB7EQim8Zbk5MAYCLcB55N_pKbBhODKczzDTYnC66lu52ce8")`,
                }}
              />
            </div>

            {/* Shortcut Action Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-white dark:bg-white/10 border border-border-color dark:border-white/20 hover:bg-primary/5 dark:hover:bg-primary/20 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-3xl text-primary">
                    {action.icon}
                  </span>
                  <p className="font-semibold text-sm text-text-primary dark:text-white text-center">
                    {action.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Notifications Panel */}
            <div className="flex flex-col bg-white dark:bg-white/10 rounded-lg border border-border-color dark:border-white/20 p-4 gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-text-primary dark:text-white font-bold text-lg">
                  Notifications
                </h3>
                <a className="text-sm text-primary font-medium" href="#">
                  View all
                </a>
              </div>
              <div className="flex flex-col gap-3">
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
                    className={`flex items-start gap-3 p-3 rounded-md ${
                      notif.type === "error"
                        ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                        : notif.type === "warning"
                        ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                        : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        notif.type === "error"
                          ? "text-error"
                          : notif.type === "warning"
                          ? "text-warning"
                          : "text-info"
                      } mt-0.5`}
                    >
                      {notif.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm ${
                          notif.type === "error"
                            ? "text-error"
                            : notif.type === "warning"
                            ? "text-warning"
                            : "text-info"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-white/70">
                        {notif.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="flex flex-col bg-white dark:bg-white/10 rounded-lg border border-border-color dark:border-white/20 p-4 gap-4 flex-1">
              <h3 className="text-text-primary dark:text-white font-bold text-lg">
                Recent Activity
              </h3>
              <div className="flex-1 overflow-y-auto pr-2">
                <ul className="flex flex-col gap-4">
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
                    <li key={idx} className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-base">
                          {activity.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary dark:text-white truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-text-secondary dark:text-white/50">
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
