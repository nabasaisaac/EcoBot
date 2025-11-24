import { Sidebar } from '../components/Sidebar';

export const ManualControlPage = () => {
  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar variant="manual-control" />
      <main className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          <header className="flex flex-wrap justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-dark-text text-3xl font-bold leading-tight">Manual Robot Control</p>
              <p className="text-gray-text text-base font-normal leading-normal">Real-time remote operation of ARC-007</p>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-text text-sm font-medium leading-normal">Live Camera Feed</p>
                <p className="text-gray-text text-sm font-normal leading-normal">Latency: 50ms</p>
              </div>
              <div
                className="relative flex items-center justify-center bg-gray-900 bg-cover bg-center aspect-video rounded-xl overflow-hidden"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRLwONZTijW7IeTzW5teV4W0w4H1PM5TBXQ14jrqn302xpwCUeeM4T1GyiQ3dEW0b8zQeNW_oE7yhn5oT-AM0Ix8s3d7bh0ZTqp3dhV0dH3FvKYhhZpu5nWIZKQlNL0-W6B0I0cDcjX5Ibjgh2RczG5hTevRhc-WRFj08Y1vNlS0IIkiwzfav46GI_k-PsDUlcjed_WUv_NQIYQlt3x_wPBve72lxZl6lYdJDF2Z9SsSWqidX1uQlP5DsKe-c3L3wSJYYZXaJn4HE")',
                }}
              >
                <button className="flex shrink-0 items-center justify-center rounded-full size-16 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors">
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl border border-border-color">
                <h2 className="text-dark-text text-xl font-semibold leading-tight mb-6">Controls</h2>
                <div className="flex justify-center items-center mb-6">
                  <div className="relative w-48 h-48 bg-light-gray rounded-full flex items-center justify-center border border-border-color">
                    <div className="absolute w-full h-full text-gray-400">
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 p-2">
                        <span className="material-symbols-outlined text-3xl">arrow_back</span>
                      </div>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 p-2">
                        <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                      </div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2">
                        <span className="material-symbols-outlined text-3xl">arrow_upward</span>
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-2">
                        <span className="material-symbols-outlined text-3xl">arrow_downward</span>
                      </div>
                    </div>
                    <div className="w-24 h-24 bg-primary rounded-full cursor-grab active:cursor-grabbing shadow-lg"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="col-span-1 bg-primary text-white font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
                    <span className="material-symbols-outlined text-xl">play_arrow</span> Start
                  </button>
                  <button className="col-span-1 bg-gray-200 text-dark-text font-semibold py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors">
                    <span className="material-symbols-outlined text-xl">pause</span> Stop
                  </button>
                  <button className="col-span-2 bg-gray-200 text-dark-text py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors font-medium">
                    <span className="material-symbols-outlined text-xl">recycling</span> Collect Rubbish
                  </button>
                  <button className="col-span-2 bg-red-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
                    <span className="material-symbols-outlined text-xl">emergency</span> EMERGENCY STOP
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-border-color">
                <h2 className="text-dark-text text-xl font-semibold leading-tight mb-4">Live Status</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-text">
                      <span className="material-symbols-outlined text-primary text-xl">battery_5_bar</span>
                      <p className="text-sm">Battery Level</p>
                    </div>
                    <p className="font-semibold text-dark-text text-sm">85%</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-text">
                      <span className="material-symbols-outlined text-primary text-xl">signal_cellular_4_bar</span>
                      <p className="text-sm">Signal Strength</p>
                    </div>
                    <p className="font-semibold text-dark-text text-sm">Excellent</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-text">
                      <span className="material-symbols-outlined text-gray-500 text-xl">sync</span>
                      <p className="text-sm">Motor Status</p>
                    </div>
                    <p className="font-medium text-dark-text text-sm">Idle</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-text">
                      <span className="material-symbols-outlined text-gray-500 text-xl">smart_toy</span>
                      <p className="text-sm">Current Mode</p>
                    </div>
                    <p className="font-medium text-primary text-sm">Manual Control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

