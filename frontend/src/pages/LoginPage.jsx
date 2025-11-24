import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to admin dashboard on login
    navigate('/admin-dashboard');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1">
          <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8">
            <div className="flex flex-col w-full max-w-sm items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-primary">recycling</span>
                <span className="text-3xl font-bold text-neutral-900">EcoBot</span>
              </div>
              <div className="w-full text-center">
                <h1 className="text-neutral-900 tracking-tight text-[32px] font-bold leading-tight pb-2 pt-6">
                  Sign in to your account
                </h1>
                <p className="text-neutral-600 text-base font-normal leading-normal">
                  Welcome back, please enter your details.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex w-full flex-col items-stretch gap-4 pt-6">
                <label className="flex flex-col flex-1">
                  <p className="text-neutral-800 text-base font-medium leading-normal pb-2">Email Address</p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-neutral-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-300 bg-white h-12 placeholder:text-neutral-500 p-[15px] text-base font-normal leading-normal"
                    placeholder="Enter your email"
                    type="email"
                    required
                  />
                </label>
                <label className="flex flex-col flex-1">
                  <p className="text-neutral-800 text-base font-medium leading-normal pb-2">Password</p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-neutral-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-neutral-300 bg-white h-12 placeholder:text-neutral-500 p-[15px] pr-12 text-base font-normal leading-normal"
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-500 absolute inset-y-0 right-0 flex items-center justify-center px-4 rounded-r-lg hover:bg-neutral-100 focus:outline-0 focus:ring-2 focus:ring-primary/50"
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </label>
                <div className="w-full text-right">
                  <a href="#" className="text-primary hover:underline text-sm font-medium leading-normal">
                    Forgot your password?
                  </a>
                </div>
                <div className="w-full pt-4">
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-white text-base font-bold leading-normal transition-colors hover:bg-primary/90"
                  >
                    Log In
                  </button>
                </div>
              </form>
              <div className="pt-8 text-center">
                <p className="text-neutral-500 text-xs font-normal">© 2024 EcoBot. All rights reserved.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

