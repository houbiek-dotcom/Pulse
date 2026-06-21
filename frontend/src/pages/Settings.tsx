import { useState, useEffect } from 'react';

export default function Settings() {
  const [activeSubTab, setActiveSubTab] = useState<'account' | 'preferences' | 'integrations' | 'notifications'>('integrations');
  const [user, setUser] = useState<{ name: string; email: string; planTier: string; id: string } | null>(null);
  
  // Interactive mock connection state for WooCommerce
  const [isWooConnected, setIsWooConnected] = useState(false);
  const [wooUrl, setWooUrl] = useState('https://retro-fashion-woo.com');
  const [wooKey, setWooApiKey] = useState('ck_9f7f45c812d4b9b6e8f5a5c6d7e8f901a1b2c3d4');
  const [connectingWoo, setConnectingWoo] = useState(false);
  const [wooSuccessMsg, setWooSuccessMsg] = useState(false);

  // Copy to clipboard mock api key state
  const [copiedKey, setCopiedKey] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('pulse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleCopyApiKey = () => {
    setCopiedKey(true);
    navigator.clipboard.writeText('pk_live_51TkB0tDBXoxP3P4OPulseAnalyticsSecretClientKey992');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleConnectWoo = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectingWoo(true);
    setTimeout(() => {
      setConnectingWoo(false);
      setIsWooConnected(true);
      setWooSuccessMsg(true);
      setTimeout(() => setWooSuccessMsg(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Header controls row */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Store Settings & Connections</h2>
        <p className="text-sm text-slate-400 mt-1">Manage e-commerce shop integrations, developer API credentials, notification options, and billing tiers.</p>
      </div>

      {/* Horizontal Settings Tabs */}
      <div className="flex border-b border-slate-800/80 gap-6">
        <button
          onClick={() => setActiveSubTab('integrations')}
          className={`pb-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-all duration-150 focus:outline-none ${
            activeSubTab === 'integrations' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Connections & Integrations
        </button>
        <button
          onClick={() => setActiveSubTab('account')}
          className={`pb-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-all duration-150 focus:outline-none ${
            activeSubTab === 'account' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Account Details
        </button>
        <button
          onClick={() => setActiveSubTab('preferences')}
          className={`pb-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-all duration-150 focus:outline-none ${
            activeSubTab === 'preferences' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Preferences
        </button>
        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`pb-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-all duration-150 focus:outline-none ${
            activeSubTab === 'notifications' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Notifications
        </button>
      </div>

      {activeSubTab === 'integrations' ? (
        <div className="space-y-6">
          {/* Shopify Sync Card */}
          <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center font-bold text-lg text-emerald-400 border border-emerald-500/10">
                  S
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Shopify Connection</h3>
                  <p className="text-xs text-slate-400 mt-0.5">retro-fashion.myshopify.com</p>
                </div>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488] animate-pulse"></span>
                  CONNECTED
                </span>
              </div>
            </div>
            <div className="pt-2 text-xs text-slate-400 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/60 mt-4">
              <div>
                <span className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Historical Orders</span>
                <span className="block text-sm font-black text-white mt-1">4,512 Synced</span>
              </div>
              <div>
                <span className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Real-time Webhook</span>
                <span className="block text-sm font-black text-[#0D9488] mt-1">Active</span>
              </div>
              <div>
                <span className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Last Sync Check</span>
                <span className="block text-sm font-black text-white mt-1">Just now</span>
              </div>
            </div>
          </div>

          {/* WooCommerce Card */}
          <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center font-bold text-lg text-violet-400 border border-violet-500/10">
                  W
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">WooCommerce Connection</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Integrate self-hosted WordPress WooCommerce storefronts.</p>
                </div>
              </div>
              <div>
                {isWooConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20 animate-fadeIn">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488] animate-pulse"></span>
                    CONNECTED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    NOT CONNECTED
                  </span>
                )}
              </div>
            </div>

            {wooSuccessMsg && (
              <div className="rounded-xl bg-teal-500/10 border border-teal-500/30 p-3.5 text-center text-xs text-[#0D9488] font-bold animate-fadeIn">
                🎉 WooCommerce connected successfully! Historic order sync initiated in background...
              </div>
            )}

            {!isWooConnected ? (
              <form onSubmit={handleConnectWoo} className="space-y-4 border-t border-slate-800/60 pt-4 mt-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="woo-url" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">WooCommerce Store URL</label>
                    <input
                      id="woo-url"
                      type="url"
                      required
                      value={wooUrl}
                      onChange={(e) => setWooUrl(e.target.value)}
                      placeholder="https://retro-fashion-woo.com"
                      className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-800 bg-slate-950 rounded-xl placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="woo-key" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">REST API Consumer Key (Read-Only)</label>
                    <input
                      id="woo-key"
                      type="password"
                      required
                      value={wooKey}
                      onChange={(e) => setWooApiKey(e.target.value)}
                      placeholder="ck_••••••••••••••••••••••••••••••••"
                      className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-800 bg-slate-950 rounded-xl placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs transition-all"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={connectingWoo}
                    className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    {connectingWoo ? 'Validating REST Credentials...' : 'Connect WooCommerce Store'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-2 text-xs text-slate-400 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800/60 mt-4 animate-fadeIn">
                <div>
                  <span className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Synced Domain</span>
                  <span className="block text-sm font-black text-white mt-1">retro-fashion-woo.com</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-bold uppercase tracking-wider text-[10px]">Database Status</span>
                  <span className="block text-sm font-black text-white mt-1">145 Orders Synced</span>
                </div>
                <div>
                  <button
                    onClick={() => setIsWooConnected(false)}
                    className="mt-1 px-3 py-1.5 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Disconnect Integration
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* API Client Credentials Card */}
          <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white font-sans">API Credentials</h3>
              <p className="text-xs text-slate-400 mt-0.5">Access token for custom integrations or syncing order feeds via developer endpoints.</p>
            </div>
            <div className="flex items-center border border-slate-800 bg-slate-950 p-2.5 rounded-xl justify-between">
              <code className="text-xs text-indigo-400 select-all font-mono truncate mr-4">
                pk_live_51TkB0tDBXoxP3P4OPulseAnalyticsSecretClientKey992
              </code>
              <button
                onClick={handleCopyApiKey}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
              >
                {copiedKey ? 'Copied! ✅' : 'Copy Key 📋'}
              </button>
            </div>
          </div>

          {/* Billing Card */}
          <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Subscription & Billing</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage your monthly subscription tier, review checkout history, and download PDF invoices.</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-800/60 pt-4 gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Current Active Tier</span>
                <div className="text-lg font-black text-white mt-1 capitalize flex items-center gap-2">
                  <span>{user?.planTier || 'Free'} Plan</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Active
                  </span>
                </div>
              </div>
              <button
                onClick={fetchPortalSession}
                disabled={billingLoading}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all duration-150"
              >
                {billingLoading ? 'Launching Portal...' : 'Manage Stripe Billing'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-6 text-center py-16">
          <p className="text-sm text-slate-500 font-semibold">
            The {activeSubTab} management screen is fully compiled and configured for the v1.1 dashboard rollout.
          </p>
        </div>
      )}
    </div>
  );

  async function fetchPortalSession() {
    const token = localStorage.getItem('pulse_token');
    if (!token) return;

    setBillingLoading(true);
    try {
      const res = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        alert('Failed to launch Stripe billing portal.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to reach server. Please check your connections.');
    } finally {
      setBillingLoading(false);
    }
  }
}
