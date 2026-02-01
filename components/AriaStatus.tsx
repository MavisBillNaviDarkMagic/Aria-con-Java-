
import React, { useEffect, useState } from 'react';
import { SystemState } from '../types';

const AriaStatus: React.FC = () => {
  const [state, setState] = useState<SystemState>({
    jdkVersion: '21.0.2',
    status: 'online',
    memoryUsage: 45,
    cpuLoad: 12,
    activeThreads: 128
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        memoryUsage: Math.min(100, Math.max(10, prev.memoryUsage + (Math.random() - 0.5) * 2)),
        cpuLoad: Math.min(100, Math.max(5, prev.cpuLoad + (Math.random() - 0.5) * 5)),
        activeThreads: Math.floor(prev.activeThreads + (Math.random() - 0.5) * 4)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Core Telemetry</h3>
        
        <div className="space-y-6">
          {/* Status Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">System Health</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 capitalize">
                {state.status}
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>JVM Heap Usage</span>
                <span>{state.memoryUsage.toFixed(1)}%</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${state.memoryUsage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>System CPU Load</span>
                <span>{state.cpuLoad.toFixed(1)}%</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${state.cpuLoad}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
              <div className="text-[10px] text-zinc-500 uppercase">JDK Runtime</div>
              <div className="text-sm font-bold text-zinc-300 mono">{state.jdkVersion}</div>
            </div>
            <div className="p-2 bg-zinc-950 border border-zinc-800 rounded">
              <div className="text-[10px] text-zinc-500 uppercase">Threads</div>
              <div className="text-sm font-bold text-zinc-300 mono">{state.activeThreads}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="mt-1 p-1 bg-blue-500/20 rounded">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-xs text-blue-300/80 leading-relaxed">
            Aria 5.0 is currently connected to the local Java environment. Use the terminal to query repository documentation or execute simulated shell commands.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AriaStatus;
