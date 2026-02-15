import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navigation } from "lucide-react";

export const AutonomousNavPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex w-full min-h-screen" style={{ backgroundColor: "#f0f2f5", fontFamily: "Inter, sans-serif" }}>
      <Sidebar variant="manual-control" isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 p-4 mt-16 lg:p-8 lg:mt-0">
        <div className="flex flex-col gap-8">
          <header>
            <h1 className="text-3xl font-bold" style={{ color: "#111827" }}>Autonomous Navigation</h1>
            <p className="text-base text-gray-600">Robot will drive and pick trash autonomously. Coming soon.</p>
          </header>
          <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 rounded-xl bg-white border" style={{ borderColor: "#e5e7eb" }}>
            <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: "#e8f5ee" }}>
              <Navigation size={32} style={{ color: "#17563a" }} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#111827" }}>Coming soon</h2>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Autonomous navigation and trash collection will be implemented here. You will be able to start the robot in auto mode and monitor progress.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
