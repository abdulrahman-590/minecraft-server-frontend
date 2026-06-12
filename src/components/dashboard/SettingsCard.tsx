'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchServerStatus, getApiUrl, setApiUrl } from '@/lib/api';
import { Settings, Save, PowerOff, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsCard() {
  const [apiUrl, setLocalApiUrl] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalApiUrl(getApiUrl());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiUrl) {
      setApiUrl(apiUrl);
      toast.success('API endpoint saved successfully!');
      queryClient.invalidateQueries();
    }
  };

  const { data: status } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: fetchServerStatus,
    refetchInterval: 10000,
  });
  const isRunning = status?.status === 'running' || status?.status === 'mock_running';

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl p-6 h-full relative overflow-hidden" id="settings">
      {!isRunning && (
        <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="bg-slate-900/80 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl">
            <PowerOff className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300 text-sm font-medium tracking-wide uppercase">System Offline</span>
          </div>
        </div>
      )}
      <div className="absolute top-0 right-0 p-32 bg-slate-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mb-6 relative border-b border-white/5 pb-4">
        <h3 className="text-xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-slate-500/10 rounded-lg">
            <Settings className="w-5 h-5 text-slate-400" />
          </div>
          Preferences
        </h3>
        <p className="text-slate-400 text-sm mt-1">Portal configuration</p>
      </div>
      
      <form onSubmit={handleSave} className="space-y-4 relative">
        <div className="space-y-2">
          <label htmlFor="refreshRate" className="text-sm font-medium text-slate-300">Metrics Refresh Rate (ms)</label>
          <input 
            id="refreshRate" 
            defaultValue="5000" 
            type="number" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="apiEndpoint" className="text-sm font-medium text-slate-300">Backend API Endpoint</label>
          <input 
            id="apiEndpoint" 
            value={apiUrl}
            onChange={(e) => setLocalApiUrl(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all" 
          />
        </div>
        <button type="submit" className="w-full hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all duration-200 border border-white/10 py-3 font-medium mt-2">
          Save Changes
        </button>
      </form>

      <div className="mt-8 border-t border-white/5 pt-6 relative">
        <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" /> System Backup
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Download a compressed snapshot of the Minecraft world directly to your local machine.
        </p>
        <button 
          type="button"
          onClick={() => window.open(`${getApiUrl()}/api/minecraft/backup`, '_blank')}
          className="w-full bg-gradient-to-r from-emerald-600/80 to-teal-600/80 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Backup World (.zip)
        </button>
      </div>
    </div>
  );
}
