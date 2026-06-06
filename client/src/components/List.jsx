import React from 'react';

export function List({ children, className = '', divide = true, ...props }) {
  const dividerClass = divide
    ? 'divide-y divide-zinc-100 dark:divide-zinc-800'
    : '';

  return (
    <ul
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden ${dividerClass} ${className}`}
      {...props}
    >
      {children}
    </ul>
  );
}

export function ListItem({
  children,
  className = '',
  onClick,
  isInteractive = false,
  ...props
}) {
  const interactiveClass = isInteractive || onClick
    ? 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors duration-150'
    : '';

  return (
    <li
      onClick={onClick}
      className={`flex items-center justify-between p-4 ${interactiveClass} ${className}`}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {children}
      </div>
    </li>
  );
}

export function ListItemAvatar({ src, alt = '', fallback = '', className = '', ...props }) {
  return (
    <div className={`relative flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 ${className}`} {...props}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          {fallback}
        </span>
      )}
    </div>
  );
}

export function ListItemText({ primary, secondary, className = '', ...props }) {
  return (
    <div className={`flex flex-col min-w-0 ${className}`} {...props}>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
        {primary}
      </span>
      {secondary && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          {secondary}
        </span>
      )}
    </div>
  );
}

export function ListItemBadge({ label, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60',
    secondary: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
      {...props}
    >
      {label}
    </span>
  );
}

export function ListItemAction({ children, className = '', ...props }) {
  return (
    <div className={`ml-4 flex-shrink-0 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
}
