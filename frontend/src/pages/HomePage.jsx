import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <Navbar variant="home" />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-5">
          <div className="max-w-[1280px] mx-auto">
            <div
              className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end p-6 sm:gap-8 sm:p-12"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCazERXvxxZJd_HqnE8azZa05nez0eylys69TcHLFMaK1coRZG1-lk9ElUrdqdTzcWhE7NKZOdYP_Dt2N91rP2WVxOlD5oVO0E3UczwDN3cRPemuzJQyvcPdU-UcGYAAj747GWVrRc0V5wmMn0s_ZtDsqJ3IVOZ0wByY3Y2D8zWNowmgaAlhdtLSHeMFlIxLHuczWkngQyOSkBuwjf9SZTd57PnzA112zjoOW_To5IjbGpyeRP2T9_HEbZJiOPCxa2Qwhfrm1KBqcc")`,
              }}
            >
              <div className="flex flex-col gap-2 text-left max-w-2xl">
                <h1 className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">
                  Revolutionizing Waste Management in Uganda
                </h1>
                <p className="text-white text-base sm:text-lg font-normal leading-normal">
                  Our autonomous robot leverages AI and IoT to create a cleaner, more sustainable future for communities.
                </p>
              </div>
              <Link to="/login">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 sm:h-12 px-4 sm:px-5 bg-primary text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                  <span className="truncate">Login to Access Dashboard</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Two-Column Content Section */}
        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-16 sm:py-24">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-slate-800 dark:text-white text-3xl sm:text-4xl font-bold leading-tight tracking-[-0.015em]">
                The Challenge and Our Solution
              </h2>
              <p className="text-slate-600 dark:text-white/80 text-base font-normal leading-normal mt-4">
                Uganda faces significant challenges with waste management, leading to environmental and public health concerns. Our intelligent robot directly addresses these issues by providing efficient, autonomous, and data-driven rubbish collection.
              </p>
              <p className="text-slate-600 dark:text-white/80 text-base font-normal leading-normal mt-4">
                By automating the collection process, we aim to reduce pollution, improve sanitation, and provide valuable insights into waste generation patterns, helping to build a smarter and cleaner urban environment.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div
                className="w-full bg-center bg-no-repeat bg-cover aspect-video rounded-xl"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBwuhLc66p0iGdugsYOeL_O_9Nu9FsmWRc2kBd7-9tI4tvxJ93cFxf5tly0rydQmvmdiinsUhPm6Ox80W8Xo7NaYfd3SkqKN8_iVyO5wV0XUST1W8RhKyz9QW3mqhcM5spJ3mbJfcLcf5oozxQ4aXs6bKiUl7oBkYRBrX5qPDoHNWbb9JP-E-u2I8KmvNHPkbB_IfQg19X--AL1iGPgmPcP74Li5LYlfA3mll0XCgPr1P5tjaEAWoKfRGhwTaVHd8D0mYwPin4bpc0")`,
                }}
              />
            </div>
          </div>
        </section>

        {/* Card-based Feature Section */}
        <section className="w-full px-4 sm:px-10 lg:px-20 xl:px-40 py-16 sm:py-24 bg-background-dark dark:bg-primary/10">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-slate-800 dark:text-white text-3xl sm:text-4xl font-bold leading-tight tracking-[-0.015em]">
                Core Features
              </h2>
              <p className="text-slate-600 dark:text-white/80 mt-2 max-w-2xl mx-auto">
                Harnessing cutting-edge technology for a cleaner tomorrow.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 rounded-xl bg-background-light dark:bg-background-dark/50 shadow-md dark:shadow-none">
                <div className="flex items-center justify-center size-16 rounded-full bg-primary mb-6">
                  <span className="material-symbols-outlined text-white text-4xl">visibility</span>
                </div>
                <h3 className="text-slate-800 dark:text-white text-xl font-bold mb-2">AI Vision</h3>
                <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed">
                  Utilizes advanced computer vision to accurately detect, identify, and sort different types of waste materials on the go.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-xl bg-background-light dark:bg-background-dark/50 shadow-md dark:shadow-none">
                <div className="flex items-center justify-center size-16 rounded-full bg-primary mb-6">
                  <span className="material-symbols-outlined text-white text-4xl">navigation</span>
                </div>
                <h3 className="text-slate-800 dark:text-white text-xl font-bold mb-2">Autonomous Navigation</h3>
                <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed">
                  Smartly plans and navigates optimal routes through complex urban environments, avoiding obstacles with precision.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-xl bg-background-light dark:bg-background-dark/50 shadow-md dark:shadow-none">
                <div className="flex items-center justify-center size-16 rounded-full bg-primary mb-6">
                  <span className="material-symbols-outlined text-white text-4xl">hub</span>
                </div>
                <h3 className="text-slate-800 dark:text-white text-xl font-bold mb-2">IoT Data Hub</h3>
                <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed">
                  Transmits real-time data on waste levels, collection times, and system status to the central admin dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

