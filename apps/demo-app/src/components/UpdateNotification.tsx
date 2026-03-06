import { useCallback, useEffect, useState } from 'react';

interface UpdateNotificationProps {
  currentVersion: string;
  checkInterval?: number;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  currentVersion,
  checkInterval = 60_000,
}) => {
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const checkForUpdate = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}site.webmanifest?_=${Date.now()}`);
      if (!res.ok) return;
      const manifest = await res.json();
      const remoteVersion = manifest.version;
      if (remoteVersion && remoteVersion !== currentVersion) {
        setNewVersion(remoteVersion);
      }
    } catch {
      // Silently ignore update check failures
    }
  }, [currentVersion]);

  useEffect(() => {
    const id = setInterval(checkForUpdate, checkInterval);
    return () => clearInterval(id);
  }, [checkForUpdate, checkInterval]);

  if (!newVersion || dismissed) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-lg"
    >
      <span className="text-sm text-text">
        A new version ({newVersion}) is available.
      </span>
      <button
        onClick={() => window.location.reload()}
        className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand/90"
      >
        Update
      </button>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss update notification"
        className="rounded-md bg-surface-alt px-3 py-1.5 text-sm font-medium text-text-muted transition hover:bg-border"
      >
        Dismiss
      </button>
    </div>
  );
};
