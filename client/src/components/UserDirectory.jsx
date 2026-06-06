import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import Button from './Button';
import { List, ListItem, ListItemAvatar, ListItemText, ListItemBadge } from './List';

const ITEMS_PER_PAGE = 3;

const INITIAL_CUSTOMERS = [
  {
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
  },
  {
    id: 2,
    name: 'Sarah Connor',
    email: 'sconnor@cyberdyne.org',
    category: 'Fitness & Sports',
    loyaltyTier: 'Gold',
    status: 'Active',
    avatarFallback: 'SC',
    details: {
      recentViews: ['Running Shoes', 'Smart Sports Watch'],
      avgOrderValue: '$240',
      lastActive: '5 hours ago',
      events: [
        { action: 'Session Started', time: '5 hours ago', device: 'Mobile (Safari)' },
        { action: 'Searched: "running shoe size 8"', time: '5 hours ago' },
        { action: 'Viewed: Pegasus Running Shoes', time: '5 hours ago', duration: '8 min' },
        { action: 'Purchased: Pegasus Shoes ($120)', time: '5 hours ago', status: 'Converted' },
      ],
    },
  },
  {
    id: 3,
    name: 'Liam Neeson',
    email: 'taken@findyou.com',
    category: 'Travel & Luggage',
    loyaltyTier: 'Platinum',
    status: 'Active',
    avatarFallback: 'LN',
    details: {
      recentViews: ['Hard-shell Carry-on', 'Neck Pillow'],
      avgOrderValue: '$410',
      lastActive: '1 day ago',
      events: [
        { action: 'Session Started', time: '1 day ago', device: 'Desktop (Safari)' },
        { action: 'Viewed: Premium Hard-shell Carry-on', time: '1 day ago', duration: '12 min' },
        { action: 'Added to Cart: Hard-shell Carry-on', time: '1 day ago', status: 'Pending' },
      ],
    },
  },
  {
    id: 4,
    name: 'Maria Garcia',
    email: 'maria.g@diseno.es',
    category: 'Home Decor & Furniture',
    loyaltyTier: 'Bronze',
    status: 'Inactive',
    avatarFallback: 'MG',
    details: {
      recentViews: ['Ceramic Vase', 'Minimalist Floor Lamp'],
      avgOrderValue: '$85',
      lastActive: '1 week ago',
      events: [
        { action: 'Session Started', time: '1 week ago', device: 'Mobile (Chrome)' },
        { action: 'Viewed: Minimalist Floor Lamp', time: '1 week ago', duration: '2 min' },
      ],
    },
  },
  {
    id: 5,
    name: 'Ken Tanaka',
    email: 'ken.t@sushi-dev.jp',
    category: 'Kitchen & Gourmet',
    loyaltyTier: 'Gold',
    status: 'Active',
    avatarFallback: 'KT',
    details: {
      recentViews: ['Chef Knife', 'Cast Iron Skillet'],
      avgOrderValue: '$195',
      lastActive: '2 days ago',
      events: [
        { action: 'Session Started', time: '2 days ago', device: 'Desktop (Firefox)' },
        { action: 'Viewed: Japanese Chef Knife 8"', time: '2 days ago', duration: '9 min' },
        { action: 'Added to Cart: Chef Knife', time: '2 days ago', status: 'Abandoned' },
      ],
    },
  },
];

const statusEventColor = {
  Abandoned: 'text-rose-500',
  Converted: 'text-emerald-600',
  Pending:   'text-amber-600',
};

export default function UserDirectory({ selectedUser, onSelectUser, onLog }) {
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = INITIAL_CUSTOMERS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchesTier = filterTier === 'All' || c.loyaltyTier === filterTier;
    return matchesSearch && matchesTier;
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSelect = (user) => {
    onSelectUser(user);
    onLog(`Marketing user inspected customer behavior: "${user.name}"`);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleTierFilter = (tier) => {
    setFilterTier(tier);
    setCurrentPage(1);
    if (tier !== 'All') onLog(`Marketing user filtered directory by tier: "${tier}"`);
  };

  const loyaltyTiers = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];

  return (
    <div className="space-y-4">
      {/* Directory Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>Search, filter and select customers for targeting.</CardDescription>
            </div>
            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full">
              {filteredCustomers.length} users
            </span>
          </div>

          <div className="space-y-3 mt-1">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or category..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 rounded-lg text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {loyaltyTiers.map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleTierFilter(tier)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 border ${
                    filterTier === tier
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {paginatedCustomers.length > 0 ? (
            <List divide>
              {paginatedCustomers.map((user) => (
                <ListItem
                  key={user.id}
                  isInteractive
                  onClick={() => handleSelect(user)}
                  className={
                    selectedUser?.id === user.id
                      ? 'bg-teal-50/60 dark:bg-teal-950/20 border-l-2 border-l-teal-500 -ml-px'
                      : ''
                  }
                >
                  <ListItemAvatar fallback={user.avatarFallback} />
                  <ListItemText primary={user.name} secondary={user.category} />
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <ListItemBadge
                      label={user.loyaltyTier}
                      variant={
                        user.loyaltyTier === 'Platinum' ? 'warning'
                          : user.loyaltyTier === 'Gold' ? 'success'
                          : 'secondary'
                      }
                    />
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      user.status === 'Active'
                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'text-stone-400 bg-stone-100 dark:bg-stone-800 dark:text-stone-500'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </ListItem>
              ))}
            </List>
          ) : (
            <div className="text-center py-10 border border-dashed border-stone-200 dark:border-stone-700 rounded-xl">
              <svg className="mx-auto h-8 w-8 text-stone-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">No customers match your filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 mt-4 pt-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} isDisabled={currentPage === 1}>
                ← Prev
              </Button>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {currentPage} / {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} isDisabled={currentPage === totalPages}>
                Next →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Behavior Insights Panel */}
      {selectedUser && (
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-200 dark:border-teal-800">
                {selectedUser.avatarFallback}
              </div>
              <div>
                <CardTitle className="text-sm">{selectedUser.name} — Behavior Insights</CardTitle>
                <CardDescription className="text-xs">{selectedUser.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Avg Order', value: selectedUser.details.avgOrderValue, color: 'text-teal-700 dark:text-teal-300' },
                { label: 'Last Active', value: selectedUser.details.lastActive, color: 'text-stone-700 dark:text-stone-200' },
                { label: 'Status', value: selectedUser.status, color: selectedUser.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-2.5 text-center border border-stone-100 dark:border-stone-700/50">
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-xs font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Event timeline */}
            <div>
              <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">Session Events</p>
              <div className="space-y-1.5 max-h-[130px] overflow-y-auto pr-0.5">
                {selectedUser.details.events?.map((evt, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2 text-xs px-3 py-2 bg-white dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="font-semibold text-stone-800 dark:text-stone-200 truncate">{evt.action}</p>
                      {evt.device && <p className="text-[10px] text-stone-400">📱 {evt.device}</p>}
                      {evt.duration && <p className="text-[10px] text-stone-400">⏱ {evt.duration}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-stone-400">{evt.time}</span>
                      {evt.status && (
                        <span className={`text-[9px] font-bold ${statusEventColor[evt.status] || 'text-stone-500'}`}>
                          {evt.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
