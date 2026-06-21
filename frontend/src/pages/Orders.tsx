import { useState } from 'react';

interface Order {
  id: string;
  customer: string;
  email: string;
  platform: 'Shopify' | 'WooCommerce';
  date: string;
  total: number;
  status: 'Fulfilled' | 'Processing' | 'Cancelled';
}

const INITIAL_ORDERS: Order[] = [
  { id: '#1024', customer: 'Emma Watson', email: 'emma@watson.co.uk', platform: 'Shopify', date: 'June 19, 2026', total: 89.00, status: 'Fulfilled' },
  { id: '#1023', customer: 'Marcus Aurelius', email: 'marcus@rome.gov', platform: 'Shopify', date: 'June 19, 2026', total: 154.50, status: 'Processing' },
  { id: '#1022', customer: 'Taylor Swift', email: 'taylor@swift.music', platform: 'WooCommerce', date: 'June 18, 2026', total: 245.00, status: 'Fulfilled' },
  { id: '#1021', customer: 'Harry Potter', email: 'harry@hogwarts.edu', platform: 'Shopify', date: 'June 18, 2026', total: 120.00, status: 'Cancelled' },
  { id: '#1020', customer: 'Bilbo Baggins', email: 'bilbo@shire.me', platform: 'WooCommerce', date: 'June 17, 2026', total: 54.00, status: 'Fulfilled' },
  { id: '#1019', customer: 'Bruce Wayne', email: 'bruce@waynecorp.com', platform: 'Shopify', date: 'June 16, 2026', total: 890.00, status: 'Fulfilled' },
  { id: '#1018', customer: 'Clark Kent', email: 'clark@dailyplanet.com', platform: 'WooCommerce', date: 'June 15, 2026', total: 32.00, status: 'Processing' },
  { id: '#1017', customer: 'Tony Stark', email: 'tony@starkindustries.com', platform: 'Shopify', date: 'June 14, 2026', total: 1250.00, status: 'Cancelled' },
];

export default function Orders() {
  const [orders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<'all' | 'fulfilled' | 'processing' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'Shopify' | 'WooCommerce'>('all');

  const handleExportCSV = () => {
    const headers = 'Order ID,Customer Name,Email,Platform,Date,Total,Status\n';
    const rows = filteredOrders.map(o => 
      `${o.id},"${o.customer}",${o.email},${o.platform},"${o.date}",$${o.total.toFixed(2)},${o.status}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `pulse_orders_export_${activeTab}.csv`);
    a.click();
  };

  // Filter logic
  const filteredOrders = orders.filter(order => {
    // 1. Tab Status Filter
    const matchesTab = activeTab === 'all' || order.status.toLowerCase() === activeTab;
    
    // 2. Platform Filter
    const matchesPlatform = platformFilter === 'all' || order.platform === platformFilter;
    
    // 3. Search Query Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      order.customer.toLowerCase().includes(query) || 
      order.id.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query);

    return matchesTab && matchesPlatform && matchesSearch;
  });

  const getStatusBadge = (status: 'Fulfilled' | 'Processing' | 'Cancelled') => {
    switch (status) {
      case 'Fulfilled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            Fulfilled
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Processing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Cancelled
          </span>
        );
    }
  };

  const getPlatformBadge = (platform: 'Shopify' | 'WooCommerce') => {
    if (platform === 'Shopify') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          🟢 Shopify
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide bg-violet-500/10 text-violet-400 border border-violet-500/20">
          🟣 WooCommerce
        </span>
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Orders Management</h2>
          <p className="text-sm text-slate-400 mt-1">Granular overview and filters for your multi-platform e-commerce sales.</p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-850 text-slate-200 hover:text-white text-xs font-bold transition-all"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Segment Tabs Navigation */}
      <div className="border-b border-slate-800/80">
        <nav className="flex space-x-8">
          {(['all', 'fulfilled', 'processing', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-all duration-150 capitalize focus:outline-none ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-800'
              }`}
            >
              {tab} Orders
            </button>
          ))}
        </nav>
      </div>

      {/* Filters Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0B0F19]/40 border border-slate-800/80 p-4 rounded-2xl">
        {/* Search Input */}
        <div className="md:col-span-3">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search by Order ID, customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-800 bg-slate-950 rounded-xl placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Platform Selection */}
        <div>
          <label htmlFor="platform" className="sr-only">Platform</label>
          <select
            id="platform"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="block w-full py-2 px-3 border border-slate-800 bg-slate-950 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
          >
            <option value="all">All Platforms</option>
            <option value="Shopify">Shopify Only</option>
            <option value="WooCommerce">WooCommerce Only</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800/80">
            <thead className="bg-slate-950/40">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Platform</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/10">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-white">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">{order.customer}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getPlatformBadge(order.platform)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-white">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500 font-semibold">
                    No orders found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
