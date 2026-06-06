import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import Button from './Button';
import { List, ListItem, ListItemAvatar, ListItemText, ListItemBadge } from './List';
import { api } from '../api';

export default function UserDirectory({ selectedUser, onSelectUser, onCampaignCreated }) {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('All');
  const [filterChannel, setFilterChannel] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [filterCountry, setFilterCountry] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Selection state
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Fetch users when parameters change (debounced search handled via useEffect)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers();
    }, 250);

    return () => clearTimeout(handler);
  }, [search, filterTier, filterChannel, filterCity, filterCountry, currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        limit: 5,
        search: search.trim() || undefined,
        tier: filterTier === 'All' ? undefined : filterTier,
        preferredChannel: filterChannel === 'All' ? undefined : filterChannel,
        city: filterCity === 'All' ? undefined : filterCity,
        country: filterCountry === 'All' ? undefined : filterCountry,
      };
      const response = await api.getUsers(params);
      if (response.success) {
        setUsers(response.data || []);
        if (response.meta) {
          setMeta(response.meta);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load customers from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (user) => {
    onSelectUser(user);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleTierFilter = (tier) => {
    setFilterTier(tier);
    setCurrentPage(1);
  };

  const handleChannelFilter = (channel) => {
    setFilterChannel(channel);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilterTier('All');
    setFilterChannel('All');
    setFilterCity('All');
    setFilterCountry('All');
    setCurrentPage(1);
  };

  const handleToggleSelect = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = users.map((u) => u.id);
      setSelectedUserIds((prev) => {
        const union = new Set([...prev, ...currentPageIds]);
        return Array.from(union);
      });
    } else {
      const currentPageIds = users.map((u) => u.id);
      setSelectedUserIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    }
  };

  const handleGenerateCampaign = async () => {
    if (selectedUserIds.length === 0) return;
    const name = campaignName.trim() || `Campaign for ${selectedUserIds.length} users (${new Date().toLocaleDateString()})`;
    setGenerating(true);
    setError('');
    try {
      const campaign = await api.createCampaign(name, selectedUserIds);
      onCampaignCreated(campaign);
      setSelectedUserIds([]);
      setCampaignName('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate campaign items.');
    } finally {
      setGenerating(false);
    }
  };

  const getAvatarFallback = (name = '') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const isAllSelectedOnPage =
    users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  const hasActiveFilters =
    search.trim() !== '' ||
    filterTier !== 'All' ||
    filterChannel !== 'All' ||
    filterCity !== 'All' ||
    filterCountry !== 'All';

  return (
    <div className="space-y-4">
      {/* Directory Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>Search, filter, and select multiple customers to generate campaigns.</CardDescription>
            </div>
            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full">
              {meta.total} users
            </span>
          </div>

          <div className="space-y-3 mt-1">
            {/* Search + Clear Filters */}
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-2 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 rounded-lg text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-xs font-semibold bg-rose-50/50 hover:bg-rose-100/70 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-450 rounded-lg border border-rose-200/50 dark:border-rose-900/50 transition-all duration-150 cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95 shadow-sm shadow-rose-500/5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear Filters</span>
                </button>
              )}
            </div>

            {/* Filter Rows */}
            <div className="flex flex-col gap-2">
              {/* Tier Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Tier:</span>
                {['All', 'new', 'regular', 'vip'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => handleTierFilter(tier)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all duration-150 border cursor-pointer ${filterTier === tier
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                      }`}
                  >
                    {tier.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Channel Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Channel:</span>
                {['All', 'email', 'push'].map((channel) => (
                  <button
                    key={channel}
                    onClick={() => handleChannelFilter(channel)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all duration-150 border cursor-pointer ${filterChannel === channel
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                      }`}
                  >
                    {channel.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Location Filters */}
              <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-stone-100 dark:border-stone-850">
                {/* City Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">City:</span>
                  <select
                    value={filterCity}
                    onChange={(e) => {
                      setFilterCity(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 bg-white dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-350 border border-stone-250 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    {['All', 'Karachi', 'London', 'Toronto', 'Berlin', 'Dubai', 'Austin'].map((city) => (
                      <option key={city} value={city} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Country:</span>
                  <select
                    value={filterCountry}
                    onChange={(e) => {
                      setFilterCountry(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 bg-white dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-350 border border-stone-250 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    {['All', 'Pakistan', 'UK', 'Canada', 'Germany', 'UAE', 'USA'].map((country) => (
                      <option key={country} value={country} className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200/50">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
              <p className="text-xs text-stone-400">Loading customers...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-3">
              {/* Select All Checkbox Header */}
              <div className="flex items-center px-4 py-2 bg-stone-50 dark:bg-stone-800/40 rounded-lg border border-stone-200/50 dark:border-stone-700/50 text-xs font-semibold text-stone-500 dark:text-stone-400">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelectedOnPage}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span>Select All on Page</span>
                </label>
              </div>

              <List divide>
                {users.map((user) => (
                  <ListItem
                    key={user.id}
                    isInteractive
                    onClick={() => handleSelect(user)}
                    className={
                      selectedUser?.id === user.id
                        ? 'bg-teal-50/40 dark:bg-teal-950/10 border-l-2 border-l-teal-500 -ml-px'
                        : ''
                    }
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(user.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500 cursor-pointer shrink-0 z-10"
                    />

                    {/* Content */}
                    <ListItemAvatar fallback={getAvatarFallback(user.name)} />
                    <ListItemText primary={user.name} secondary={user.email} />

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <ListItemBadge
                        label={user.loyaltyTier.toUpperCase()}
                        variant={
                          user.loyaltyTier === 'vip' ? 'warning'
                            : user.loyaltyTier === 'regular' ? 'success'
                              : 'secondary'
                        }
                      />
                      <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                        {user.preferredChannel}
                      </span>
                    </div>
                  </ListItem>
                ))}
              </List>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-stone-200 dark:border-stone-700 rounded-xl">
              <svg className="mx-auto h-8 w-8 text-stone-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">No customers match your filters</p>
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 mt-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                isDisabled={currentPage === 1}
              >
                ← Prev
              </Button>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {currentPage} / {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, meta.totalPages))}
                isDisabled={currentPage === meta.totalPages}
              >
                Next →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Generator Action Card */}
      {selectedUserIds.length > 0 && (
        <Card className="border-t-4 border-t-teal-500">
          <CardContent className="pt-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-100">
                Create Campaign for {selectedUserIds.length} Selected Users
              </h3>
              <button
                onClick={() => setSelectedUserIds([])}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear Selections
              </button>
            </div>
            <div className="space-y-2.5">
              <input
                type="text"
                placeholder="Enter campaign name (optional)..."
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Button
                variant="primary"
                onClick={handleGenerateCampaign}
                isLoading={generating}
                className="w-full justify-center"
              >
                Generate AI Ads & Content
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Behavior Insights Panel */}
      {selectedUser && (
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-200 dark:border-teal-800">
                {getAvatarFallback(selectedUser.name)}
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm truncate">{selectedUser.name}</CardTitle>
                <CardDescription className="text-xs truncate">{selectedUser.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Avg Order', value: `$${parseFloat(selectedUser.avgOrderValue || 0).toFixed(0)}`, color: 'text-teal-700 dark:text-teal-300' },
                { label: 'Total Orders', value: selectedUser.totalOrders || 0, color: 'text-stone-700 dark:text-stone-200' },
                { label: 'Carts Aband.', value: selectedUser.abandonedCarts || 0, color: 'text-rose-500 dark:text-rose-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-stone-50/80 dark:bg-stone-850 rounded-lg p-2 text-center border border-stone-100 dark:border-stone-800">
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-xs font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Technical details list */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-b border-stone-100 dark:border-stone-850 py-3">
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Total Spend:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200">${parseFloat(selectedUser.totalSpend || 0).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Preferred Channel:</span>
                <p className="font-semibold text-stone-800 dark:text-stone-200 uppercase">{selectedUser.preferredChannel}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Email Open Rate:</span>
                <p className="font-semibold text-stone-850 dark:text-stone-100">{((selectedUser.emailOpenRate || 0) * 100).toFixed(0)}%</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">CTR:</span>
                <p className="font-semibold text-stone-850 dark:text-stone-100">{((selectedUser.clickThroughRate || 0) * 100).toFixed(0)}%</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Preferred Device:</span>
                <p className="font-semibold text-stone-850 dark:text-stone-100 capitalize">{selectedUser.preferredDevice || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Last Active:</span>
                <p className="font-semibold text-stone-850 dark:text-stone-100">{formatDate(selectedUser.lastActiveAt)}</p>
              </div>
            </div>

            {/* Browsing history */}
            <div className="space-y-2">
              {/* Recently viewed products */}
              {selectedUser.recentlyViewedProducts && selectedUser.recentlyViewedProducts.length > 0 && (
                <div>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Recently Viewed</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedUser.recentlyViewedProducts.map((p, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Segment Tags */}
              {selectedUser.segmentTags && selectedUser.segmentTags.length > 0 && (
                <div>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">AI Segment Tags</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedUser.segmentTags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-150 dark:border-teal-900 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
