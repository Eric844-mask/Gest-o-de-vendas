
import React from 'react';
import { THEME } from '../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-3 rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm";
  const variants = {
    primary: `bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200 dark:shadow-none`,
    secondary: `bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200`,
    outline: `border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300`,
    danger: `bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800`
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-gray-50 dark:border-slate-800 transition-colors ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 px-1">{label}</label>}
    <input 
      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 focus:border-rose-400 dark:focus:border-rose-700 transition-all text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-600" 
      {...props} 
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 px-1">{label}</label>}
    <select 
      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900 focus:border-rose-400 dark:focus:border-rose-700 transition-all text-gray-800 dark:text-slate-100 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:20px_20px]" 
      {...props} 
    >
      {children}
    </select>
  </div>
);

export const Badge: React.FC<{ color?: string, children: React.ReactNode }> = ({ color = 'gray', children }) => {
  const colors: Record<string, string> = {
    rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
    gray: 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-100 dark:border-slate-700'
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-tight ${colors[color]}`}>
      {children}
    </span>
  );
};