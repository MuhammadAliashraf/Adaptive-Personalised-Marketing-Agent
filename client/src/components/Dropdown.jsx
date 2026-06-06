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
    left:  'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  const buttonVariants = {
    outline: 'border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900',
    primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm',
    ghost:   'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center justify-between gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${buttonVariants[variant]}`}
      >
        <span>{label}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 opacity-60 ${isOpen ? 'rotate-180' : ''}`}
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
          className={`absolute mt-1.5 w-60 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-lg ring-1 ring-black/5 z-50 overflow-hidden ${alignmentClasses[align]}`}
        >
          <div className="py-1" role="menu">
            {items.map((item, index) => (
              <button
                key={item.id || index}
                onClick={() => handleItemClick(item)}
                className="w-full text-left flex items-center px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                role="menuitem"
              >
                {item.icon && <span className="mr-3 text-stone-400 shrink-0">{item.icon}</span>}
                <div className="flex flex-col">
                  <span className="font-semibold leading-snug">{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{item.description}</span>
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
