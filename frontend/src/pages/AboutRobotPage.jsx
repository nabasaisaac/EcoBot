import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const AboutRobotPage = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-10">
            <Header />
            <main>
              <div className="@container">
                <div className="@[480px]:p-4">
                  <div
                    className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuL6JuGs6kfkIv6dD5VTppETT3b4Fzp7mgkEwKRN-3deBP3r5Ffy8i99SPduvRHC8L8yldURE-x2ZE4nKlVV2B3nY2HvpAbxOmkTA3qsAlMQeHVp29nOLIt2SLZOzS1YNlfi9cMz7dR6btLQ8x200EUcOept4NJNz0ztxmi7PrA04vBzq_yZyYPexgL3NHQmF7oyXZCS_LTGDF-21HbfgV4w0enITuoXdS8LTTMoCV23Q5LOdTjrZkFM41kCjSYLm7QzL9krYLOwM")',
                    }}
                  >
                    <div className="flex flex-col gap-2 text-center max-w-2xl">
                      <h1 className="text-on-surface text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        Meet EcoBot: The Future of Autonomous Waste Management
                      </h1>
                      <h2 className="text-on-surface-secondary text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                        An intelligent, autonomous robot designed to create cleaner public spaces through advanced
                        technology.
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <section className="mt-10">
                <h2 className="text-on-surface text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Core Functions
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4">
                  <div className="flex flex-1 gap-3 rounded-lg border border-border-color bg-surface p-4 flex-col hover:border-primary/50 transition-colors">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">navigation</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-on-surface text-base font-bold leading-tight">Autonomous Navigation</h3>
                      <p className="text-on-surface-secondary text-sm font-normal leading-normal">
                        Navigates complex environments safely and efficiently using LiDAR and sensor fusion.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-lg border border-border-color bg-surface p-4 flex-col hover:border-primary/50 transition-colors">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">compost</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-on-surface text-base font-bold leading-tight">Intelligent Sorting</h3>
                      <p className="text-on-surface-secondary text-sm font-normal leading-normal">
                        Uses computer vision to identify and sort different types of waste materials.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-lg border border-border-color bg-surface p-4 flex-col hover:border-primary/50 transition-colors">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">monitoring</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-on-surface text-base font-bold leading-tight">Real-time Data</h3>
                      <p className="text-on-surface-secondary text-sm font-normal leading-normal">
                        Transmits live operational data and waste collection metrics to the dashboard.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-3 rounded-lg border border-border-color bg-surface p-4 flex-col hover:border-primary/50 transition-colors">
                    <div className="text-primary">
                      <span className="material-symbols-outlined !text-3xl">battery_charging_full</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-on-surface text-base font-bold leading-tight">Automated Charging</h3>
                      <p className="text-on-surface-secondary text-sm font-normal leading-normal">
                        Automatically returns to its docking station to recharge when the battery is low.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-4">
                  <div>
                    <h2 className="text-on-surface text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                      Technology Breakdown
                    </h2>
                    <div className="flex flex-col gap-3 mt-4">
                      <details className="group rounded-lg bg-surface border border-border-color p-4 open:border-primary" open>
                        <summary className="flex cursor-pointer list-none items-center justify-between text-base font-bold text-on-surface">
                          Artificial Intelligence
                          <div className="text-on-surface-secondary transition-transform duration-300 group-open:rotate-180">
                            <span className="material-symbols-outlined">expand_more</span>
                          </div>
                        </summary>
                        <p className="mt-2 text-sm text-on-surface-secondary">
                          Our AI-powered core enables dynamic pathfinding and decision-making, allowing EcoBot to adapt
                          to changing environments and optimize its collection routes in real-time for maximum efficiency.
                        </p>
                      </details>
                      <details className="group rounded-lg bg-surface border border-border-color p-4 open:border-primary">
                        <summary className="flex cursor-pointer list-none items-center justify-between text-base font-bold text-on-surface">
                          IoT Connectivity
                          <div className="text-on-surface-secondary transition-transform duration-300 group-open:rotate-180">
                            <span className="material-symbols-outlined">expand_more</span>
                          </div>
                        </summary>
                        <p className="mt-2 text-sm text-on-surface-secondary">
                          EcoBot is constantly connected, transmitting vital data like bin capacity, battery status, and
                          operational logs to the admin dashboard, enabling remote monitoring and management.
                        </p>
                      </details>
                      <details className="group rounded-lg bg-surface border border-border-color p-4 open:border-primary">
                        <summary className="flex cursor-pointer list-none items-center justify-between text-base font-bold text-on-surface">
                          Computer Vision
                          <div className="text-on-surface-secondary transition-transform duration-300 group-open:rotate-180">
                            <span className="material-symbols-outlined">expand_more</span>
                          </div>
                        </summary>
                        <p className="mt-2 text-sm text-on-surface-secondary">
                          High-definition cameras paired with machine learning models allow EcoBot to see and understand
                          its surroundings, accurately identifying recyclables, organic waste, and general trash for
                          proper sorting.
                        </p>
                      </details>
                      <details className="group rounded-lg bg-surface border border-border-color p-4 open:border-primary">
                        <summary className="flex cursor-pointer list-none items-center justify-between text-base font-bold text-on-surface">
                          Sensor Fusion
                          <div className="text-on-surface-secondary transition-transform duration-300 group-open:rotate-180">
                            <span className="material-symbols-outlined">expand_more</span>
                          </div>
                        </summary>
                        <p className="mt-2 text-sm text-on-surface-secondary">
                          By combining data from LiDAR, ultrasonic sensors, and GPS, EcoBot builds a comprehensive 3D
                          map of its environment, ensuring safe and precise navigation around obstacles and people.
                        </p>
                      </details>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-on-surface text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                      Robot Anatomy
                    </h2>
                    <div className="mt-4 relative rounded-lg border border-border-color bg-surface p-4 aspect-[4/3] flex items-center justify-center">
                      <img
                        className="max-h-full max-w-full object-contain"
                        alt="Diagram of the EcoBot with labels pointing to hardware components"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0EvMg_NArTitlh0MuWCMN7zrT6dfUzMOmw3epoLlIMchDgUCY-2aRoX1Q_HPogNaybuNwm35mwM_wCn4ZMtHKpo0qH4UCrCKDrH9T4gZnR8IBJRfxor5OUIlT7cAfOGAbn6QqklrO_06zGLYNx15Jrcek4Hy6XXLfH94s3_nAshxek8pgXVxAI-shhJLB8EPfVcbMq8IU3_qaQ06RcbebErT3sUxyArazvZKLZ6NxbZKS01tVP6A5_B7NUKZgDZjXgs8fW0KvyP0"
                      />
                    </div>
                  </div>
                </div>
              </section>
              <section className="mt-10 p-4">
                <div className="rounded-lg bg-surface border border-border-color p-6 lg:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                      <h2 className="text-on-surface text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        Our Mission & Environmental Impact
                      </h2>
                      <p className="text-on-surface-secondary text-sm mt-4">
                        Our mission is to revolutionize urban sanitation by deploying intelligent, autonomous robots that
                        create cleaner, greener, and more sustainable public spaces. We believe technology is the key to
                        solving complex environmental challenges, reducing waste in landfills, and improving the quality
                        of life for communities everywhere.
                      </p>
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-4">
                      <div className="flex items-center gap-4 rounded-lg bg-primary/10 p-4">
                        <span className="text-3xl font-bold text-primary">25%</span>
                        <p className="text-sm text-primary/80">
                          Projected reduction in landfill waste through enhanced sorting.
                        </p>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg bg-primary/10 p-4">
                        <span className="text-3xl font-bold text-primary">60%</span>
                        <p className="text-sm text-primary/80">
                          Increase in operational efficiency over manual collection methods.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

