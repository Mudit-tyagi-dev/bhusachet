import React from 'react';
import { Camera, Video, CheckCircle2, XCircle, Clock, MapPin } from 'lucide-react';
import Badge from '../common/Badge';

export default function ReportCard({ report, onVerify, onReject, onFocus }) {
  const isPending = report.status === 'PENDING';
  const isVerified = report.status === 'VERIFIED';
  const isRejected = report.status === 'REJECTED';

  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        isPending
          ? 'bg-amber-50/40 dark:bg-slate-900/80 border-amber-300 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-500/50 shadow-xs'
          : isVerified
          ? 'bg-slate-50 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-500/20'
          : 'bg-slate-100/60 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-75'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Badge variant={report.severity.toLowerCase()}>{report.severity}</Badge>
          <Badge
            variant={isVerified ? 'low' : isPending ? 'medium' : 'neutral'}
            size="sm"
          >
            {report.status}
          </Badge>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" /> {report.timestamp}
        </span>
      </div>

      {/* Media & Content */}
      <div className="flex gap-3">
        {report.hasPhoto && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-950">
            <img
              src={report.photoUrl}
              alt="Report media"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {report.hasVideo && (
              <div className="absolute bottom-1 right-1 p-0.5 bg-black/80 rounded text-red-400">
                <Video className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
            {report.state} • {report.district}
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{report.category}</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-snug">
            {report.description}
          </p>
        </div>
      </div>

      {/* Meta details */}
      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <span>Reporter: <b className="text-slate-700 dark:text-slate-300">{report.reporterName}</b></span>
        <button
          type="button"
          onClick={() => onFocus && onFocus(report)}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold flex items-center gap-1"
        >
          <MapPin className="w-3 h-3" /> View on Map
        </button>
      </div>

      {/* Actions */}
      {isPending && (
        <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onVerify && onVerify(report.id)}
            className="flex-1 py-1.5 px-2.5 bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Verify & Dispatch
          </button>
          <button
            type="button"
            onClick={() => onReject && onReject(report.id)}
            className="py-1.5 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" /> Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
