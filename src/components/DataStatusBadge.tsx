interface DataStatusBadgeProps {
  mode: 'live' | 'cached' | 'offline' | 'loading';
  label?: string;
}

const LABELS: Record<DataStatusBadgeProps['mode'], string> = {
  live: 'Live',
  cached: 'Cached',
  offline: 'Offline estimate',
  loading: 'Updating…',
};

export function DataStatusBadge({ mode, label }: DataStatusBadgeProps) {
  return (
    <span className={`data-status data-status-${mode}`} title={label ?? LABELS[mode]}>
      {label ?? LABELS[mode]}
    </span>
  );
}
