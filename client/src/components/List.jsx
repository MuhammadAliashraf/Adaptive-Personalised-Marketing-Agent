import React from 'react';

export function List({ children, className = '', divide = true, ...props }) {
  return (
    <ul
      className={`bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden ${divide ? 'divide-y divide-stone-100 dark:divide-stone-800' : ''} ${className}`}
      {...props}
    >
      {children}
    </ul>
  );
}

export function ListItem({ children, className = '', onClick, isInteractive = false, ...props }) {
  const interactiveClass =
    isInteractive || onClick
      ? 'hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors duration-100'
      : '';

  return (
    <li
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3.5 ${interactiveClass} ${className}`}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">{children}</div>
    </li>
  );
}

export function ListItemAvatar({ src, alt = '', fallback = '', className = '', ...props }) {
  return (
    <div
      className={`relative shrink-0 h-9 w-9 rounded-full overflow-hidden bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center border border-stone-200 dark:border-stone-700 ${className}`}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-bold text-teal-700 dark:text-teal-400">{fallback}</span>
      )}
    </div>
  );
}

export function ListItemText({ primary, secondary, className = '', ...props }) {
  return (
    <div className={`flex flex-col min-w-0 ${className}`} {...props}>
      <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate leading-snug">
        {primary}
      </span>
      {secondary && (
        <span className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">{secondary}</span>
      )}
    </div>
  );
}

export function ListItemBadge({ label, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary:   'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60',
    secondary: 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
    success:   'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    warning:   'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    danger:    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${variants[variant]} ${className}`}
      {...props}
    >
      {label}
    </span>
  );
}

export function ListItemAction({ children, className = '', ...props }) {
  return (
    <div className={`ml-3 shrink-0 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
}
