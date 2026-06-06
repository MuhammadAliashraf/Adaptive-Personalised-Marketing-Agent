import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import Button from './Button';
import { api } from '../api';

export default function CampaignReviewPanel({ campaign, onCampaignUpdated }) {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePreviewTab, setActivePreviewTab] = useState('email'); // email, notification, modal
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // item.id -> boolean
  const [batchLoading, setBatchLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch campaign items when campaign changes
  useEffect(() => {
    if (campaign && campaign.id) {
      fetchItems();
    } else {
      setItems([]);
      setActiveIndex(0);
    }
  }, [campaign]);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getCampaign(campaign.id);
      // The getCampaign endpoint returns the campaign with its items
      if (response && response.items) {
        setItems(response.items);
      } else {
        // Fallback to fetch via campaign-items endpoint
        const itemsRes = await api.listCampaignItems({ campaignId: campaign.id });
        setItems(itemsRes.data || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load campaign items.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    setActionLoading((prev) => ({ ...prev, [itemId]: true }));
    setError('');
    try {
      const updatedItem = await api.approveCampaignItem(itemId);
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, ...updatedItem } : item))
      );
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to approve item.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRejectAndRegenerate = async (itemId, customFeedback = '') => {
    const feedback = (customFeedback || feedbackText).trim();
    if (!feedback) {
      setError('Please provide feedback for regeneration.');
      return;
    }
    setActionLoading((prev) => ({ ...prev, [itemId]: true }));
    setError('');
    try {
      const regeneratedItem = await api.rejectCampaignItem(itemId, feedback);
      // Replace the old item in the list with the newly generated pending item
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? regeneratedItem : item))
      );
      setFeedbackText('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to regenerate item.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleApproveAll = async () => {
    const pendingItems = items.filter((item) => item.status === 'pending');
    if (pendingItems.length === 0) return;

    setBatchLoading(true);
    setError('');
    try {
      const promises = pendingItems.map((item) => api.approveCampaignItem(item.id));
      const updatedItems = await Promise.all(promises);
      const updatedMap = new Map(updatedItems.map((item) => [item.id, item]));

      setItems((prev) =>
        prev.map((item) => {
          const updated = updatedMap.get(item.id);
          return updated ? { ...item, ...updated } : item;
        })
      );
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to approve all items.');
    } finally {
      setBatchLoading(false);
    }
  };

  if (!campaign) {
    return (
      <Card className="h-full flex flex-col items-center justify-center py-20 text-center">
        <CardContent className="space-y-4">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-700/60">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-850 dark:text-stone-100">No Active Campaign Selected</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[280px] leading-relaxed mx-auto">
              Select users on the left and click <strong>Generate AI Ads</strong> to spawn a personalized review queue.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeItem = items[activeIndex];

  return (
    <Card className="h-full flex flex-col">
      {/* Panel Header */}
      <CardHeader className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
              Active Review Queue
            </span>
            <CardTitle className="text-base truncate mt-0.5">{campaign.name}</CardTitle>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {items.filter((item) => item.status === 'pending').length > 0 && (
              <Button
                variant="success"
                size="sm"
                onClick={handleApproveAll}
                isLoading={batchLoading}
              >
                Approve All ({items.filter((item) => item.status === 'pending').length})
              </Button>
            )}
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-200/50">
              {items.length} ads generated
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col pt-4 space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200/50">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
            <p className="text-xs text-stone-400">Fetching generated ads...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-stone-400 dark:text-stone-500 text-xs">
            No items found for this campaign.
          </div>
        ) : (
          <div className="flex-grow flex flex-col space-y-4">
            {/* User Selection Tabs inside campaign */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-stone-100 dark:border-stone-800 scrollbar-thin">
              {items.map((item, idx) => {
                const targetName = item.user?.name || 'Customer';
                const isApproved = item.status === 'approved' || item.status === 'sent';
                const isRejected = item.status === 'rejected';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveIndex(idx);
                      setError('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-150 flex items-center gap-1.5 border ${
                      activeIndex === idx
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                    }`}
                  >
                    <span>{targetName}</span>
                    {isApproved && (
                      <span className="text-[10px] text-emerald-500 font-bold">✓</span>
                    )}
                    {isRejected && (
                      <span className="text-[10px] text-rose-500 font-bold">✗</span>
                    )}
                    {item.regeneratedFromId && (
                      <span className="text-[9px] opacity-75 font-bold uppercase px-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-500">
                        Rev
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Ad Details */}
            {activeItem && (
              <div className="flex-grow flex flex-col space-y-4">
                {/* Rationale and Strategy */}
                <div className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200/50 dark:border-stone-800/80 text-xs leading-relaxed space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                      AI Strategy Matching Rationale
                    </span>
                    {activeItem.matchedStrategy && (
                      <span className="font-bold text-teal-600 dark:text-teal-400">
                        {activeItem.matchedStrategy.name}
                      </span>
                    )}
                  </div>
                  <p className="text-stone-700 dark:text-stone-350 italic">
                    "{activeItem.rationale || 'Tailored to customer interaction history and purchasing tier.'}"
                  </p>
                </div>

                {/* Preview Tabs */}
                <div className="flex bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg w-max shrink-0">
                  {['email', 'notification', 'modal'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActivePreviewTab(tab)}
                      className={`px-3 py-1 text-xs font-bold rounded-md capitalize cursor-pointer transition-all duration-150 ${
                        activePreviewTab === tab
                          ? 'bg-white dark:bg-stone-900 text-teal-600 dark:text-teal-400 shadow-sm'
                          : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Preview viewport */}
                <div className="flex-grow flex flex-col border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-950 p-4">
                  {activePreviewTab === 'email' && activeItem.content?.email && (
                    <div className="space-y-3 flex-grow flex flex-col">
                      <div className="pb-3 border-b border-stone-100 dark:border-stone-850 space-y-1.5 text-xs">
                        <div className="flex">
                          <span className="w-16 font-bold text-stone-400 uppercase">Subject:</span>
                          <span className="font-semibold text-stone-900 dark:text-stone-100">
                            {activeItem.content.email.subject}
                          </span>
                        </div>
                        {activeItem.content.email.preheader && (
                          <div className="flex">
                            <span className="w-16 font-bold text-stone-400 uppercase">Preheader:</span>
                            <span className="text-stone-500 dark:text-stone-400">
                              {activeItem.content.email.preheader}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow text-xs text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap py-2 font-mono">
                        {activeItem.content.email.body}
                      </div>
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-850 flex justify-center">
                        <a
                          href={activeItem.content.email.ctaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 select-none pointer-events-none"
                        >
                          {activeItem.content.email.ctaText || 'Claim Offer'}
                        </a>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === 'notification' && activeItem.content?.notification && (
                    <div className="py-8 flex items-center justify-center flex-grow bg-stone-50 dark:bg-stone-900/30 rounded-lg border border-dashed border-stone-200 dark:border-stone-800">
                      {/* Mobile Notification Bubble */}
                      <div className="w-full max-w-xs bg-white/80 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-3.5 shadow-md flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {activeItem.content.notification.icon ? '📱' : '🔔'}
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="text-xs font-bold text-stone-900 dark:text-stone-50 truncate">
                            {activeItem.content.notification.title}
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                            {activeItem.content.notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePreviewTab === 'modal' && activeItem.content?.modal && (
                    <div className="py-4 flex items-center justify-center flex-grow bg-stone-50 dark:bg-stone-900/30 rounded-lg border border-dashed border-stone-200 dark:border-stone-800">
                      {/* Modal Banner design */}
                      <div className="w-full max-w-sm bg-gradient-to-br from-stone-900 to-teal-950 text-white border border-teal-800/40 rounded-xl p-5 shadow-lg space-y-4 overflow-hidden relative">
                        <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-teal-500/10 blur-xl" />
                        <div className="space-y-1.5 z-10 relative">
                          <span className="text-[9px] bg-teal-550 border border-teal-400/40 px-2 py-0.5 rounded-full font-black uppercase tracking-wider inline-block">
                            EXCLUSIVES
                          </span>
                          <h3 className="font-black text-sm tracking-tight text-white leading-snug">
                            {activeItem.content.modal.headline}
                          </h3>
                          <p className="text-[11px] text-stone-300 leading-normal">
                            {activeItem.content.modal.body}
                          </p>
                        </div>
                        <div className="flex gap-2 pt-1 z-10 relative">
                          <button className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-[10px] font-bold shadow-sm select-none pointer-events-none">
                            {activeItem.content.modal.ctaText}
                          </button>
                          <button className="px-3 py-1.5 bg-transparent border border-white/20 text-white/80 rounded-lg text-[10px] font-bold select-none pointer-events-none">
                            {activeItem.content.modal.dismissText}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {(!activeItem.content || !activeItem.content[activePreviewTab]) && (
                    <div className="text-center py-12 text-stone-400 text-xs flex-grow flex items-center justify-center">
                      No content generated for this channel template.
                    </div>
                  )}
                </div>

                {/* Actions Section */}
                <div className="border-t border-stone-250 dark:border-stone-800 pt-4 space-y-3 shrink-0">
                  {activeItem.status === 'approved' || activeItem.status === 'sent' ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200/50 flex items-center justify-center gap-2 text-xs font-bold">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Ad Approved & Dispatched to Customer
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="success"
                          onClick={() => handleApprove(activeItem.id)}
                          isLoading={actionLoading[activeItem.id]}
                          className="justify-center"
                        >
                          Approve & Send Ad
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleRejectAndRegenerate(activeItem.id, 'Soften the tone and focus on discount')}
                          isLoading={actionLoading[activeItem.id]}
                          className="justify-center text-xs"
                        >
                          Reject & Quick Regenerate
                        </Button>
                      </div>

                      {/* Feedback Panel */}
                      <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2.5">
                        <p className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                          Reject with Custom Feedback (AI Refinement)
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Need more discount focus',
                            'Shorten copy to be punchier',
                            'Add premium exclusivity vibe',
                            'Add a stronger sense of urgency'
                          ].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => handleRejectAndRegenerate(activeItem.id, preset)}
                              className="px-2 py-0.5 bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-750 text-[10px] font-semibold text-stone-600 dark:text-stone-300 rounded-full border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                            >
                              "{preset}"
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Provide details on how the AI should adapt the copy..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleRejectAndRegenerate(activeItem.id)
                            }
                            className="flex-grow px-3 py-1.5 text-xs bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-700 text-stone-850 dark:text-stone-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectAndRegenerate(activeItem.id)}
                            isLoading={actionLoading[activeItem.id]}
                          >
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
