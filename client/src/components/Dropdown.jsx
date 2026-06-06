import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({
  label = 'Select option',
  items = [],
  onSelect,
  variant = 'outline',
  align = 'left',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    setIsOpen(false);
    if (onSelect) onSelect(item);
  };

  const alignmentClasses = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  const buttonVariants = {
    outline: 'border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
    primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm',
    ghost: 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${buttonVariants[variant]}`}
      >
        <span>{label}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-2 w-56 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg ring-1 ring-black/5 z-50 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-150 ${alignmentClasses[align]}`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <button
                key={item.id || index}
                onClick={() => handleItemClick(item)}
                className="w-full text-left flex items-center px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                role="menuitem"
              >
                {item.icon && <span className="mr-2 text-zinc-400">{item.icon}</span>}
                <div className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">{item.description}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
