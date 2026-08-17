import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Eye, Sparkles, Activity } from 'lucide-react';

export const LiveVisitorsBadge: React.FC = () => {
  const [activeVisitors, setActiveVisitors] = useState<number>(1);
  const [totalVisits, setTotalVisits] = useState<number>(145);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    // Generate or retrieve persistent anonymous session ID
    let visitorId = sessionStorage.getItem('qevanix_visitor_id');
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('qevanix_visitor_id', visitorId);
    }

    const sendHeartbeat = () => {
      api.pingVisitor(visitorId!)
        .then((res) => {
          if (res.data.success && res.data.data) {
            setActiveVisitors(res.data.data.activeVisitors);
            setTotalVisits(res.data.data.totalVisits);
          }
        })
        .catch(() => {
          // Graceful fallback in offline/dev
          setActiveVisitors((prev) => Math.max(1, prev));
        });
    };

    // Initial ping
    sendHeartbeat();

    // Regular heartbeat interval every 15 seconds
    const interval = setInterval(sendHeartbeat, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <div className="relative group">
        {/* Main Floating Glass Badge */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/80 dark:bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/60 dark:border-indigo-500/30 shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/60 transition-all duration-300 transform hover:-translate-y-0.5 text-xs font-medium"
          title="Click to view live visitor statistics"
          aria-label="Real-time website visitor stats"
        >
          {/* Pulsing Green Live Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>

          <span className="flex items-center gap-1.5 text-slate-200">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              <strong className="text-white font-bold">{activeVisitors}</strong>{' '}
              {activeVisitors === 1 ? 'visitor' : 'visitors'} online
            </span>
          </span>
        </button>

        {/* Detailed Stats Popover (Expanded on Click or Hover) */}
        {showDetails && (
          <div className="absolute bottom-12 left-0 w-64 p-4 rounded-2xl bg-slate-950/95 text-white backdrop-blur-xl border border-slate-800 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Telemetry</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Real-Time</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="text-lg font-extrabold text-emerald-400 font-mono">
                  {activeVisitors}
                </div>
                <div className="text-[10px] text-slate-400">Active Online</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <div className="text-lg font-extrabold text-indigo-400 font-mono">
                  {totalVisits}
                </div>
                <div className="text-[10px] text-slate-400">Total Visits</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed text-center">
              Pinging live session heartbeat every 15s. Thank you for exploring my developer portfolio!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
