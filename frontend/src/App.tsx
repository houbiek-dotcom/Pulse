import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Orders from './pages/Orders';
import Retention from './pages/Retention';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

interface Metrics {
  mrr: number;
  mrr_growth: number;
  conversion_rate: number;
  active_trials: number;
  churn_rate: number;
}

// 1. Landing Page Component (Public View)
export function LandingPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('pulse_token');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (priceId: string) => {
    const token = localStorage.getItem('pulse_token');
    if (!token) {
      // If not logged in, redirect to signup/login
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        alert('Could not initiate subscription checkout.');
      }
    } catch (err) {
      console.error('Checkout redirect failed:', err);
      alert('Communication failed with the server.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 antialiased font-sans">
      {/* Navigation */}
      <header className="border-b border-slate-800 bg-[#070a13]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-8 w-auto">
              <defs>
                <mask id="pulse-cutout-landing">
                  <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />
                  <path d="M 8,58 H 26 L 35,68 L 50,22 L 65,74 L 74,58 H 92" fill="none" stroke="#000000" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                </mask>
              </defs>
              <g mask="url(#pulse-cutout-landing)">
                <rect x="22" y="42" width="14" height="43" rx="7" fill="#4F46E5" />
                <rect x="43" y="25" width="14" height="60" rx="7" fill="#4F46E5" />
                <rect x="64" y="10" width="14" height="75" rx="7" fill="#4F46E5" />
              </g>
              <path d="M 8,58 H 26 L 35,68 L 50,22 L 65,74 L 74,58 H 92" fill="none" stroke="#0D9488" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-black tracking-wider text-white">PULSE</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a>
            <a href="#dashboard" className="hover:text-indigo-400 transition-colors">Live Demo</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">Github</a>
          </nav>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Start Free Trial
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (Copy) */}
            <div className="lg:col-span-7 text-left select-none">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-600/10 text-xs font-semibold text-indigo-400 mb-6 animate-pulse">
                <span>🚀</span>
                <span>Pulse 1.0 is officially live!</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Real-Time E-commerce Analytics. <br />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                  No Data Team Required.
                </span>
              </h1>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Connect Shopify or WooCommerce in 5 minutes. Say goodbye to messy spreadsheets and hello to automated revenue insights that drive growth.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => handlePlanSelect('price_1TkB0tDBXoxP3P4OolYdmfYp')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/40 transition-all cursor-pointer"
                >
                  Start Free Trial
                </button>
                <a href="#dashboard" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-700 text-base font-semibold rounded-lg text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-all">
                  Watch 2-Min Demo
                </a>
              </div>
            </div>

            {/* Right Column (Hero Illustration) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Background glow behind image */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-500 opacity-30 blur-2xl group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-[#0B0F19] border border-slate-800 rounded-2xl p-2 shadow-2xl overflow-hidden max-w-md lg:max-w-none">
                  <img src="/landing-hero.png" alt="Pulse analytics visual metaphor" className="rounded-xl w-full h-auto transform hover:scale-[1.02] transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none -z-10" />
      </section>

      {/* Interactive Live Dashboard Section */}
      <section id="dashboard" className="py-16 bg-[#0B0F19] border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 select-none">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Your Analytics Control Center
            </h2>
            <p className="text-slate-400">
              Interactive preview of real-time metrics pulled straight from our backend API.
            </p>
          </div>

          <div className="bg-[#070a13] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden select-none">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                  Live Store Metrics
                </h3>
                <p className="text-xs text-slate-400 mt-1">Real-time sync active ( Shopify & WooCommerce )</p>
              </div>
              <button 
                onClick={fetchMetrics} 
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-750 transition-all disabled:opacity-50"
              >
                <svg className={`h-4.5 w-4.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.246 8H18.2" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh API Data'}
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* MRR Card */}
              <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-6 hover:border-indigo-500/30 transition-all">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Monthly Recurring Revenue</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-white">
                    ${metrics ? metrics.mrr.toLocaleString() : '12,500'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-500/10 text-teal-400">
                    +{metrics ? metrics.mrr_growth : '12.5'}% MoM
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-4/5" />
                </div>
              </div>

              {/* Conversion Card */}
              <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-6 hover:border-indigo-500/30 transition-all">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Trial-to-Paid Conversion</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-white">
                    {metrics ? metrics.conversion_rate : '18.2'}%
                  </span>
                  <span className="text-xs text-slate-400">Target &gt; 15%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-[90%]" />
                </div>
              </div>

              {/* Active Trials Card */}
              <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-6 hover:border-indigo-500/30 transition-all">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Active Free Trials</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-white">
                    {metrics ? metrics.active_trials : '45'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400">
                    Live Trials
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-3/5" />
                </div>
              </div>

              {/* Churn Rate Card */}
              <div className="bg-[#0B0F19] border border-slate-800/80 rounded-xl p-6 hover:border-indigo-500/30 transition-all">
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Monthly Churn Rate</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-white">
                    {metrics ? metrics.churn_rate : '3.8'}%
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-500/10 text-teal-400">
                    Healthy
                  </span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full w-[35%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 select-none">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Designed for Brands That Want Insights, Not Database Schemas
          </h2>
          <p className="text-lg text-slate-400">
            Stop pasting metrics across CSVs. Pulse integrates with your store in 5 minutes and starts highlighting revenue drivers instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 select-none">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-8 hover:border-slate-700 transition-all shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl font-bold mb-6">
              🔌
            </div>
            <h3 className="text-xl font-bold text-white mb-3">5-Minute Integration</h3>
            <p className="text-slate-400 leading-relaxed">
              Connect your Shopify or WooCommerce account with a single click. Pulse automatically syncs historic orders and sets up real-time analytics.
            </p>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-8 hover:border-slate-700 transition-all">
            <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center text-xl font-bold mb-6">
              📊
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Automated Revenue Cohorts</h3>
            <p className="text-slate-400 leading-relaxed">
              See what customer groups are driving long-term value. Pulse automatically segments cohorts by sign-up month, product type, and marketing channel.
            </p>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-8 hover:border-slate-700 transition-all">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-xl font-bold mb-6">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Predictive Churn Detection</h3>
            <p className="text-slate-400 leading-relaxed">
              Spot at-risk subscribers before they unsubscribe. Our machine-learning alerts show you exactly which loyal accounts are losing engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#0B0F19] border-t border-slate-800 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Simple, Uncomplicated Pricing
            </h2>
            <p className="text-lg text-slate-400">
              Start free. Upgrade as your store expands. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-[#070a13] border border-slate-850 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-300">Starter</h3>
                <p className="text-slate-400 text-sm mt-1">For growing stores ready to exit spreadsheets.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">$99</span>
                  <span className="text-slate-400 text-sm">/mo</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-300 border-t border-slate-800/80 pt-6">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Up to 1K orders/mo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Basic real-time dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Shopify & WooCommerce sync
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handlePlanSelect('price_1TkB0tDBXoxP3P4OtvKAruXw')}
                className="mt-8 w-full py-2.5 rounded-lg border border-slate-700 text-slate-300 bg-slate-800/30 hover:bg-slate-800 font-semibold text-sm transition-all cursor-pointer"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Growth Plan */}
            <div className="bg-[#070a13] border-2 border-indigo-600 rounded-2xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-all relative shadow-2xl">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-indigo-650/40">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-400">Growth</h3>
                <p className="text-slate-400 text-sm mt-1">For established brands looking to scale recurring revenue.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">$299</span>
                  <span className="text-slate-400 text-sm">/mo</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-300 border-t border-slate-800/80 pt-6">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Up to 10K orders/mo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Full Cohorts & Segmentation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Churn analysis & alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Advanced Revenue dashboards
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handlePlanSelect('price_1TkB0tDBXoxP3P4OolYdmfYp')}
                className="mt-8 w-full py-2.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 font-semibold text-sm transition-all cursor-pointer"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Scale Plan */}
            <div className="bg-[#070a13] border border-slate-850 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-indigo-300">Scale</h3>
                <p className="text-slate-400 text-sm mt-1">For enterprise stores demanding custom reporting and APIs.</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">$799</span>
                  <span className="text-slate-400 text-sm">/mo</span>
                </div>
                <ul className="space-y-4 text-sm text-slate-300 border-t border-slate-800/80 pt-6">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Unlimited orders/mo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Full API & Turso integration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Custom dashboard reports
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Dedicated support team
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handlePlanSelect('price_1TkB0tDBXoxP3P4OO46cGmwK')}
                className="mt-8 w-full py-2.5 rounded-lg border border-slate-700 text-slate-300 bg-slate-800/30 hover:bg-slate-800 font-semibold text-sm transition-all cursor-pointer"
              >
                Start 14-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070a13] py-12 text-slate-500 text-sm text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="font-semibold text-slate-400">Pulse</span>
            <span>—</span>
            <span>Real-time E-commerce Dashboards & Revenue Insights</span>
          </div>
          <p>© {new Date().getFullYear()} Pulse SaaS Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// 2. Central Router Container (Maps Routes)
export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Authenticated Dashboard Pages wrapped inside DashboardLayout */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/retention" element={<Retention />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
