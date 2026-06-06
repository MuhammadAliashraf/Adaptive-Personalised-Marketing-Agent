import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import Button from './Button';

export default function AIGeneratorPanel({
  selectedUser,
  campaignState,
  onGenerate,
  onApprove,
  onReject,
  onFeedbackChange,
  feedback,
  version,
  onLog,
}) {
  const [inputText, setInputText] = useState('');

  const handleFeedbackSubmit = (presetText = '') => {
    const finalFeedback = presetText || inputText;
    if (!finalFeedback.trim()) return;
    onFeedbackChange(finalFeedback);
    onLog(`Marketing user rejected campaign. Feedback: "${finalFeedback}"`);
    setInputText('');
    onGenerate(true);
  };

  const getCampaignContent = () => {
    if (version === 1) {
      return {
        subject:     `Upgrade your workspace, ${selectedUser?.name.split(' ')[0]}!`,
        body:        `Hi ${selectedUser?.name.split(' ')[0]},\n\nWe noticed you were checking out some premium items in our ${selectedUser?.category} collection. Elevate your experience today with our expert-approved products, engineered for performance and comfort.\n\nEnter code TECHDESK at checkout.`,
        bannerTitle: 'ELEVATE YOUR SETUP',
        bannerSubtitle: `Handpicked premium gear for ${selectedUser?.name.split(' ')[0]}`,
        discount:    '15% OFF',
        accentColor: 'from-teal-600 to-emerald-500',
      };
    }
    return {
      subject:     `Exclusive for ${selectedUser?.name.split(' ')[0]}: 50% OFF today only!`,
      body:        `Hi ${selectedUser?.name.split(' ')[0]},\n\nWe heard your feedback — so we went big! Here's an exclusive 50% discount on the ${selectedUser?.details?.recentViews?.[0] || 'top gear'} you recently viewed.\n\nOffer valid for 24 hours. Use code MEGA50 at checkout!`,
      bannerTitle: 'MEGA 50% DISCOUNT',
      bannerSubtitle: 'Unbeatable savings on your favourite items',
      discount:    '50% OFF',
      accentColor: 'from-amber-500 to-rose-500',
    };
  };

  const content = getCampaignContent();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 21l8.904-4.813L21 9l-5.187-5.187L9.813 15.904z" />
            </svg>
          </div>
          <div>
            <CardTitle>AI Campaign Generator</CardTitle>
            <CardDescription>
              {selectedUser
                ? `Targeting: ${selectedUser.name} · ${selectedUser.category}`
                : 'Select a customer to begin.'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-center pt-4">
        {/* No user selected */}
        {!selectedUser ? (
          <div className="text-center py-16 space-y-3">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <svg className="h-7 w-7 text-stone-400 dark:text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">Select a customer first</p>
            <p className="text-xs text-stone-400 dark:text-stone-500">Pick someone from the directory on the left.</p>
          </div>
        ) : campaignState === 'idle' ? (
          <div className="text-center py-12 space-y-5">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 21l8.904-4.813L21 9l-5.187-5.187L9.813 15.904z" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-stone-800 dark:text-stone-100">Ready to generate</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[260px] mx-auto leading-relaxed">
                AI will analyse <span className="font-semibold text-stone-700 dark:text-stone-300">{selectedUser.name}</span>'s browsing history ({selectedUser.details.recentViews.join(', ')}) and craft a personalised campaign.
              </p>
            </div>
            <Button variant="primary" onClick={() => onGenerate(false)} className="mx-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Campaign
            </Button>
          </div>
        ) : campaignState === 'generating' ? (
          <div className="text-center py-16 space-y-5">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-teal-100 dark:border-teal-900/30" />
              <div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-stone-800 dark:text-stone-100">AI is crafting your campaign…</h4>
              <p className="text-xs text-stone-400 dark:text-stone-500">
                {version === 1 ? 'Analysing interests & generating templates…' : 'Processing feedback & recalibrating weights…'}
              </p>
            </div>
          </div>
        ) : campaignState === 'generated' ? (
          <div className="space-y-5">
            {/* Header row */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
                  v{version}
                </span>
                {version === 2 && (
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Discount Focus
                  </span>
                )}
              </div>
              <span className="text-xs text-stone-400">Target: {selectedUser.name.split(' ')[0]}</span>
            </div>

            {/* Email preview */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Email Preview</p>
              <div className="border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-900/40 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Subject</span>
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-100">{content.subject}</span>
                </div>
                <div className="px-4 py-3 text-xs text-stone-600 dark:text-stone-400 whitespace-pre-line leading-relaxed">
                  {content.body}
                </div>
              </div>
            </div>

            {/* Banner preview */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Visual Banner</p>
              <div className={`relative bg-gradient-to-r ${content.accentColor} p-5 rounded-xl text-white overflow-hidden shadow-md flex items-center justify-between gap-4`}>
                <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <div className="z-10 space-y-1">
                  <span className="text-[10px] bg-white/20 border border-white/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest inline-block">
                    {content.discount}
                  </span>
                  <h3 className="font-black text-base tracking-tight leading-snug mt-1">{content.bannerTitle}</h3>
                  <p className="text-[11px] text-white/80">{content.bannerSubtitle}</p>
                </div>
                <div className="z-10 shrink-0 bg-white/90 text-stone-900 px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
                  SHOP NOW
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-1 border-t border-stone-100 dark:border-stone-800">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="danger" onClick={onReject} className="w-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </Button>
                <Button variant="success" onClick={() => onApprove(content)} className="w-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve & Send
                </Button>
              </div>

              {/* Feedback box */}
              <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-2.5">
                <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Reject with feedback</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Need more discount focus', 'Make text shorter', 'Add urgency'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleFeedbackSubmit(preset)}
                      className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-[11px] font-semibold text-stone-600 dark:text-stone-300 rounded-full border border-stone-200 dark:border-stone-700 transition-colors"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Custom instructions for AI…"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFeedbackSubmit()}
                    className="flex-grow px-3 py-1.5 text-xs bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 rounded-lg placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleFeedbackSubmit()}>
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Approved */
          <div className="text-center py-14 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-stone-900 dark:text-stone-50 text-base">Campaign Sent!</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                Personalized email & banner dispatched to {selectedUser.name}. Switch to the <strong>Customer Portal</strong> tab to see their experience.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onGenerate(false)} className="mx-auto">
              Redraft Campaign
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
