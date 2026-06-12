'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServerStatus, startServer, stopServer, rebootServer } from '@/lib/api';
import { Power, PowerOff, Loader2, Server, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function ServerControlCard() {
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: fetchServerStatus,
    refetchInterval: 10000,
  });

  const startMutation = useMutation({
    mutationFn: startServer,
    onSuccess: () => {
      toast.success('Start command sent!');
      queryClient.invalidateQueries({ queryKey: ['serverStatus'] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const stopMutation = useMutation({
    mutationFn: stopServer,
    onSuccess: () => {
      toast.success('Stop command sent!');
      queryClient.invalidateQueries({ queryKey: ['serverStatus'] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const rebootMutation = useMutation({
    mutationFn: rebootServer,
    onSuccess: () => {
      toast.success('Reboot command sent!');
      queryClient.invalidateQueries({ queryKey: ['serverStatus'] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const isRunning = status?.status === 'running' || status?.status === 'mock_running';
  const stateColor = isRunning ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mb-6 relative">
        <h3 className="text-xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Server className="w-5 h-5 text-blue-400" />
          </div>
          Instance Control
        </h3>
        <p className="text-slate-400 text-sm mt-1">EC2 Power Management</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center relative">
        {isLoading ? (
          <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>
        ) : (
          <div className="space-y-6">
            <div className="bg-black/20 border border-white/5 rounded-xl p-5 text-center shadow-inner">
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Current State</p>
              <p className={`text-2xl font-bold uppercase tracking-widest ${stateColor} drop-shadow-[0_0_10px_currentColor]`}>
                {status?.status || 'UNKNOWN'}
              </p>
              <p className="text-slate-500 text-xs mt-2 font-mono">{status?.ip || 'IP N/A'}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => startMutation.mutate()} 
                disabled={isRunning || startMutation.isPending}
                className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-inner"
              >
                {startMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> : <Power className="w-6 h-6" />}
                <span className="text-xs font-semibold tracking-wide uppercase">Boot</span>
              </button>

              <button 
                onClick={() => stopMutation.mutate()} 
                disabled={!isRunning || stopMutation.isPending}
                className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-inner"
              >
                {stopMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin text-rose-400" /> : <PowerOff className="w-6 h-6" />}
                <span className="text-xs font-semibold tracking-wide uppercase">Halt</span>
              </button>

              <button 
                onClick={() => rebootMutation.mutate()} 
                disabled={!isRunning || rebootMutation.isPending}
                className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-inner"
              >
                {rebootMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin text-amber-400" /> : <RefreshCw className="w-6 h-6" />}
                <span className="text-xs font-semibold tracking-wide uppercase">Reboot</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
