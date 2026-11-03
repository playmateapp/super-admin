'use client';

import { Button, StatusState } from '@/components/ui';
import { commonMessages } from '@/lib/i18n';
import { useMessages } from '@/providers/i18n-provider';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const m = useMessages(commonMessages);
  return (
    <StatusState
      variant="error"
      title={m.loadError}
      className="min-h-screen justify-center"
      actions={
        <Button variant="outline" size="sm" onClick={() => reset()}>
          {m.retry}
        </Button>
      }
    />
  );
}
