import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; email: string; planTier: string } | null>(null);

  useEffect(() => {
    // Retrieve user details from localStorage
    const storedUser = localStorage.getItem('pulse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    } else {
      // Fallback request to fetch profile
      fetchProfile();
    }
  }, [location]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('pulse_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('pulse_user', JSON.stringify(data));
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pulse_token');
    localStorage.removeItem('pulse_user');
    navigate('/', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  // Resolve plan color badges
  const getTierBadgeClass = (tier: string = 'Free') => {
    switch (tier.toLowerCase()) {
      case 'starter':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'growth':
        return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      case 'scale':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070a13] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-60 h-full bg-[#0B0F19] border-r border-slate-800/80 flex flex-col flex-shrink-0 justify-between select-none">
        <div>
          {/* Logo Brand Header */}
          <div className="h-[70px] border-b border-slate-800/80 flex items-center px-6">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-8 w-auto">
                <defs>
                  <mask id="pulse-cutout-layout">
                    <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />
                    <path d="M 8,58 H 26 L 35,68 L 50,22 L 65,74 L 74,58 H 92" fill="none" stroke="#000000" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                  </mask>
                </defs>
                <g mask="url(#pulse-cutout-layout)">
                  <rect x="22" y="42" width="14" height="43" rx="7" fill="#4F46E5" />
                  <rect x="43" y="25" width="14" height="60" rx="7" fill="#4F46E5" />
                  <rect x="64" y="10" width="14" height="75" rx="7" fill="#4F46E5" />
                </g>
                <path d="M 8,58 H 26 L 35,68 L 50,22 L 65,74 L 74,58 H 92" fill="none" stroke="#0D9488" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xl font-black tracking-wider text-white group-hover:text-indigo-400 transition-colors">PULSE</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-1.5 flex-1">
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 group ${
                isActive('/dashboard')
                  ? 'bg-indigo-600/10 text-white border-l-4 border-indigo-500 pl-3'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <div className="w-5 h-5 mr-3 flex-shrink-0 text-current">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
                  <rect x="3" y="3" width="8" height="8" rx="1.5" fill="none" stroke={isActive('/dashboard') ? '#4F46E5' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="13" width="8" height="8" rx="1.5" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="13" y="3" width="8" height="11" rx="1.5" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="13" y="16" width="8" height="5" rx="1.5" fill="none" stroke={isActive('/dashboard') ? '#4F46E5' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              Dashboard
            </Link>

            {/* Orders Link */}
            <Link
              to="/orders"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 group ${
                isActive('/orders')
                  ? 'bg-indigo-600/10 text-white border-l-4 border-indigo-500 pl-3'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <div className="w-5 h-5 mr-3 flex-shrink-0 text-current">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
                  <path d="M 9,8 C 9,4 15,4 15,8" fill="none" stroke={isActive('/orders') ? '#4F46E5' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="5" y="8" width="14" height="13" rx="2" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="9" y1="12" x2="15" y2="12" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                  <line x1="9" y1="16" x2="13" y2="16" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              Orders
            </Link>

            {/* Retention Link */}
            <Link
              to="/retention"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 group ${
                isActive('/retention')
                  ? 'bg-indigo-600/10 text-white border-l-4 border-indigo-500 pl-3'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <div className="w-5 h-5 mr-3 flex-shrink-0 text-current">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
                  <rect x="3" y="3" width="5" height="5" rx="1.5" fill={isActive('/retention') ? '#4F46E5' : 'currentColor'} />
                  <rect x="10" y="3" width="5" height="5" rx="1.5" fill="#0D9488" />
                  <rect x="17" y="3" width="5" height="5" rx="1.5" fill="#F97316" />
                  <rect x="3" y="10" width="5" height="5" rx="1.5" fill={isActive('/retention') ? '#4F46E5' : 'currentColor'} />
                  <rect x="10" y="10" width="5" height="5" rx="1.5" fill="#0D9488" opacity="0.7" />
                  <rect x="17" y="10" width="5" height="5" rx="1.5" fill="#0D9488" opacity="0.4" />
                  <rect x="3" y="17" width="5" height="5" rx="1.5" fill={isActive('/retention') ? '#4F46E5' : 'currentColor'} />
                  <rect x="10" y="17" width="5" height="5" rx="1.5" fill="#0D9488" opacity="0.5" />
                  <rect x="17" y="17" width="5" height="5" rx="1.5" fill="#0D9488" opacity="0.2" />
                </svg>
              </div>
              Retention
            </Link>

            {/* Settings Link */}
            <Link
              to="/settings"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 group ${
                isActive('/settings')
                  ? 'bg-indigo-600/10 text-white border-l-4 border-indigo-500 pl-3'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <div className="w-5 h-5 mr-3 flex-shrink-0 text-current">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
                  <circle cx="12" cy="12" r="3" fill="none" stroke="#F97316" strokeWidth="2" />
                  <circle cx="12" cy="12" r="7" fill="none" stroke={isActive('/settings') ? '#4F46E5' : 'currentColor'} strokeWidth="2" />
                  <line x1="12" y1="5" x2="12" y2="2" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="19" x2="12" y2="22" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="2" y2="12" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <line x1="19" y1="12" x2="22" y2="12" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <line x1="17" y1="7" x2="19.1" y2="4.9" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <line x1="7" y1="7" x2="4.9" y2="4.9" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <line x1="7" y1="17" x2="4.9" y2="19.1" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                  <line x1="17" y1="17" x2="19.1" y2="19.1" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              Settings
            </Link>
          </nav>
        </div>

        {/* Profile User Summary Footer */}
        <div className="border-t border-slate-800/80 p-4">
          {user && (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* current plan status */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Plan</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getTierBadgeClass(user.planTier)}`}>
                  {user.planTier}
                </span>
              </div>

              {/* logout btn */}
              <button
                onClick={handleLogout}
                className="w-full mt-1 inline-flex items-center justify-center px-3 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all duration-150"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Work Canvas */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col bg-[#070a13] relative z-0">
        {/* Header bar */}
        <header className="h-[70px] bg-[#0B0F19]/50 border-b border-slate-800/80 flex items-center justify-between px-8 flex-shrink-0 backdrop-blur">
          <div>
            <h1 className="text-sm font-semibold text-slate-400 flex items-center gap-1.5">
              <span>Retro Fashion Store</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488] animate-pulse"></span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0D9488]/10 text-[#0D9488]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></span>
              Live Sync Active
            </span>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-8 flex-1 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
