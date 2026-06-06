import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  startIcon,
  endIcon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm focus:ring-violet-500',
    secondary: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 focus:ring-zinc-500',
    outline: 'border border-zinc-300 hover:bg-zinc-50 text-zinc-700 dark:border-zinc-600 dark:hover:bg-zinc-800 dark:text-zinc-300 focus:ring-zinc-500',
    ghost: 'hover:bg-zinc-100 text-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-300 focus:ring-zinc-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && startIcon && <span className="inline-flex">{startIcon}</span>}
      <span>{children}</span>
      {!isLoading && endIcon && <span className="inline-flex">{endIcon}</span>}
    </button>
  );
}
