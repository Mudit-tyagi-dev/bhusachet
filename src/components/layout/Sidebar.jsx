import React from 'react';
import {
  TrendingUp,
  Cpu,
  Users,
  Route,
  Bell,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  CloudSun,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  badgeCounts = {},
}) {
  const menuItems = [
    {
      id: 'weather',
      label: 'Weather Intel',
      hindi: 'मौसम आसूचना',
      icon: CloudSun,
      description: 'NER Radar & Hydro Telemetry',
      badge: 'LIVE',
      badgeVariant: 'info',
    },
    {
      id: 'prediction',
      label: 'Prediction',
      hindi: 'पूर्वानुमान',
      icon: Cpu,
      description: 'AI Risk Zones & Forecasting',
      badge: badgeCounts.criticalRisk || null,
      badgeVariant: 'critical',
    },
    {
      id: 'reports',
      label: 'Reports',
      hindi: 'नागरिक रिपोर्ट',
      icon: Users,
      description: 'Citizen Field Submissions',
      badge: badgeCounts.pendingReports || null,
      badgeVariant: 'warning',
    },
    {
      id: 'roads',
      label: 'Roads',
      hindi: 'सड़क नेटवर्क',
      icon: Route,
      description: 'Lifeline Transit & Detours',
      badge: badgeCounts.blockedRoads ? `${badgeCounts.blockedRoads} Blocked` : null,
      badgeVariant: 'danger',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      hindi: 'चेतावनी लॉग',
      icon: Bell,
      description: 'Dispatched Warning Logs',
      badge: badgeCounts.activeAlerts || null,
      badgeVariant: 'info',
    },
    {
      id: 'emergency',
      label: 'Crisis Queue',
      hindi: 'प्राथमिकता सूची',
      icon: AlertOctagon,
      description: 'Ranked Emergency Priority',
      badge: 'TOP 5',
      badgeVariant: 'critical',
    },
  ];

  return (
    <aside
      className={`h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 flex flex-col z-20 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation list */}
      <div className="flex-1 py-3 px-2 space-y-1.5 overflow-y-auto overflow-x-visible">
        {!collapsed && (
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Command Modules
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="relative group">
              <button
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full relative flex items-center ${
                  collapsed ? 'justify-center p-2.5' : 'justify-start px-3 py-2.5'
                } rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-900/90'
                }`}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 group-hover:scale-110 ${
                      isActive
                        ? 'text-slate-950 stroke-[2.2]'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                    }`}
                  />
                </div>

                {/* Collapsed view badge - anchored cleanly at top-right corner of the button */}
                {collapsed && item.badge && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 ring-2 ring-white dark:ring-slate-950"></span>
                  </span>
                )}

                {!collapsed && (
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate leading-tight block">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full font-mono ${
                            isActive
                              ? 'bg-black/25 text-slate-950'
                              : item.badgeVariant === 'critical' || item.badgeVariant === 'danger'
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40'
                              : item.badgeVariant === 'warning'
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] truncate block ${
                        isActive ? 'text-slate-900/80 font-medium' : 'text-slate-500 dark:text-slate-500'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                )}

                {/* Active bar indicator on left */}
                {isActive && collapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-500 rounded-r"></span>
                )}
              </button>

              {/* Enhanced Popover Tooltip for Collapsed Mode */}
              {collapsed && (
                <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 text-slate-100 text-xs rounded-xl shadow-2xl border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-[1100] flex items-center gap-2">
                  <div>
                    <span className="font-bold text-white block leading-tight">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block">{item.description}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar bottom footer: collapse/expand control button */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/60">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full py-2 ${
            collapsed ? 'px-1 justify-center' : 'px-3 justify-center'
          } rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-900/90 text-xs flex items-center gap-2 transition-colors`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-[11px] font-medium">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
