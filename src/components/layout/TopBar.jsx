import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Menu,
  RefreshCw,
  Globe,
  Bell,
  HelpCircle,
  Settings,
  Shield,
  Radio,
  Wifi,
  AlertOctagon,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import StatusPill from '../common/StatusPill';
import Spinner from '../common/Spinner';
import IconButton from '../common/IconButton';
import { LANGUAGES } from '../../data/i18nData';
import { useTheme } from '../../context/ThemeContext';

export default function TopBar({
  onToggleSidebar,
  sidebarCollapsed,
  isRefreshing,
  timeAgoText,
  onRefresh,
  systemLive = true,
  onOpenPriorityQueue,
  activeAlertsCount = 3,
  currentLanguage = 'en',
  onLanguageChange,
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const langBtnRef = useRef(null);
  const langDropdownRef = useRef(null);
  const [langDropdownPos, setLangDropdownPos] = useState({ top: 0, right: 0 });

  // Compute dropdown position from button bounding rect
  const openLangMenu = useCallback(() => {
    if (langBtnRef.current) {
      const rect = langBtnRef.current.getBoundingClientRect();
      setLangDropdownPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setLangMenuOpen(true);
    setSettingsMenuOpen(false);
  }, []);

  // Close language dropdown on outside click or Escape key
  useEffect(() => {
    if (!langMenuOpen) return;
    const handleClickOutside = (e) => {
      if (
        langDropdownRef.current && !langDropdownRef.current.contains(e.target) &&
        langBtnRef.current && !langBtnRef.current.contains(e.target)
      ) {
        setLangMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [langMenuOpen]);

  return (
    <header className="h-16 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 flex items-center justify-between z-30 select-none transition-colors duration-200">
      {/* LEFT CLUSTER: Toggle Button & Branding */}
      <div className="flex items-center gap-3">
        {/* Hamburger sidebar collapse toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-20 h-20 ">
            <img src="/bhusachet2.png" alt="Brand Logo" className="w-full h-full object-contain" />
            {/* <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950"></span> */}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                {/* <span> भूSachet</span> */}
                {/* <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded">
                  भू Sachet
                </span> */}
              </h1>
              {/* <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30 uppercase tracking-wide">
                NER Pilot
              </span> */}
            </div>
            {/* <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Landslide Early Warning & Risk Monitoring System • Sikkim & Meghalaya
            </p> */}
          </div>
        </div>
      </div>

      {/* MIDDLE CLUSTER: Telemetry Health, Refresh Control & Sync Status */}
      <div className="hidden sm:flex items-center gap-3">
        {/* Live System Status Pill */}
        {/* <StatusPill
          status={systemLive ? 'live' : 'stale'}
          label={systemLive ? 'SYSTEM LIVE' : 'DATA STALE'}
          sublabel="Sensors Active"
        /> */}

        {/* Refresh button with spinner and dynamic last-updated badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition-colors disabled:opacity-50"
            title="Force refresh live sensor feed"
          >
            {isRefreshing ? (
              <Spinner size="sm" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-transform duration-500" />
            )}
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
          <span className="text-slate-300 dark:text-slate-600 text-[10px]">|</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Updated {timeAgoText}
          </span>
        </div>

        {/* Offline / Synced Indicator Placeholder */}
        {/* <div
          className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 font-mono"
          title="Remote edge node mesh & cache connection"
        >
          <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Sync: 100% (Mesh Ready)</span>
        </div> */}
      </div>

      {/* RIGHT CLUSTER: Theme Toggle, Gmail-style Action Icons & User Profile */}
      <div className="flex items-center gap-1.5">
        {/* Emergency Priority Queue Quick Action */}
        {/* <button
          type="button"
          onClick={onOpenPriorityQueue}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/15 hover:bg-rose-200 dark:hover:bg-rose-500/25 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors"
          title="Open Emergency Priority Queue"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>Crisis Queue</span>
        </button> */}

        {/* Dedicated Quick Theme Toggle (Sun/Moon) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* Language Selector Button */}
        <div className="relative">
          <button
            ref={langBtnRef}
            type="button"
            onClick={() => {
              if (langMenuOpen) {
                setLangMenuOpen(false);
              } else {
                openLangMenu();
              }
            }}
            className="flex items-center gap-1 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium"
            title="Select Language (i18n ready)"
          >
            <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="uppercase text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {currentLanguage}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        {/* Language Dropdown — rendered via portal to escape header stacking context */}
        {langMenuOpen && createPortal(
          <div
            ref={langDropdownRef}
            className={isDark ? 'dark' : ''}
            style={{
              position: 'fixed',
              top: langDropdownPos.top,
              right: langDropdownPos.right,
              zIndex: 99999,
            }}
          >
            <div className="w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl py-1">
              <div className="px-4 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                Languages (NER)
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    if (onLanguageChange) onLanguageChange(l.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    currentLanguage === l.code
                      ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                    {l.nativeName}
                  </span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}

        {/* Notification Bell */}
        <IconButton
          icon={Bell}
          label="Alerts"
          badge={activeAlertsCount}
          title={`${activeAlertsCount} Active Warning Alerts`}
        />

        {/* Help / Docs */}
        <IconButton
          icon={HelpCircle}
          label="Documentation"
          title="SOPs & User Manual"
          className="hidden sm:inline-flex"
        />

        {/* Settings Dropdown (Gear) with Theme selector */}
        <div className="relative">
          <IconButton
            icon={Settings}
            label="Settings"
            title="Theme & System Configurations"
            onClick={() => {
              setSettingsMenuOpen(!settingsMenuOpen);
              setLangMenuOpen(false);
            }}
            active={settingsMenuOpen}
            className="hidden sm:inline-flex"
          />

          {settingsMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-xl glass-panel bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-50">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                Appearance Theme
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setTheme('dark');
                    setSettingsMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" /> Dark Theme
                  </span>
                  {theme === 'dark' && <span className="text-[10px] font-bold text-amber-500">Active</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('light');
                    setSettingsMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    theme === 'light'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Theme
                  </span>
                  {theme === 'light' && <span className="text-[10px] font-bold text-amber-500">Active</span>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar (Gmail Cluster Style) */}
        <div className="ml-1.5 flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-indigo-600 p-[1.5px] cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all">
            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-xs">
              SD
            </div>
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">SDMA Admin</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Operations EOC</span>
          </div>
        </div>
      </div>
    </header>
  );
}
