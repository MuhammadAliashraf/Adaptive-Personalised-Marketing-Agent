import React, { useState, useEffect } from 'react';
import UserDirectory from './components/UserDirectory';
import CampaignReviewPanel from './components/CampaignReviewPanel';
import Button from './components/Button';
import { api } from './api';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [marketer, setMarketer] = useState({ name: 'Demo Marketer', email: 'admin@lumen.co' });

  // Main active states
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeCampaign, setActiveCampaign] = useState(null);

  // Initialize theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  // Try silent login on mount
  useEffect(() => {
    const silentAuth = async () => {
      const stored = api.getCurrentMarketer();
      if (stored) {
        setMarketer(stored);
      } else {
        try {
          const profile = await api.login('admin@lumen.co', 'password123');
          setMarketer(profile);
        } catch (err) {
          console.warn('Silent auto-login failed. Operating in offline/fallback mode.', err);
        }
      }
    };
    silentAuth();
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

  const handleCampaignCreated = (campaign) => {
    setActiveCampaign(campaign);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-stone-200 dark:border-stone-850 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-teal-650 flex items-center justify-center shadow-sm shadow-teal-500/25">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 21l8.904-4.813L21 9l-5.187-5.187L9.813 15.904z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-black tracking-tight text-stone-900 dark:text-white uppercase leading-none">
                Adaptive Agent
              </p>
              <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mt-0.5">
                Marketing Hub
              </p>
            </div>
          </div>

          {/* User Info / Dark Mode Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
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

            <div className="flex items-center gap-2 border-l border-stone-200 dark:border-stone-850 pl-3">
              <div className="h-7 w-7 rounded-full bg-teal-100 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-[10px] font-bold text-teal-700 dark:text-teal-400">
                {marketer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-stone-850 dark:text-stone-200 leading-none">
                  {marketer.name}
                </p>
                <p className="text-[10px] font-semibold text-stone-400 mt-0.5 leading-none">
                  Marketer
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Portal Title Bar */}
        <div>
          <span className="text-[10px] font-bold text-teal-650 dark:text-teal-400 uppercase tracking-widest">
            Marketing Management System
          </span>
          <h1 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-0.5">
            Adaptive Personalised Campaigns
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-2xl mt-1 leading-relaxed">
            Manage your marketing targets dynamically. Select multiple users from the directory to generate real-time AI-optimized email copy, notifications, and banners. Approve individual items for immediate email dispatch or reject to trigger instant AI copy regeneration based on custom feedback.
          </p>
        </div>

        {/* Dual-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <UserDirectory
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            onCampaignCreated={handleCampaignCreated}
          />
          <CampaignReviewPanel
            campaign={activeCampaign}
            onCampaignUpdated={setActiveCampaign}
          />
        </div>
      </main>
    </div>
  );
}
