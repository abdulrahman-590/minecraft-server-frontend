'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMetrics, fetchServerStatus } from '@/lib/api';
import { Activity, Cpu, HardDrive, PowerOff } from 'lucide-react';

export default function MetricsCard() {
  const { data: metrics } = useQuery({
    queryKey: ['serverMetrics'],
    queryFn: fetchMetrics,
    refetchInterval: 5000,
  });

  const { data: status } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: fetchServerStatus,
    refetchInterval: 10000,
  });
  const isRunning = status?.status === 'running' || status?.status === 'mock_running';

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl p-6 h-full relative overflow-hidden">
      {!isRunning && (
        <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="bg-slate-900/80 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl">
            <PowerOff className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300 text-sm font-medium tracking-wide uppercase">System Offline</span>
          </div>
        </div>
      )}
      <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mb-8 relative">
        <h3 className="text-xl font-bold flex items-center gap-3 text-white">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          Resource Metrics
        </h3>
        <p className="text-slate-400 text-sm mt-1">Live hardware telemetry</p>
      </div>
      
      <div className="flex flex-col gap-6 relative">
        <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-purple-400">
              <Cpu className="w-5 h-5" />
              <span className="font-semibold tracking-wide">CPU USAGE</span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tighter">
              {metrics?.cpu_usage ?? '--'}%
            </div>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
              style={{ width: `${metrics?.cpu_usage ?? 0}%` }}
            />
          </div>
        </div>
        
        <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-400">
              <HardDrive className="w-5 h-5" />
              <span className="font-semibold tracking-wide">RAM USAGE</span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tighter">
              {metrics?.ram_usage ?? '--'}%
            </div>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              style={{ width: `${metrics?.ram_usage ?? 0}%` }}
            />
          </div>
        </div>

        <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Activity className="w-5 h-5" />
              <span className="font-semibold tracking-wide">SERVER TPS</span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tighter">
              {metrics?.tps ? metrics.tps.toFixed(1) : '--'}
            </div>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
              style={{ width: `${Math.min(((metrics?.tps || 0) / 20) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
