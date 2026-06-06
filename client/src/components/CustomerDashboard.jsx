import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import Button from './Button';

export default function CustomerDashboard({ selectedUser, approvedCampaign, onLog, onConversion }) {
  const [clicked, setClicked] = useState(false);

  const handleCtaClick = () => {
    setClicked(true);
    onConversion();
    onLog(
      `[Customer Action] ${selectedUser?.name} clicked "CLAIM OFFER NOW"! Telemetry: { userId: ${selectedUser?.id}, conversion: true, version: ${approvedCampaign?.version || 1} }. AI weights updated.`
    );
  };

  const firstName = selectedUser?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Simulation notice */}
      <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 px-4 py-3 rounded-xl">
        <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
          Simulation Mode — you are viewing as{' '}
          <span className="font-bold underline">{selectedUser?.name || 'Guest'}</span>
        </p>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Profile card */}
          <Card>
            <CardContent className="py-5 flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 flex items-center justify-center text-lg font-bold border-2 border-teal-200 dark:border-teal-800">
                {selectedUser?.avatarFallback || 'G'}
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-50">{selectedUser?.name || 'Guest'}</h3>
                <p className="text-xs text-stone-400 mt-0.5">{selectedUser?.email || 'guest@example.com'}</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                {selectedUser?.loyaltyTier || 'No tier'} Member
              </span>
            </CardContent>
          </Card>

          {/* Inbox */}
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Inbox</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {approvedCampaign ? (
                <div className="px-4 py-3 border-l-4 border-l-teal-500 bg-teal-50/30 dark:bg-teal-950/10">
                  <div className="flex justify-between items-start gap-2 mb-0.5">
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-100 leading-snug line-clamp-2 flex-1">
                      {approvedCampaign.subject}
                    </span>
                    <span className="text-[10px] text-stone-400 shrink-0">now</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-snug">
                    {approvedCampaign.body}
                  </p>
                </div>
              ) : (
                <div className="px-4 py-5 text-center text-xs text-stone-400 dark:text-stone-500">
                  No messages yet
                </div>
              )}
              <div className="border-t border-stone-100 dark:border-stone-800 px-4 py-3 opacity-40">
                <div className="flex justify-between mb-0.5">
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">Welcome aboard!</span>
                  <span className="text-[10px] text-stone-400">2d ago</span>
                </div>
                <p className="text-[11px] text-stone-400 truncate">Thank you for signing up. Explore your settings.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main area */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="py-6">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                  Hey, {firstName}! 👋
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Your personalised shopping dashboard is ready.
                </p>
              </div>

              {approvedCampaign ? (
                <div className="mt-6 space-y-5">
                  <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-teal-600 px-2 py-0.5 rounded">
                        Exclusive Offer
                      </span>
                    </div>

                    {/* Banner */}
                    <div className={`relative bg-gradient-to-r ${approvedCampaign.accentColor} rounded-xl p-7 text-white overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-between gap-5`}>
                      <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
                      <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                      <div className="z-10 space-y-2">
                        <span className="inline-block text-[10px] bg-white/25 border border-white/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">
                          {approvedCampaign.discount}
                        </span>
                        <h3 className="font-black text-xl tracking-tight leading-snug">{approvedCampaign.bannerTitle}</h3>
                        <p className="text-[12px] text-white/85 leading-relaxed">{approvedCampaign.bannerSubtitle}</p>
                      </div>
                      <div className="z-10 shrink-0">
                        {clicked ? (
                          <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Redeemed!
                          </div>
                        ) : (
                          <button
                            onClick={handleCtaClick}
                            className="bg-white text-stone-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform duration-150"
                          >
                            CLAIM OFFER NOW
                          </button>
                        )}
                      </div>
                    </div>

                    {clicked && (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Discount applied to your wallet. Enjoy your purchase!
                      </div>
                    )}
                  </div>

                  {/* Email details */}
                  <div className="px-4 py-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 space-y-2">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Offer Details</p>
                    <p className="text-sm text-stone-600 dark:text-stone-300 whitespace-pre-line leading-relaxed">
                      {approvedCampaign.body}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-10 flex flex-col items-center justify-center py-14 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl text-center">
                  <div className="h-14 w-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-3">
                    <svg className="h-7 w-7 text-stone-400 dark:text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-stone-800 dark:text-stone-200">No active promotions</h3>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 max-w-[220px] leading-relaxed">
                    Approve a campaign from the Marketing Portal to see it here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
