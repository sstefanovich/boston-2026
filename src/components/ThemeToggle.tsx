import { useTheme } from '../context/ThemeContext';
import type { ThemePreference } from '../utils/theme';
import { NavIcon } from './NavIcon';

const OPTIONS: { value: ThemePreference; label: string; icon: string }[] = [
  { value: 'system', label: 'System', icon: 'phone' },
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
];

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { preference, resolved, setPreference } = useTheme();

  return (
    <div className={compact ? 'theme-toggle theme-toggle-compact' : 'theme-toggle'}>
      {!compact && (
        <p className="theme-toggle-hint">
          {preference === 'system'
            ? `Following system (${resolved === 'dark' ? 'dark' : 'light'})`
            : `Using ${preference} mode`}
        </p>
      )}
      <div className="theme-toggle-options" role="group" aria-label="Appearance">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`theme-toggle-btn${preference === opt.value ? ' active' : ''}`}
            onClick={() => setPreference(opt.value)}
            aria-pressed={preference === opt.value}
          >
            <NavIcon name={opt.icon} size={20} />
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
