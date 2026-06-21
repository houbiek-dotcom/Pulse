import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (localStorage.getItem('pulse_token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = isRegistering ? '/api/auth/signup' : '/api/auth/login';
    const body = isRegistering 
      ? { email, password, name, planTier: 'Free' } 
      : { email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      // Store JWT token in localStorage
      localStorage.setItem('pulse_token', data.token);
      // Storing human-readable user details as well for sidebar display
      localStorage.setItem('pulse_user', JSON.stringify(data.user));

      // Redirect to dashboard or where they were trying to go
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Connection failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-10 w-auto">
              <defs>
                <mask id="pulse-cutout-login">
                  <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />
                  <path d="M 8,58 H 26 L 35,68 L 50,22 L 65,74 L 74,58 H 92" fill="none" stroke="#000000" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                </mask>
              </defs>
              <g mask="url(#pulse-cutout-login)">
                <rect x="22" y="42" width="14" height="43" rx="7" fill="#4F46E5" />
                <rect x="43" y="25" width="14" height="60" rx="7" fill="#4F46E5" />
                <rect x="64" y="10" width="14" height="75" rx="7" fill="#4F46E5" />
              </g>
              <path d="M 8,58 H 26 L 35,68 L 50,22 L 65,74 L 74,58 H 92" fill="none" stroke="#0D9488" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-2xl font-black tracking-wider text-white">PULSE</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {isRegistering ? 'Create your Pulse account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
          >
            {isRegistering ? 'sign in to existing account' : 'start your 14-day free trial'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0B0F19] py-8 px-4 shadow-2xl border border-slate-800/80 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="appearance-none block w-full px-3 py-2 border border-slate-700/80 rounded-lg bg-slate-900/60 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="appearance-none block w-full px-3 py-2 border border-slate-700/80 rounded-lg bg-slate-900/60 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-3 py-2 border border-slate-700/80 rounded-lg bg-slate-900/60 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                <div className="text-xs text-orange-500 font-semibold text-center">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-indigo-600/30 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authenticating...
                  </span>
                ) : isRegistering ? (
                  'Start Free Trial'
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <span>Secure 256-bit SSL Auth</span>
            <Link to="/" className="hover:text-white transition-colors">← Back to Homepage</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
