import React from 'react';

export function Card({ children, className = '', hoverEffect = false, ...props }) {
  const hoverClass = hoverEffect
    ? 'hover:scale-[1.01] hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-900 transition-all duration-300'
    : 'shadow-sm';

  return (
    <div
      className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`p-5 pb-3 flex flex-col gap-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3
      className={`text-lg font-semibold text-zinc-900 dark:text-zinc-50 leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p
      className={`text-sm text-zinc-500 dark:text-zinc-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-5 pt-0 text-sm text-zinc-700 dark:text-zinc-300 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`p-5 pt-0 flex items-center border-t border-zinc-100 dark:border-zinc-800/50 mt-4 pt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
