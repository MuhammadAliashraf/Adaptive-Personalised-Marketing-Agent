import React, { useState, useEffect } from 'react';
import Button from './components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/Card';
import Dropdown from './components/Dropdown';
import { List, ListItem, ListItemAvatar, ListItemText, ListItemBadge, ListItemAction } from './components/List';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [dropdownSelection, setDropdownSelection] = useState('Filter: All Users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [btnCount, setBtnCount] = useState(0);

  // Initialize theme
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

  const handleDropdownSelect = (item) => {
    setDropdownSelection(`Filter: ${item.label}`);
    setIsLoadingDemo(true);
    setTimeout(() => {
      setIsLoadingDemo(false);
    }, 800);
  };

  const users = [
    {
      id: 1,
      name: 'Olivia Vance',
      email: 'olivia@creative-marketing.io',
      role: 'Admin',
      roleVariant: 'primary',
      status: 'Active',
      statusVariant: 'success',
      avatarFallback: 'OV',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 2,
      name: 'Marcus Chen',
      email: 'marcus.c@agency.com',
      role: 'Editor',
      roleVariant: 'secondary',
      status: 'Active',
      statusVariant: 'success',
      avatarFallback: 'MC',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 3,
      name: 'Sophia Alvarez',
      email: 'sophia.a@brandflow.dev',
      role: 'Viewer',
      roleVariant: 'secondary',
      status: 'Pending',
      statusVariant: 'warning',
      avatarFallback: 'SA',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  const dropdownItems = [
    {
      id: 'all',
      label: 'All Users',
      description: 'Show everyone in the workspace',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'active',
      label: 'Active Only',
      description: 'Filter by active status',
      icon: (
        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'pending',
      label: 'Pending Only',
      description: 'Filter by status pending approval',
      icon: (
        <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const filteredUsers = dropdownSelection.includes('Active Only')
    ? users.filter((u) => u.status === 'Active')
    : dropdownSelection.includes('Pending Only')
    ? users.filter((u) => u.status === 'Pending')
    : users;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-violet-500/20">
                A
              </div>
              <span className="font-semibold text-lg text-zinc-900 dark:text-white">
                Adaptive Agent UI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Component Library Showcase
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2">
            A beautiful set of Tailwind CSS v4 components designed for modern dashboards and marketing interfaces.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Controls & Buttons */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Button Section */}
            <Card hoverEffect={false}>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Supports primary, secondary, danger, success, outline, ghost styles and loading states.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" onClick={() => setBtnCount(c => c + 1)}>
                      Primary ({btnCount})
                    </Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Sizes & Icons</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      startIcon={
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      }
                    >
                      New Item
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      endIcon={
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      }
                    >
                      Get Started
                    </Button>
                    <Button variant="secondary" size="lg">
                      Large Button
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">States</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" isLoading>
                      Saving Changes
                    </Button>
                    <Button variant="secondary" isDisabled>
                      Disabled Button
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dropdown & Dynamic List Section */}
            <Card hoverEffect={false}>
              <CardHeader className="flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Interactive Dropdown & List</CardTitle>
                  <CardDescription>
                    Change filtering to dynamically update list rendering.
                  </CardDescription>
                </div>
                <Dropdown
                  label={dropdownSelection}
                  items={dropdownItems}
                  onSelect={handleDropdownSelect}
                  variant="outline"
                  align="right"
                />
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  {isLoadingDemo ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-3">
                      <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading updated list...</span>
                    </div>
                  ) : (
                    <List divide={true}>
                      {filteredUsers.map((user) => (
                        <ListItem
                          key={user.id}
                          isInteractive
                          onClick={() => setSelectedUser(user)}
                          className={selectedUser?.id === user.id ? 'bg-violet-50/50 dark:bg-violet-950/20' : ''}
                        >
                          <ListItemAvatar src={user.avatarUrl} fallback={user.avatarFallback} />
                          <ListItemText primary={user.name} secondary={user.email} />
                          <div className="flex items-center gap-2">
                            <ListItemBadge label={user.role} variant={user.roleVariant} />
                            <ListItemBadge label={user.status} variant={user.statusVariant} />
                          </div>
                          <ListItemAction>
                            <svg className="w-5 h-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </ListItemAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Info Cards & Detail View */}
          <div className="space-y-8">
            
            {/* User detail viewer (Interactive State) */}
            <Card hoverEffect={true} className="border-t-4 border-t-violet-600">
              <CardHeader>
                <CardTitle>Selected User Detail</CardTitle>
                <CardDescription>Click a list row to inspect user properties.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[220px] flex flex-col justify-between">
                {selectedUser ? (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedUser.avatarUrl}
                        alt={selectedUser.name}
                        className="w-14 h-14 rounded-full border-2 border-violet-500 shadow-md object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">
                          {selectedUser.name}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{selectedUser.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div>
                        <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Role</span>
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">{selectedUser.role}</p>
                      </div>
                      <div>
                        <span className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Status</span>
                        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">{selectedUser.status}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                        Clear
                      </Button>
                      <Button variant="primary" size="sm">
                        Edit Account
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-grow py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <svg className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-zinc-400 dark:text-zinc-500 text-xs">No User Selected</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card hoverEffect={true}>
              <CardHeader>
                <CardTitle>Workspace Stats</CardTitle>
                <CardDescription>Status summary for marketing team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Total Members</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{users.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Active Licenses</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {users.filter(u => u.status === 'Active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Pending Invites</span>
                  <span className="font-semibold text-amber-500 dark:text-amber-400">
                    {users.filter(u => u.status === 'Pending').length}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">Updated just now</span>
                <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 dark:text-violet-400 p-0 hover:bg-transparent">
                  Manage Subscriptions →
                </Button>
              </CardFooter>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
