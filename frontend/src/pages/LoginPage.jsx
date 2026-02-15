import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Recycle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import robotImage from '../assets/robot_image.jpeg';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, login } = useAuth();

  const from = location.state?.from || '/manual-control';

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full flex-col justify-center items-center p-4 overflow-x-hidden"
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundImage: `url(${robotImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Small dark overlay so login card stands out */}
      <div
        className="absolute inset-0 z-0 bg-black/70"
        
      />
      <main className="relative z-10 flex flex-1 flex-col justify-center items-center w-full max-w-md">
        <div className="flex flex-col w-full items-center gap-6 rounded-xl bg-white backdrop-blur-sm shadow-xl p-8 border border-white/20">
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
              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>
              )}
              <form onSubmit={handleSubmit} className="flex w-full flex-col items-stretch gap-4 pt-6">
                <label className="flex flex-col flex-1">
                  <p className="text-base font-medium leading-normal pb-2" style={{ color: '#1e293b' }}>Email Address</p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 border bg-white h-12 placeholder:text-opacity-60 p-[15px] text-base font-normal leading-normal"
                    style={{ color: '#0f172a', borderColor: '#cbd5e1', '--tw-ring-color': 'rgba(23, 86, 58, 0.5)' }}
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="hover:underline text-sm font-medium leading-normal"
                    style={{ color: '#17563a' }}
                  >
                    Forgot your password?
                  </button>
                </div>
                <div className="w-full pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex h-12 w-full items-center justify-center rounded-lg text-white text-base font-bold leading-normal transition-colors hover:opacity-90 disabled:opacity-70"
                    style={{ backgroundColor: '#17563a' }}
                  >
                    {submitting ? 'Signing in...' : 'Log In'}
                  </button>
                </div>
              </form>
          <div className="pt-8 text-center">
            <p className="text-xs font-normal" style={{ color: '#64748b' }}>© 2026 EcoBot. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
