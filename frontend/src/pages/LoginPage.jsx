import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic
    navigate('/admin-dashboard');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="flex flex-1">
        <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8">
          <div className="flex flex-col w-full max-w-md items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-primary">recycling</span>
              <span className="text-3xl font-bold text-slate-800 dark:text-white">EcoBot</span>
            </div>

            {/* Headline */}
            <div className="w-full text-center">
              <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-3 pt-6">
                Sign in to your account
              </h1>
              <p className="text-slate-600 dark:text-[#9ac1af] text-base font-normal leading-normal">
                Welcome back, please enter your details.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-stretch gap-4 pt-6">
              {/* Email Field */}
              <label className="flex flex-col flex-1">
                <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">
                  Email Address
                </p>
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-[#3a5f4e] bg-background-light dark:bg-[#1d2f27] focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#9ac1af] p-[15px] text-base font-normal leading-normal"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              {/* Password Field */}
              <label className="flex flex-col flex-1">
                <p className="text-slate-800 dark:text-white text-base font-medium leading-normal pb-2">
                  Password
                </p>
                <div className="relative flex w-full flex-1 items-stretch">
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-[#3a5f4e] bg-background-light dark:bg-[#1d2f27] focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#9ac1af] p-[15px] border-r-0 pr-2 text-base font-normal leading-normal"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="text-slate-400 dark:text-[#9ac1af] flex border border-slate-300 dark:border-[#3a5f4e] bg-background-light dark:bg-[#1d2f27] items-center justify-center px-[15px] rounded-r-lg border-l-0 hover:bg-slate-100 dark:hover:bg-primary/20 focus:outline-0 focus:ring-2 focus:ring-primary/50"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </label>

              {/* Forgot Password Link */}
              <div className="w-full text-right">
                <a className="text-primary hover:underline text-sm font-normal leading-normal" href="#">
                  Forgot your password?
                </a>
              </div>

              {/* Login Button */}
              <div className="w-full pt-4">
                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center rounded-lg bg-primary text-white text-base font-bold leading-normal transition-colors hover:bg-primary/90"
                >
                  Log In
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="pt-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                © 2024 EcoBot. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

