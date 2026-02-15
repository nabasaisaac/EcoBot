import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Recycle, Eye, Cpu, Globe } from "lucide-react";
import robotImage from "../assets/robot_image.jpeg";

export const AboutPage = () => {
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
              About EcoBot
            </h1>
            <p className="mt-2 text-lg" style={{ color: "#4a5568" }}>
              Intelligent autonomous robot control for waste management
            </p>
          </div>
        </section>

        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-8">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={robotImage}
                alt="EcoBot autonomous waste collection robot"
                className="w-full rounded-xl shadow-lg object-cover aspect-video"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#1a202c" }}>
                Revolutionizing Waste Management in Uganda
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#4a5568" }}>
                EcoBot is an intelligent autonomous robot control system designed to revolutionize waste management in Uganda. 
                The prototype demonstrates a web-based control interface that enables real-time monitoring, manual control, 
                and AI-powered trash detection using computer vision.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#4a5568" }}>
                By combining autonomous navigation, a robotic arm with gripper, and live camera feedback with object detection, 
                EcoBot aims to create a cleaner, more sustainable future for communities.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-16" style={{ backgroundColor: "#f7fafc" }}>
          <div className="max-w-[1280px] mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12" style={{ color: "#1a202c" }}>
              What EcoBot Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{ backgroundColor: "#17563a" }}>
                  <Eye size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#1a202c" }}>Real-time Monitoring</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                  Live camera stream with AI-powered trash detection and bounding boxes for informed control and monitoring.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{ backgroundColor: "#17563a" }}>
                  <Cpu size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#1a202c" }}>Manual & Autonomous Control</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                  Drive the robot manually via gamepad or use autonomous navigation to search, align, and pick up trash.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{ backgroundColor: "#17563a" }}>
                  <Globe size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#1a202c" }}>Web-based Interface</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4a5568" }}>
                  Access the control dashboard from any device—login, monitor status, and operate the robot from one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-12">
          <div className="max-w-[1280px] mx-auto text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#17563a" }}
            >
              <Recycle size={20} /> Get Started
            </Link>
          </div>
        </section>
      </main>
      <Footer variant="home" />
    </div>
  );
};
