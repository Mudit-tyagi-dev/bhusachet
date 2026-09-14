import React, { useState } from 'react';
import { Users, AlertCircle, RefreshCw } from 'lucide-react';
import ReportCard from './ReportCard';

export default function ReportsPanel({
  reports,
  onVerifyReport,
  onRejectReport,
  onFocusReport,
  isRefreshing = false,
}) {
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length;
  const verifiedCount = reports.filter((r) => r.status === 'VERIFIED').length;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Citizen Crowd Reports</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Geo-tagged submissions from field & mobile app</p>
            </div>
          </div>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 animate-pulse">
              {pendingCount} Pending Review
            </span>
          )}
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          {[
            { id: 'ALL', label: 'All', count: reports.length },
            { id: 'PENDING', label: 'Pending', count: pendingCount },
            { id: 'VERIFIED', label: 'Verified', count: verifiedCount },
            { id: 'REJECTED', label: 'Dismissed', count: reports.length - pendingCount - verifiedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`py-1.5 px-2 rounded-md font-semibold text-center text-[11px] transition-all ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Reports Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {isRefreshing ? (
          /* Loading Skeletons */
          <div className="space-y-3 py-2 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/5"></div>
                </div>
                <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          /* Proper Empty State */
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Reports Found</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              There are currently no citizen field reports matching the "{statusFilter}" status filter.
            </p>
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className="mt-3 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Show All Reports
            </button>
          </div>
        ) : (
          filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onVerify={onVerifyReport}
              onReject={onRejectReport}
              onFocus={onFocusReport}
            />
          ))
        )}
      </div>
    </div>
  );
}
