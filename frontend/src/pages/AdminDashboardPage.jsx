import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const AdminDashboardPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar variant="admin-dashboard" />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header variant="admin" />
        <main className="flex-1 p-6 lg:p-10 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2 rounded-lg p-4 bg-container border border-border-color">
                <p className="text-text-secondary text-sm font-medium leading-normal">Active Robots</p>
                <p className="text-text-primary tracking-light text-2xl font-bold leading-tight">5/6</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-4 bg-container border border-border-color">
                <p className="text-text-secondary text-sm font-medium leading-normal">Avg. Battery</p>
                <p className="text-text-primary tracking-light text-2xl font-bold leading-tight">88%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-4 bg-container border border-border-color">
                <p className="text-text-secondary text-sm font-medium leading-normal">Connectivity</p>
                <p className="text-success tracking-light text-2xl font-bold leading-tight">Strong</p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg p-4 bg-container border border-border-color">
                <p className="text-text-secondary text-sm font-medium leading-normal">Waste Capacity</p>
                <p className="text-text-primary tracking-light text-2xl font-bold leading-tight">75%</p>
              </div>
            </div>
            <div className="flex flex-col bg-container rounded-lg border border-border-color p-4 gap-4">
              <h3 className="text-text-primary font-bold text-lg">Real-Time Fleet Location</h3>
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-md object-cover"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLBdURdgQ9NNS5duRHchuUEP-VchCS_Gkxb5CDVZmZmENEdA5SRVJc1QNcCSmYwjINtd_vIdw23-0NWXxEHR0aC-bc27jiWY0SRONGCAxVexNeGNRvS1l6h2o-r28Kr-sCvl4x_xop7B2nA0XvNorw-zARWGoZP6twWsvLuznrszwrAehFNxUm8g6SK-4AlUo5XVNkQDb5chZBUrMLXdmHMGIFfrkZB7EQim8Zbk5MAYCLcB55N_pKbBhODKczzDTYnC66lu52ce8")',
                }}
              ></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/live-monitoring"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-container border border-border-color hover:bg-primary/5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl text-primary">videocam</span>
                <p className="font-semibold text-sm">Live Monitoring</p>
              </a>
              <a
                href="/manual-control"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-container border border-border-color hover:bg-primary/5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl text-primary">gamepad</span>
                <p className="font-semibold text-sm">Manual Control</p>
              </a>
              <a
                href="#"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-container border border-border-color hover:bg-primary/5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl text-primary">analytics</span>
                <p className="font-semibold text-sm">View Analytics</p>
              </a>
              <a
                href="#"
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-container border border-border-color hover:bg-primary/5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl text-primary">build</span>
                <p className="font-semibold text-sm">Maintenance</p>
              </a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col bg-container rounded-lg border border-border-color p-4 gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-text-primary font-bold text-lg">Notifications</h3>
                <a href="#" className="text-sm text-primary font-medium">
                  View all
                </a>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 p-3 rounded-md bg-error/10">
                  <span className="material-symbols-outlined text-error mt-0.5">error</span>
                  <div>
                    <p className="font-semibold text-sm text-error">Critical: Obstacle Detected</p>
                    <p className="text-xs text-text-secondary">Robot RBT-003 has stopped. Manual intervention required.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-md bg-warning/10">
                  <span className="material-symbols-outlined text-warning mt-0.5">warning</span>
                  <div>
                    <p className="font-semibold text-sm text-warning">Alert: Bin Full</p>
                    <p className="text-xs text-text-secondary">Robot RBT-005 bin is at 95% capacity. Returning to base.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-md bg-info/10">
                  <span className="material-symbols-outlined text-info mt-0.5">info</span>
                  <div>
                    <p className="font-semibold text-sm text-info">Info: Route Completed</p>
                    <p className="text-xs text-text-secondary">Robot RBT-001 has completed its scheduled route.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col bg-container rounded-lg border border-border-color p-4 gap-4 flex-1">
              <h3 className="text-text-primary font-bold text-lg">Recent Activity</h3>
              <div className="flex-1 overflow-y-auto pr-2">
                <ul className="flex flex-col gap-4">
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-base">route</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Route Started - RBT-004</p>
                      <p className="text-xs text-text-secondary">2 mins ago</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bin Emptied - RBT-002</p>
                      <p className="text-xs text-text-secondary">5 mins ago</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-warning/10 text-warning">
                      <span className="material-symbols-outlined text-base">sensors_off</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lost Connection - RBT-006</p>
                      <p className="text-xs text-text-secondary">8 mins ago</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-base">power</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Now Charging - RBT-001</p>
                      <p className="text-xs text-text-secondary">15 mins ago</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-error/10 text-error">
                      <span className="material-symbols-outlined text-base">block</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Obstacle Detected - RBT-003</p>
                      <p className="text-xs text-text-secondary">18 mins ago</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

