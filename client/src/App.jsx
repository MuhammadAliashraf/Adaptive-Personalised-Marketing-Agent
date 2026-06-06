import React, { useState, useEffect } from 'react';
import UserDirectory from './components/UserDirectory';
import AIGeneratorPanel from './components/AIGeneratorPanel';
import CustomerDashboard from './components/CustomerDashboard';
import EventLogs from './components/EventLogs';

const DEFAULT_USER = {
  id: 1,
  name: 'Ahmed Khan',
  email: 'ahmed.k@techmail.com',
  category: 'Electronics & Gadgets',
  loyaltyTier: 'Silver',
  status: 'Inactive',
  avatarFallback: 'AK',
  details: {
    recentViews: ['Mechanical Keyboard', 'Noise Cancelling Headphones'],
    avgOrderValue: '$120',
    lastActive: '3 days ago',
    events: [
      { action: 'Session Started', time: '3 days ago', device: 'Desktop (Chrome)' },
      { action: 'Viewed: Mechanical Keyboard', time: '3 days ago', duration: '4 min' },
      { action: 'Viewed: Noise Cancelling Headphones', time: '3 days ago', duration: '6 min' },
      { action: 'Added to Cart: Keyboard', time: '3 days ago', status: 'Abandoned' },
    ],
  },
};

export default function App() {
  const [theme, setTheme]                   = useState('light');
  const [activeTab, setActiveTab]           = useState('marketing');
  const [selectedUser, setSelectedUser]     = useState(DEFAULT_USER);
  const [campaignState, setCampaignState]   = useState('idle');
  const [approvedCampaign, setApprovedCampaign] = useState(null);
  const [version, setVersion]               = useState(1);
  const [feedback, setFeedback]             = useState('');
  const [performanceStats, setPerformanceStats] = useState({
    totalSent:   14,
    impressions: 120,
    conversions: 22,
    revenue:     2640,
  });
  const [logs, setLogs] = useState([
    'System initialized. Adaptive Personalised Marketing Agent is online.',
    'Ready for customer targeting — select a customer to begin.',
  ]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleDarkMode = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  const handleLog   = (text) => setLogs((prev) => [...prev, text]);
  const handleClear = () => setLogs([]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setCampaignState('idle');
    setApprovedCampaign(null);
    setVersion(1);
    setFeedback('');
  };

  const handleGenerate = (isRevision = false) => {
    setCampaignState('generating');
    handleLog(
      isRevision
        ? `AI Agent: Regrouping parameters based on feedback. Emphasising conversion multipliers…`
        : `AI Agent: Fetching profile data for "${selectedUser?.name}". Analysing interests…`
    );
    setTimeout(() => {
      const v = isRevision ? 2 : 1;
      setVersion(v);
      setCampaignState('generated');
      handleLog(`AI Agent: Campaign v${v} generated successfully.`);
    }, 1500);
  };

  const handleApprove = (campaignContent) => {
    const withMeta = { ...campaignContent, version };
    setApprovedCampaign(withMeta);
    setCampaignState('approved');
    setPerformanceStats((prev) => ({
      ...prev,
      totalSent:   prev.totalSent + 1,
      impressions: prev.impressions + 1,
    }));
    handleLog(`Marketing Team: Approved Campaign v${version}. Dispatching to ${selectedUser?.email}…`);
    setTimeout(() => handleLog(`Dispatch: Email & banner delivered to ${selectedUser?.email}.`), 800);
  };

  const handleReject = () => {
    setCampaignState('idle');
    setVersion(1);
    handleLog('Marketing Team: Campaign rejected.');
  };

  const handleConversion = () => {
    const aov = parseInt((selectedUser?.details?.avgOrderValue || '$100').replace(/\D/g, ''), 10) || 100;
    setPerformanceStats((prev) => ({
      ...prev,
      conversions: prev.conversions + 1,
      revenue:     prev.revenue + aov,
    }));
  };

  const liveCtr = ((performanceStats.conversions / performanceStats.impressions) * 100).toFixed(1);

  const tabs = [
    { id: 'marketing', label: 'Marketing Portal' },
    { id: 'customer',  label: 'Customer View' },
  ];

  const statItems = [
    { label: 'Sent', value: performanceStats.totalSent, color: 'text-stone-800 dark:text-stone-100' },
    { label: 'Impressions', value: performanceStats.impressions, color: 'text-stone-800 dark:text-stone-100' },
    { label: 'Conversions', value: performanceStats.conversions, color: 'text-emerald-600 dark:text-emerald-400', badge: 'Live' },
    { label: 'CTR', value: `${liveCtr}%`, color: 'text-teal-600 dark:text-teal-400' },
    { label: 'Revenue', value: `$${performanceStats.revenue.toLocaleString()}`, color: 'text-stone-800 dark:text-stone-100' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-200">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm shadow-teal-500/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 21l8.904-4.813L21 9l-5.187-5.187L9.813 15.904z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-black tracking-tight text-stone-900 dark:text-white uppercase leading-none">
                Adaptive Agent
              </p>
              <p className="text-[9px] font-semibold text-stone-400 tracking-widest uppercase mt-0.5">
                Marketing Hub
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <nav className="flex bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'customer') handleLog('System: Switched to Customer Portal View.');
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-150 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-stone-900 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                {tab.label}
                {tab.id === 'customer' && campaignState === 'approved' && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4.5 h-4.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Avatar placeholder */}
            <div className="h-7 w-7 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-[10px] font-bold text-teal-700 dark:text-teal-400">
              MT
            </div>
          </div>

        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">

        {activeTab === 'marketing' ? (
          <>
            {/* Page header */}
            <div>
              <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-0.5">
                Marketing Team Portal
              </p>
              <h1 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                Adaptive Campaign Simulator
              </h1>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
                Search users, analyse behaviour, generate AI-personalized campaigns, iterate on feedback, and track live performance metrics.
              </p>
            </div>

            {/* Stats bar */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-4 shadow-sm grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {statItems.map((s, i) => (
                <div key={s.label} className={`space-y-0.5 ${i > 0 ? 'border-l border-stone-100 dark:border-stone-800 pl-4' : ''}`}>
                  <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">{s.label}</p>
                  <div className="flex items-center gap-1.5">
                    <p className={`text-xl font-black tracking-tight ${s.color}`}>{s.value}</p>
                    {s.badge && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                        {s.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <UserDirectory selectedUser={selectedUser} onSelectUser={handleSelectUser} onLog={handleLog} />
              <AIGeneratorPanel
                selectedUser={selectedUser}
                campaignState={campaignState}
                onGenerate={handleGenerate}
                onApprove={handleApprove}
                onReject={handleReject}
                onFeedbackChange={setFeedback}
                feedback={feedback}
                version={version}
                onLog={handleLog}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-0.5">
                Customer Viewport
              </p>
              <h1 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                Customer Landing Page
              </h1>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                Preview the customer's personalized experience. Click the offer banner to trigger live conversion telemetry.
              </p>
            </div>
            <CustomerDashboard
              selectedUser={selectedUser}
              approvedCampaign={approvedCampaign}
              onLog={handleLog}
              onConversion={handleConversion}
            />
          </>
        )}

        {/* Terminal logs */}
        <EventLogs logs={logs} onClear={handleClear} />
      </main>
    </div>
  );
}
