import { ManualControlSidebar } from "../components/ManualControlSidebar";
import { ThemeToggle } from "../components/ThemeToggle";

export const ManualControlPage = () => {
  return (
    <div className="relative flex min-h-screen w-full bg-light-gray dark:bg-background-dark font-display text-dark-text dark:text-white">
      <ManualControlSidebar />
      <main className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          {/* Page Heading */}
          <header className="flex flex-wrap justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-dark-text dark:text-white text-3xl font-bold leading-tight">
                Manual Robot Control
              </p>
              <p className="text-gray-text dark:text-white/70 text-base font-normal leading-normal">
                Real-time remote operation of ARC-007
              </p>
            </div>
            <ThemeToggle />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Video Feed */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-text dark:text-white/70 text-sm font-medium leading-normal">
                  Live Camera Feed
                </p>
                <p className="text-gray-text dark:text-white/70 text-sm font-normal leading-normal">
                  Latency: 50ms
                </p>
              </div>
              <div
                className="relative flex items-center justify-center bg-gray-900 bg-cover bg-center aspect-video rounded-xl overflow-hidden"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRLwONZTijW7IeTzW5teV4W0w4H1PM5TBXQ14jrqn302xpwCUeeM4T1GyiQ3dEW0b8zQeNW_oE7yhn5oT-AM0Ix8s3d7bh0ZTqp3dhV0dH3FvKYhhZpu5nWIZKQlNL0-W6B0I0cDcjX5Ibjgh2RczG5hTevRhc-WRFj08Y1vNlS0IIkiwzfav46GI_k-PsDUlcjed_WUv_NQIYQlt3x_wPBve72lxZl6lYdJDF2Z9SsSWqidX1uQlP5DsKe-c3L3wSJYYZXaJn4HE")`,
                }}
              >
                <button className="flex shrink-0 items-center justify-center rounded-full size-16 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors">
                  <span
                    className="material-symbols-outlined text-5xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Controls & Status */}
            <div className="flex flex-col gap-6">
              {/* Controls Section */}
              <div className="bg-white dark:bg-white/10 p-6 rounded-xl border border-border-color dark:border-white/20">
                <h2 className="text-dark-text dark:text-white text-xl font-semibold leading-tight mb-6">
                  Controls
                </h2>
                {/* Joystick */}
                <div className="flex justify-center items-center mb-6">
                  <div className="relative w-48 h-48 bg-light-gray dark:bg-white/10 rounded-full flex items-center justify-center border border-border-color dark:border-white/20">
                    <div className="absolute w-full h-full text-gray-400 dark:text-white/50">
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 p-2">
                        <span className="material-symbols-outlined text-3xl">
                          arrow_back
                        </span>
                      </div>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 p-2">
                        <span className="material-symbols-outlined text-3xl">
                          arrow_forward
                        </span>
                      </div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2">
                        <span className="material-symbols-outlined text-3xl">
                          arrow_upward
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-2">
                        <span className="material-symbols-outlined text-3xl">
                          arrow_downward
                        </span>
                      </div>
                    </div>
                    <div className="w-24 h-24 bg-primary rounded-full cursor-grab active:cursor-grabbing shadow-lg"></div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="col-span-1 bg-primary text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      play_arrow
                    </span>{" "}
                    Start
                  </button>
                  <button className="col-span-1 bg-gray-200 dark:bg-white/20 text-dark-text dark:text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-white/30 transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      pause
                    </span>{" "}
                    Stop
                  </button>
                  <button className="col-span-2 bg-gray-200 dark:bg-white/20 text-dark-text dark:text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-white/30 transition-colors font-medium">
                    <span className="material-symbols-outlined text-xl">
                      recycling
                    </span>{" "}
                    Collect Rubbish
                  </button>
                  <button className="col-span-2 bg-red-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      emergency
                    </span>{" "}
                    EMERGENCY STOP
                  </button>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-white dark:bg-white/10 p-6 rounded-xl border border-border-color dark:border-white/20">
                <h2 className="text-dark-text dark:text-white text-xl font-semibold leading-tight mb-4">
                  Live Status
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      icon: "battery_5_bar",
                      label: "Battery Level",
                      value: "85%",
                      color: "text-primary",
                    },
                    {
                      icon: "signal_cellular_4_bar",
                      label: "Signal Strength",
                      value: "Excellent",
                      color: "text-primary",
                    },
                    {
                      icon: "sync",
                      label: "Motor Status",
                      value: "Idle",
                      color: "text-gray-500 dark:text-white/70",
                    },
                    {
                      icon: "smart_toy",
                      label: "Current Mode",
                      value: "Manual Control",
                      color: "text-primary",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3 text-gray-text dark:text-white/70">
                        <span
                          className={`material-symbols-outlined ${item.color} text-xl`}
                        >
                          {item.icon}
                        </span>
                        <p className="text-sm">{item.label}</p>
                      </div>
                      <p className="font-semibold text-dark-text dark:text-white text-sm">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
