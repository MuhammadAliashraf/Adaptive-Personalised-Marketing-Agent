import React from 'react';

export function Card({ children, className = '', hoverEffect = false, ...props }) {
  const hoverClass = hoverEffect
    ? 'hover:shadow-md hover:border-teal-200 dark:hover:border-teal-800/50 transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 rounded-xl shadow-sm ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`px-5 pt-5 pb-3 flex flex-col gap-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3
      className={`text-[15px] font-bold text-stone-900 dark:text-stone-50 leading-snug tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-sm text-stone-500 dark:text-stone-400 leading-snug ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`px-5 pb-5 pt-0 text-sm text-stone-700 dark:text-stone-300 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`px-5 py-4 flex items-center border-t border-stone-100 dark:border-stone-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
