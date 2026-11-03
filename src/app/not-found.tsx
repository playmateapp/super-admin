import Link from 'next/link';

import { Button, StatusState } from '@/components/ui';

/** Server component (no message hooks), so the copy is bilingual and inline. */
export default function NotFound() {
  return (
    <StatusState
      variant="empty"
      title="Page not found · পেজটি পাওয়া যায়নি"
      className="min-h-screen justify-center"
      actions={
        <Button asChild size="sm">
          <Link href="/dashboard">Back to dashboard · ড্যাশবোর্ডে ফিরুন</Link>
        </Button>
      }
    />
  );
}
