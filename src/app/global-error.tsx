'use client';

/** Last-resort boundary: rendered without providers, so the copy is bilingual and inline. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', padding: 40, textAlign: 'center' }}>
        <h2>Something went wrong · কিছু একটা সমস্যা হয়েছে</h2>
        <button type="button" onClick={() => reset()} style={{ marginTop: 16 }}>
          Try again · আবার চেষ্টা করুন
        </button>
      </body>
    </html>
  );
}
