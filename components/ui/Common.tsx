import React, { useState } from 'react';
import { Sparkles, Loader2, Plus, Trash2 } from 'lucide-react';
import { generateSuggestion } from '../../services/geminiService';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onAiAssist?: (val: string) => void;
}

export const Input: React.FC<InputProps> = ({ label, onAiAssist, className, ...props }) => {
  return (
    <div className="mb-4">
      <Label text={label} onAiAssist={onAiAssist ? () => onAiAssist(props.value as string) : undefined} />
      <input
        className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  onAiAssist?: (val: string) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, onAiAssist, className, ...props }) => {
  return (
    <div className="mb-4">
      <Label text={label} onAiAssist={onAiAssist ? () => onAiAssist(props.value as string) : undefined} />
      <textarea
        className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all min-h-[100px] ${className}`}
        {...props}
      />
    </div>
  );
};

const Label: React.FC<{ text: string; onAiAssist?: () => void }> = ({ text, onAiAssist }) => {
  const [loading, setLoading] = useState(false);

  const handleAiClick = async () => {
    if (!onAiAssist) return;
    setLoading(true);
    try {
      await onAiAssist();
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between items-center">
      <span>{text}</span>
      {onAiAssist && (
        <button
          type="button"
          onClick={handleAiClick}
          disabled={loading}
          className="text-xs flex items-center text-secondary hover:text-blue-700 font-semibold disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
          {loading ? 'Generando...' : 'Sugerir con IA'}
        </button>
      )}
    </label>
  );
};

export const SectionHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="mb-6 border-b border-slate-200 pb-4">
    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
    <p className="text-slate-500 text-sm mt-1">{description}</p>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline' }> = ({ 
  variant = 'primary', 
  className, 
  children, 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-secondary text-white hover:bg-blue-600",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode }> = ({ icon, className, ...props }) => (
  <button className={`p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors ${className}`} {...props}>
    {icon}
  </button>
);

// Common Types Helper for AI
export const useAiHelper = (updateField: (val: string) => void, context: string, section: string) => {
  return async (currentVal: string) => {
    const suggestion = await generateSuggestion(context, currentVal, section);
    updateField(suggestion);
  };
};
