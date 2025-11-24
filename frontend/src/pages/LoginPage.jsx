import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic
    navigate("/admin-dashboard");
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="flex flex-1">
        <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8">
          <div className="flex flex-col w-full max-w-sm items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-primary">
                recycling
              </span>
              <span className="text-3xl font-bold text-on-surface dark:text-white">
                EcoBot
              </span>
            </div>

            {/* Headline */}
            <div className="w-full text-center">
              <h1 className="text-on-surface dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-2 pt-6">
                Sign in to your account
              </h1>
              <p className="text-on-surface-secondary dark:text-white/80 text-base font-normal leading-normal">
                Welcome back, please enter your details.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col items-stretch gap-4 pt-6"
            >
              {/* Email Field */}
              <label className="flex flex-col flex-1">
                <p className="text-on-surface dark:text-white text-base font-medium leading-normal pb-2">
                  Email Address
                </p>
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-on-surface dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-white/20 bg-white dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder:text-white/50 p-[15px] text-base font-normal leading-normal"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              {/* Password Field */}
              <label className="flex flex-col flex-1">
                <p className="text-on-surface dark:text-white text-base font-medium leading-normal pb-2">
                  Password
                </p>
                <div className="relative flex w-full flex-1 items-stretch">
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-on-surface dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-white/20 bg-white dark:bg-background-dark h-12 placeholder:text-gray-500 dark:placeholder:text-white/50 p-[15px] pr-12 text-base font-normal leading-normal"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="text-gray-500 dark:text-white/50 absolute inset-y-0 right-0 flex items-center justify-center px-4 rounded-r-lg hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-0 focus:ring-2 focus:ring-primary/50"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </label>

              {/* Forgot Password Link */}
              <div className="w-full text-right">
                <a
                  className="text-primary hover:underline text-sm font-medium leading-normal"
                  href="#"
                >
                  Forgot your password?
                </a>
              </div>

              {/* Login Button */}
              <div className="w-full pt-4">
                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-white text-base font-bold leading-normal transition-colors hover:bg-primary/90"
                >
                  Log In
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="pt-8 text-center">
              <p className="text-gray-500 dark:text-white/50 text-xs font-normal">
                © 2024 EcoBot. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
