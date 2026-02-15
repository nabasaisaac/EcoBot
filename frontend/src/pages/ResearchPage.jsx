import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BookOpen, Cpu, Target, Beaker } from "lucide-react";

export const ResearchPage = () => {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      <Header variant="home" />
      <main className="grow">
        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-12">
          <div className="max-w-[1280px] mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#1a202c" }}>
              Research
            </h1>
            <p className="mt-2 text-lg" style={{ color: "#4a5568" }}>
              Technology and approach behind EcoBot
            </p>
          </div>
        </section>

        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-8">
          <div className="max-w-[1280px] mx-auto">
            <p className="text-base leading-relaxed mb-8" style={{ color: "#4a5568" }}>
              EcoBot is an intelligent autonomous robot control system designed to revolutionize waste management in Uganda. 
              Our research focuses on bringing together computer vision, robotics, and web-based control into a single 
              prototype that enables real-time monitoring, manual control, and AI-powered trash detection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: "#17563a" }}>
                    <Cpu size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: "#1a202c" }}>Computer Vision</h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                  Custom YOLO-based trash detection runs on the robot’s camera feed. Detected objects are shown with bounding boxes, 
                  and the system can target the nearest trash for autonomous pickup or display counts for the operator.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: "#17563a" }}>
                    <Target size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: "#1a202c" }}>Autonomous Behaviour</h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                  The robot can search for trash, align to center it in the frame, and approach until within range. 
                  A pickup sequence then uses the arm and gripper. Sonar and area-based filtering improve safety and reduce false detections.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: "#17563a" }}>
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: "#1a202c" }}>Web-based Control</h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                  The prototype demonstrates a web-based control interface: login, manual control with live video and status, 
                  and (planned) autonomous navigation—all accessible from a browser for easier deployment and operator training.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: "#17563a" }}>
                    <Beaker size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: "#1a202c" }}>Future Work</h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                  Ongoing work includes full autonomous navigation from the web UI, improved detection in varied lighting, 
                  and field trials in Ugandan communities to refine waste collection and user workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-12">
          <div className="max-w-[1280px] mx-auto text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold transition-colors hover:bg-gray-50"
              style={{ borderColor: "#17563a", color: "#17563a" }}
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer variant="home" />
    </div>
  );
};
