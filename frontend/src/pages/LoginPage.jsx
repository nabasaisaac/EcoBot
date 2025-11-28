import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin-dashboard');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden" style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1">
          <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8">
            <div className="flex flex-col w-full max-w-sm items-center gap-6">
              <div className="flex items-center gap-3">
                <Recycle size={32} style={{ color: '#17563a' }} />
                <span className="text-3xl font-bold" style={{ color: '#0f172a' }}>EcoBot</span>
              </div>
              <div className="w-full text-center">
                <h1 className="tracking-tight text-[32px] font-bold leading-tight pb-2 pt-6" style={{ color: '#0f172a' }}>
                  Sign in to your account
                </h1>
                <p className="text-base font-normal leading-normal" style={{ color: '#475569' }}>
                  Welcome back, please enter your details.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex w-full flex-col items-stretch gap-4 pt-6">
                <label className="flex flex-col flex-1">
                  <p className="text-base font-medium leading-normal pb-2" style={{ color: '#1e293b' }}>Email Address</p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 border bg-white h-12 placeholder:text-opacity-60 p-[15px] text-base font-normal leading-normal"
                    style={{ color: '#0f172a', borderColor: '#cbd5e1', '--tw-ring-color': 'rgba(23, 86, 58, 0.5)' }}
                    placeholder="Enter your email"
                    type="email"
                    required
                  />
                </label>
                <label className="flex flex-col flex-1">
                  <p className="text-base font-medium leading-normal pb-2" style={{ color: '#1e293b' }}>Password</p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 border bg-white h-12 placeholder:text-opacity-60 p-[15px] pr-12 text-base font-normal leading-normal"
                      style={{ color: '#0f172a', borderColor: '#cbd5e1', '--tw-ring-color': 'rgba(23, 86, 58, 0.5)' }}
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      required
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center justify-center px-4 rounded-r-lg hover:bg-gray-100 focus:outline-0 focus:ring-2"
                      style={{ color: '#64748b', '--tw-ring-color': 'rgba(23, 86, 58, 0.5)' }}
                    >
                      {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                    </button>
                  </div>
                </label>
                <div className="w-full text-right">
                  <a href="#" className="hover:underline text-sm font-medium leading-normal" style={{ color: '#17563a' }}>
                    Forgot your password?
                  </a>
                </div>
                <div className="w-full pt-4">
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center rounded-lg text-white text-base font-bold leading-normal transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#17563a' }}
                  >
                    Log In
                  </button>
                </div>
              </form>
              <div className="pt-8 text-center">
                <p className="text-xs font-normal" style={{ color: '#64748b' }}>© 2024 EcoBot. All rights reserved.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
