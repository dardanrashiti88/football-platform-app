import React, { useEffect, useState } from 'react';
import { Bell, Moon, Settings, Shield, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';

type SettingsViewProps = {
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

const KEY = 'fodrDashboardSettings';

export function SettingsView({ isDarkMode, onToggleTheme }: SettingsViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [privacyLock, setPrivacyLock] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      setAlertsEnabled(Boolean(data.alertsEnabled));
      setAutoSync(Boolean(data.autoSync));
      setPrivacyLock(Boolean(data.privacyLock));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, JSON.stringify({ alertsEnabled, autoSync, privacyLock }));
  }, [alertsEnabled, autoSync, privacyLock]);

  const toggleRow = (label: string, description: string, value: boolean, onChange: () => void) => (
    <div className={cn('rounded-2xl border p-4 flex items-center justify-between gap-4', panelBorder, panelBg)}>
      <div>
        <div className="text-sm font-bold">{label}</div>
        <div className={cn('text-xs mt-1', muted)}>{description}</div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={cn(
          'w-14 h-8 rounded-full flex items-center px-1 transition-colors',
          value ? 'bg-orange-500/80' : 'bg-white/10'
        )}
      >
        <div className={cn('w-6 h-6 rounded-full bg-white transition-transform', value ? 'translate-x-6' : 'translate-x-0')} />
      </button>
    </div>
  );

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className={cn('text-sm', muted)}>Personalize your dashboard experience.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onToggleTheme}
          className={cn('px-5 py-3 rounded-2xl border text-sm font-black flex items-center gap-2', panelBorder, panelBg, muted)}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          Toggle Theme
        </motion.button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={cn('col-span-12 lg:col-span-7 rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Settings size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Dashboard Preferences</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Saved locally</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {toggleRow('Price Alerts', 'Enable watchlist spikes, dips, and offer alerts.', alertsEnabled, () => setAlertsEnabled((p) => !p))}
            {toggleRow('Auto Inventory Sync', 'Refresh inventory whenever new cards are added.', autoSync, () => setAutoSync((p) => !p))}
            {toggleRow('Privacy Lock', 'Hide sensitive values when sharing screenshots.', privacyLock, () => setPrivacyLock((p) => !p))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Bell size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Notifications</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Coming next</div>
              </div>
            </div>
            <p className={cn('text-sm mt-4', muted)}>Notification routing (push / email) will be added later. For now, popovers show example data.</p>
          </div>

          <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Shield size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Security</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Vault standards</div>
              </div>
            </div>
            <ul className={cn('mt-4 text-sm space-y-2', muted)}>
              <li>• Escrow locked transactions</li>
              <li>• Geo-lock + device fingerprinting</li>
              <li>• 2FA rollout (soon)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

