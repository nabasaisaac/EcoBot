import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export const ContactPage = () => {
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
              Contact Us
            </h1>
            <p className="mt-2 text-lg" style={{ color: "#4a5568" }}>
              Get in touch about EcoBot and waste management solutions
            </p>
          </div>
        </section>

        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-8">
          <div className="max-w-[1280px] mx-auto">
            <p className="text-base leading-relaxed mb-10" style={{ color: "#4a5568" }}>
              EcoBot is an intelligent autonomous robot control system designed to revolutionize waste management in Uganda. 
              If you are interested in the prototype, partnerships, or deployment in your community, we’d like to hear from you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl border border-gray-200 bg-white flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: "#e8f5ee" }}>
                  <Mail size={28} style={{ color: "#17563a" }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1a202c" }}>Email</h3>
                <a
                  href="mailto:contact@ecobot.org"
                  className="text-sm hover:underline"
                  style={{ color: "#17563a" }}
                >
                  contact@ecobot.org
                </a>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 bg-white flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: "#e8f5ee" }}>
                  <MapPin size={28} style={{ color: "#17563a" }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1a202c" }}>Location</h3>
                <p className="text-sm" style={{ color: "#4a5568" }}>
                  Uganda
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 bg-white flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ backgroundColor: "#e8f5ee" }}>
                  <MessageCircle size={28} style={{ color: "#17563a" }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#1a202c" }}>General Enquiries</h3>
                <p className="text-sm" style={{ color: "#4a5568" }}>
                  Partnerships, demos, and deployment
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-xl border border-gray-200 bg-gray-50 max-w-2xl">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1a202c" }}>What we offer</h3>
              <ul className="text-sm space-y-2" style={{ color: "#4a5568" }}>
                <li>• Web-based control interface with real-time monitoring</li>
                <li>• Manual control and AI-powered trash detection</li>
                <li>• Autonomous navigation and pickup (prototype)</li>
                <li>• Support for deployment and training</li>
              </ul>
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
              Login to Dashboard
            </Link>
          </div>
        </section>
      </main>
      <Footer variant="home" />
    </div>
  );
};
