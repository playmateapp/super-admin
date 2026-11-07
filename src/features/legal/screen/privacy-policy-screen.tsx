'use client';

import { BrandLogo, LocaleSwitch, ThemeToggle } from '@/components/shared';
import { useMessages } from '@/providers/i18n-provider';

import { legalMessages } from '../i18n/legal.messages';

const CONTACT_EMAIL = 'support.playmate@gmail.com';

/** Replaces `{email}` in policy copy with a mailto link. */
function PolicyText({ text }: { text: string }) {
  const [before, after] = text.split('{email}');
  if (after === undefined) return text;
  return (
    <>
      {before}
      <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr" className="text-content-link underline">
        {CONTACT_EMAIL}
      </a>
      {after}
    </>
  );
}

/**
 * Public privacy policy for the PlayMate app (the Play Console privacy policy URL). Lives outside
 * `(panel)` so it opens with no sign-in. Keep the copy in step with what the app really collects.
 */
export function PrivacyPolicyScreen() {
  const m = useMessages(legalMessages);

  return (
    <div className="min-h-screen bg-surface-page">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <BrandLogo size={40} href={null} />
        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-4 sm:px-6">
        <article className="flex flex-col gap-8 rounded-card bg-surface-card p-5 sm:p-8">
          <div className="flex flex-col gap-3">
            <h1 className="font-display text-heading-xl font-bold text-content-primary">
              {m.title}
            </h1>
            <p className="text-body-xs text-content-muted">{m.effective}</p>
            <p className="text-body-md text-content-secondary">{m.intro}</p>
          </div>

          {m.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-3">
              <h2 className="font-display text-heading-md font-semibold text-content-primary">
                {section.title}
              </h2>
              {section.paragraphs?.map((text) => (
                <p key={text} className="text-body-md text-content-secondary">
                  <PolicyText text={text} />
                </p>
              ))}
              {section.items ? (
                <ul className="flex list-disc flex-col gap-2 ps-5 text-body-md text-content-secondary">
                  {section.items.map((item) => (
                    <li key={item}>
                      <PolicyText text={item} />
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.closing ? (
                <p className="text-body-md text-content-secondary">
                  <PolicyText text={section.closing} />
                </p>
              ) : null}
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}
