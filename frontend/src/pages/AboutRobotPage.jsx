import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export const AboutRobotPage = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-10">
            {/* TopNavBar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#294237] dark:border-white/10 px-4 md:px-10 py-3">
              <div className="flex items-center gap-4 text-white dark:text-slate-800">
                <div className="size-6 text-primary">
                  <span className="material-symbols-outlined !text-3xl text-[#7ABA78] dark:text-primary">
                    recycling
                  </span>
                </div>
                <h2 className="text-white dark:text-slate-800 text-lg font-bold leading-tight tracking-[-0.015em]">
                  EcoBot Admin
                </h2>
              </div>
              <div className="hidden md:flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-9">
                  <Link
                    to="/admin-dashboard"
                    className="text-white/70 dark:text-slate-600 hover:text-white dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
                  >
                    Dashboard
                  </Link>
                  <a
                    href="#"
                    className="text-white/70 dark:text-slate-600 hover:text-white dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
                  >
                    Robot Status
                  </a>
                  <a
                    href="#"
                    className="text-white/70 dark:text-slate-600 hover:text-white dark:hover:text-primary transition-colors text-sm font-medium leading-normal"
                  >
                    Map View
                  </a>
                  <a className="text-white dark:text-primary text-sm font-bold leading-normal" href="#">
                    About
                  </a>
                </div>
                <div className="flex gap-2">
                  <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#294237] dark:bg-white/10 text-white dark:text-slate-600 hover:bg-primary/50 transition-colors gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                    <span className="material-symbols-outlined">notifications</span>
                  </button>
                  <ThemeToggle />
                </div>
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNamJeRyzmJ_fcAM8sXKwY-Wp5SDNJ_0i3iQ5RdCsjsG1YiwrKWxUxnPzo_OezZbVq1mzXQ3gvi6QtMME2yW0p7Rga3v-YBN732ggoiZGoMMWOMLQB2BSWOHp8yTBYPRJQOtEAufgKTnfZPj-Whrkz-cmoGWALSng0oJfVFFTZ6PtZEkAV2fp9QHxA-9VCFRmdtLRGf-kmDqpPzOrjlHe26m2G7AFakeMacCePMWa_eOsJcnUz4vzvri7rpngzdNOUAGzCBXMfA20")`,
                  }}
                />
              </div>
            </header>

            {/* HeroSection */}
            <main>
              <div className="flex min-h-[480px] flex-col gap-6 sm:gap-8 bg-cover bg-center bg-no-repeat sm:rounded-lg items-center justify-center p-4"
                style={{
                  backgroundImage: `linear-gradient(rgba(19, 32, 26, 0.6) 0%, rgba(19, 32, 26, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuL6JuGs6kfkIv6dD5VTppETT3b4Fzp7mgkEwKRN-3deBP3r5Ffy8i99SPduvRHC8L8yldURE-x2ZE4nKlVV2B3nY2HvpAbxOmkTA3qsAlMQeHVp29nOLIt2SLZOzS1YNlfi9cMz7dR6btLQ8x200EUcOept4NJNz0ztxmi7PrA04vBzq_yZyYPexgL3NHQmF7oyXZCS_LTGDF-21HbfgV4w0enITuoXdS8LTTMoCV23Q5LOdTjrZkFM41kCjSYLm7QzL9krYLOwM")`,
                }}
              >
                <div className="flex flex-col gap-2 text-center max-w-2xl">
                  <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">
                    Meet EcoBot: The Future of Autonomous Waste Management
                  </h1>
                  <h2 className="text-[#c7e0d6] dark:text-white/80 text-sm sm:text-base font-normal leading-normal">
                    An intelligent, autonomous robot designed to create cleaner public spaces through advanced technology.
                  </h2>
                </div>
              </div>

              {/* Core Functions Section */}
              <section className="mt-10">
                <h2 className="text-white dark:text-slate-800 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Core Functions
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4">
                  {[
                    {
                      icon: 'navigation',
                      title: 'Autonomous Navigation',
                      desc: 'Navigates complex environments safely and efficiently using LiDAR and sensor fusion.',
                    },
                    {
                      icon: 'compost',
                      title: 'Intelligent Sorting',
                      desc: 'Uses computer vision to identify and sort different types of waste materials.',
                    },
                    {
                      icon: 'monitoring',
                      title: 'Real-time Data',
                      desc: 'Transmits live operational data and waste collection metrics to the dashboard.',
                    },
                    {
                      icon: 'battery_charging_full',
                      title: 'Automated Charging',
                      desc: 'Automatically returns to its docking station to recharge when the battery is low.',
                    },
                  ].map((func, idx) => (
                    <div
                      key={idx}
                      className="flex flex-1 gap-3 rounded-lg border border-[#3a5f4e] dark:border-white/10 bg-[#1d2f27] dark:bg-white/5 p-4 flex-col hover:border-primary transition-colors"
                    >
                      <div className="text-[#7ABA78] dark:text-primary">
                        <span className="material-symbols-outlined !text-3xl">{func.icon}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-white dark:text-slate-800 text-base font-bold leading-tight">
                          {func.title}
                        </h3>
                        <p className="text-[#9ac1af] dark:text-slate-600 text-sm font-normal leading-normal">
                          {func.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Technology & Hardware Section */}
              <section className="mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-4">
                  <div>
                    <h2 className="text-white dark:text-slate-800 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                      Technology Breakdown
                    </h2>
                    <div className="flex flex-col gap-3 mt-4">
                      {[
                        {
                          title: 'Artificial Intelligence',
                          desc: 'Our AI-powered core enables dynamic pathfinding and decision-making, allowing EcoBot to adapt to changing environments and optimize its collection routes in real-time for maximum efficiency.',
                          open: true,
                        },
                        {
                          title: 'IoT Connectivity',
                          desc: 'EcoBot is constantly connected, transmitting vital data like bin capacity, battery status, and operational logs to the admin dashboard, enabling remote monitoring and management.',
                        },
                        {
                          title: 'Computer Vision',
                          desc: 'High-definition cameras paired with machine learning models allow EcoBot to see and understand its surroundings, accurately identifying recyclables, organic waste, and general trash for proper sorting.',
                        },
                        {
                          title: 'Sensor Fusion',
                          desc: 'By combining data from LiDAR, ultrasonic sensors, and GPS, EcoBot builds a comprehensive 3D map of its environment, ensuring safe and precise navigation around obstacles and people.',
                        },
                      ].map((tech, idx) => (
                        <details
                          key={idx}
                          className="group rounded-lg bg-[#1d2f27] dark:bg-white/5 border border-[#3a5f4e] dark:border-white/10 p-4 open:border-primary"
                          open={tech.open}
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between text-base font-bold text-white dark:text-slate-800">
                            {tech.title}
                            <div className="text-[#9ac1af] dark:text-slate-600 transition-transform duration-300 group-open:rotate-180">
                              <span className="material-symbols-outlined">expand_more</span>
                            </div>
                          </summary>
                          <p className="mt-2 text-sm text-[#9ac1af] dark:text-slate-600">{tech.desc}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-white dark:text-slate-800 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                      Robot Anatomy
                    </h2>
                    <div className="mt-4 relative rounded-lg border border-[#3a5f4e] dark:border-white/10 bg-[#1d2f27] dark:bg-white/5 p-4 aspect-[4/3] flex items-center justify-center">
                      <img
                        className="max-h-full max-w-full object-contain"
                        alt="Diagram of the EcoBot with labels pointing to hardware components"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0EvMg_NArTitlh0MuWCMN7zrT6dfUzMOmw3epoLlIMchDgUCY-2aRoX1Q_HPogNaybuNwm35mwM_wCn4ZMtHKpo0qH4UCrCKDrH9T4gZnR8IBJRfxor5OUIlT7cAfOGAbn6QqklrO_06zGLYNx15Jrcek4Hy6XXLfH94s3_nAshxek8pgXVxAI-shhJLB8EPfVcbMq8IU3_qaQ06RcbebErT3sUxyArazvZKLZ6NxbZKS01tVP6A5_B7NUKZgDZjXgs8fW0KvyP0"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Mission & Impact Section */}
              <section className="mt-10 p-4">
                <div className="rounded-lg bg-[#1d2f27] dark:bg-white/5 border border-[#3a5f4e] dark:border-white/10 p-6 lg:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                      <h2 className="text-white dark:text-slate-800 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        Our Mission & Environmental Impact
                      </h2>
                      <p className="text-[#9ac1af] dark:text-slate-600 text-sm mt-4">
                        Our mission is to revolutionize urban sanitation by deploying intelligent, autonomous robots that
                        create cleaner, greener, and more sustainable public spaces. We believe technology is the key to
                        solving complex environmental challenges, reducing waste in landfills, and improving the quality
                        of life for communities everywhere.
                      </p>
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-4">
                      <div className="flex items-center gap-4 rounded-lg bg-primary/20 dark:bg-primary/10 p-4">
                        <span className="text-3xl font-bold text-[#7ABA78] dark:text-primary">25%</span>
                        <p className="text-sm text-[#c7e0d6] dark:text-primary/80">
                          Projected reduction in landfill waste through enhanced sorting.
                        </p>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg bg-primary/20 dark:bg-primary/10 p-4">
                        <span className="text-3xl font-bold text-[#7ABA78] dark:text-primary">60%</span>
                        <p className="text-sm text-[#c7e0d6] dark:text-primary/80">
                          Increase in operational efficiency over manual collection methods.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            {/* Footer */}
            <footer className="mt-10 border-t border-[#294237] dark:border-white/10 px-4 py-6 text-center text-[#9ac1af] dark:text-slate-600">
              <p className="text-sm">© 2024 EcoBot Inc. All rights reserved.</p>
              <div className="flex justify-center gap-4 mt-2">
                <a className="text-xs hover:text-white dark:hover:text-primary transition-colors" href="#">
                  Support
                </a>
                <a className="text-xs hover:text-white dark:hover:text-primary transition-colors" href="#">
                  Documentation
                </a>
                <a className="text-xs hover:text-white dark:hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

