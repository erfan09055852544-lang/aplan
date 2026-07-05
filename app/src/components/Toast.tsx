import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Toast() {
  const { toast, clearToast } = useApp();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(clearToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-amber-500" />,
  };

  const borders = {
    success: 'border-r-green-500',
    error: 'border-r-red-500',
    info: 'border-r-amber-500',
  };

  return (
    <div className="fixed top-20 left-4 z-[100] animate-in slide-in-from-left-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg border-r-4 ${borders[toast.type]} min-w-[300px]`}>
        {icons[toast.type]}
        <p className="text-sm text-slate-700 flex-1">{toast.message}</p>
        <button onClick={clearToast} className="p-1 hover:bg-slate-100 rounded transition-colors">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
