
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
    primary: `bg-${THEME.primary} text-white hover:bg-${THEME.primaryDark}`,
    secondary: `bg-slate-100 text-slate-800`,
    outline: `border-2 border-slate-200 text-slate-700`,
    danger: `bg-rose-50 text-rose-600 border border-rose-100`
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
  <div className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-50 ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-gray-600 px-1">{label}</label>}
    <input 
      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-gray-800" 
      {...props} 
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-gray-600 px-1">{label}</label>}
    <select 
      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-gray-800 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:20px_20px]" 
      {...props} 
    >
      {children}
    </select>
  </div>
);

export const Badge: React.FC<{ color?: string, children: React.ReactNode }> = ({ color = 'gray', children }) => {
  const colors: Record<string, string> = {
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    gray: 'bg-gray-50 text-gray-600 border-gray-100'
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-tight ${colors[color]}`}>
      {children}
    </span>
  );
};
