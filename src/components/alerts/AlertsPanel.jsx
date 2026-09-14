import React, { useState } from 'react';
import { Bell, Radio, Send, CheckCircle2, Smartphone, MessageSquare, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

export default function AlertsPanel({ alerts, isRefreshing = false }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');

  const filteredAlerts = alerts.filter((alt) => {
    const matchesSeverity = filterSeverity === 'ALL' || alt.severity === filterSeverity;
    const matchesState = selectedState === 'ALL' || alt.state.toUpperCase() === selectedState;
    return matchesSeverity && matchesState;
  });

  const getSeverityBadgeVariant = (severity) => {
    switch (severity) {
      case 'RED_EMERGENCY':
        return 'critical';
      case 'ORANGE_WARNING':
        return 'high';
      case 'YELLOW_WATCH':
        return 'medium';
      default:
        return 'neutral';
    }
  };

  const getChannelIcon = (channel) => {
    if (channel.includes('SMS')) return <Smartphone className="w-3 h-3 text-sky-600 dark:text-sky-400" />;
    if (channel.includes('WhatsApp')) return <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />;
    if (channel.includes('CAP') || channel.includes('Wireless')) return <Radio className="w-3 h-3 text-amber-600 dark:text-amber-400" />;
    return <Bell className="w-3 h-3 text-slate-500 dark:text-slate-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header & Filter Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Alert Transmission Log</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Official CAP & Multi-channel Broadcast History</p>
            </div>
          </div>
          <button
            type="button"
            className="px-2.5 py-1 bg-red-50 dark:bg-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/30 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3 h-3" /> Broadcast SOS
          </button>
        </div>

        {/* Severity Filter buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'RED_EMERGENCY', label: 'Red Emergency' },
            { id: 'ORANGE_WARNING', label: 'Orange Warning' },
            { id: 'YELLOW_WATCH', label: 'Yellow Watch' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterSeverity(tab.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                filterSeverity === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table / Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isRefreshing ? (
          <div className="space-y-3 py-2 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Active Alerts</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              No transmission logs match the selected alert severity criteria.
            </p>
            <button
              type="button"
              onClick={() => setFilterSeverity('ALL')}
              className="mt-3 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Show All Alerts
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-2.5 shadow-xs"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                      {alert.severity.replace('_', ' ')}
                    </Badge>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {alert.timestamp} ({alert.relativeTime})
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{alert.headline}</h4>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                    Target Area: {alert.area} ({alert.state})
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {alert.deliveryRate}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5">{alert.sentCount.toLocaleString()} Sent</span>
                </div>
              </div>

              {/* Message snippet */}
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 leading-relaxed font-sans">
                {alert.message}
              </p>

              {/* Channels & Recipients */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500 font-medium">Dispatched via:</span>
                  {alert.channels.map((ch, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700 flex items-center gap-1 text-[10px]"
                    >
                      {getChannelIcon(ch)}
                      <span>{ch}</span>
                    </span>
                  ))}
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Recipients: </span>
                  <b className="text-slate-700 dark:text-slate-300">{alert.recipientsType}</b>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
