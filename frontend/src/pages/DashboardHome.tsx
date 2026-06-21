import { useState, useEffect } from 'react';

export default function DashboardHome() {
  const [userName, setUserName] = useState('Merchant');

  useEffect(() => {
    const storedUser = localStorage.getItem('pulse_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setUserName(parsed.name);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome back, {userName}! 👋</h2>
          <p className="text-sm text-slate-400 mt-1">Here is how your store is performing over the last 30 days.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-semibold bg-slate-900/40 border border-slate-800/80 px-3 py-1.5 rounded-lg">
            Calendar: May 20, 2026 – June 19, 2026
          </span>
        </div>
      </div>

      {/* 4-Column Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total Revenue</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20">
              +18.2%
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-4">
            <span className="text-3xl font-black text-white tracking-tight">$124,500</span>
            <span className="text-xs text-slate-500">USD</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Prior period: $105,310</span>
            <span className="text-[#0D9488] font-semibold">📈 Trending Up</span>
          </div>
        </div>

        {/* Average Order Value Card */}
        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Avg Order Value</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              +4.8%
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-4">
            <span className="text-3xl font-black text-white tracking-tight">$78.50</span>
            <span className="text-xs text-slate-500">USD</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Prior period: $74.90</span>
            <span>Target: &gt; $70.00</span>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Conversion Rate</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              +0.4%
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-4">
            <span className="text-3xl font-black text-white tracking-tight">3.2%</span>
            <span className="text-xs text-slate-500">avg</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Prior period: 2.8%</span>
            <span className="text-[#0D9488] font-semibold">Goal Met</span>
          </div>
        </div>

        {/* Active Campaigns Card */}
        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Active Campaigns</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
              Active
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-4">
            <span className="text-3xl font-black text-white tracking-tight">4</span>
            <span className="text-xs text-slate-500">promos</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Shopify: 3 | WooCommerce: 1</span>
            <span className="text-indigo-400 hover:underline cursor-pointer">Manage</span>
          </div>
        </div>
      </div>

      {/* Main Graph & Feed Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Container (Take 2 Columns) */}
        <div className="lg:col-span-2 bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 flex flex-col shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Revenue Performance (Spline)</h3>
              <p className="text-xs text-slate-400 mt-1">Comparing current interval (Indigo) vs prior interval (Teal)</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-bold">
              <span className="flex items-center space-x-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>Current Month</span>
              </span>
              <span className="flex items-center space-x-1.5 text-[#0D9488]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]"></span>
                <span>Prior Month</span>
              </span>
            </div>
          </div>

          {/* Render Area/Spline Graph using highly precise SVG Paths and Gradients */}
          <div className="flex-1 w-full h-[260px] relative mt-4">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                {/* Indigo Gradient */}
                <linearGradient id="chart-indigo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
                {/* Teal Gradient */}
                <linearGradient id="chart-teal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D9488" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0D9488" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#1E293B" strokeWidth="0.5" strokeDasharray="3 3" />

              {/* Prior Month Curve Area (Teal) */}
              <path
                d="M 0,160 Q 50,150 100,120 T 200,130 T 300,140 T 400,100 T 500,110 L 500,200 L 0,200 Z"
                fill="url(#chart-teal)"
              />
              {/* Prior Month Curve Line */}
              <path
                d="M 0,160 Q 50,150 100,120 T 200,130 T 300,140 T 400,100 T 500,110"
                fill="none"
                stroke="#0D9488"
                strokeWidth="1.5"
                opacity="0.8"
                strokeLinecap="round"
              />

              {/* Current Month Curve Area (Indigo) */}
              <path
                d="M 0,180 Q 50,140 100,100 T 200,60 T 300,80 T 400,40 T 500,50 L 500,200 L 0,200 Z"
                fill="url(#chart-indigo)"
              />
              {/* Current Month Curve Line */}
              <path
                d="M 0,180 Q 50,140 100,100 T 200,60 T 300,80 T 400,40 T 500,50"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Highlight Circle Dots on High Point */}
              <circle cx="200" cy="60" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="400" cy="40" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="1.5" />
            </svg>

            {/* Simulated Tooltip overlay */}
            <div className="absolute top-4 left-[38%] bg-slate-950 border border-slate-800 text-white rounded-xl p-3 shadow-2xl text-[11px] font-semibold space-y-1">
              <p className="text-slate-400">June 9, 2026</p>
              <p className="text-indigo-400 flex items-center justify-between gap-3">
                <span>Revenue:</span>
                <span className="font-bold text-white">$5,820</span>
              </p>
              <p className="text-teal-400 flex items-center justify-between gap-3">
                <span>Prior Period:</span>
                <span className="font-bold text-white">$4,250</span>
              </p>
            </div>
          </div>

          {/* X Axis Dates */}
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 px-1 mt-4">
            <span>May 20</span>
            <span>May 30</span>
            <span>June 9</span>
            <span>June 19 (Today)</span>
          </div>
        </div>

        {/* Real-time Order Feed (Takes 1 Column) */}
        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 flex flex-col shadow-xl">
          <div className="border-b border-slate-800/80 pb-4 mb-4">
            <h3 className="text-base font-bold text-white">Live Store Feed</h3>
            <p className="text-xs text-slate-400 mt-1">Real-time purchase logs</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Feed Row 1 */}
            <div className="flex items-center justify-between p-2 hover:bg-slate-800/20 rounded-xl transition-all duration-150">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#0D9488]/10 text-[#0D9488] font-bold text-xs flex items-center justify-center">
                  AP
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Anthony P.</p>
                  <p className="text-[10px] text-slate-400">Shopify Store</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">+$124.00</p>
                <p className="text-[10px] text-slate-500">2 min ago</p>
              </div>
            </div>

            {/* Feed Row 2 */}
            <div className="flex items-center justify-between p-2 hover:bg-slate-800/20 rounded-xl transition-all duration-150">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#4F46E5]/10 text-indigo-400 font-bold text-xs flex items-center justify-center">
                  ER
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Emma R.</p>
                  <p className="text-[10px] text-slate-400">Shopify Store</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">+$78.50</p>
                <p className="text-[10px] text-slate-500">12 min ago</p>
              </div>
            </div>

            {/* Feed Row 3 */}
            <div className="flex items-center justify-between p-2 hover:bg-slate-800/20 rounded-xl transition-all duration-150">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#F97316]/10 text-orange-400 font-bold text-xs flex items-center justify-center">
                  SL
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Sophie L.</p>
                  <p className="text-[10px] text-slate-400">WooCommerce</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">+$245.00</p>
                <p className="text-[10px] text-slate-500">1 hr ago</p>
              </div>
            </div>

            {/* Feed Row 4 */}
            <div className="flex items-center justify-between p-2 hover:bg-slate-800/20 rounded-xl transition-all duration-150">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#4F46E5]/10 text-indigo-400 font-bold text-xs flex items-center justify-center">
                  DK
                </div>
                <div>
                  <p className="text-xs font-bold text-white">David K.</p>
                  <p className="text-[10px] text-slate-400">Shopify Store</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">+$110.00</p>
                <p className="text-[10px] text-slate-500">2 hr ago</p>
              </div>
            </div>

            {/* Feed Row 5 */}
            <div className="flex items-center justify-between p-2 hover:bg-[#0D9488]/10 rounded-xl transition-all duration-150">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[#0D9488]/10 text-[#0D9488] font-bold text-xs flex items-center justify-center">
                  SM
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Sarah M.</p>
                  <p className="text-[10px] text-slate-400">WooCommerce</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">+$54.00</p>
                <p className="text-[10px] text-slate-500">4 hr ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
