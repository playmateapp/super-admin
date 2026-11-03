import { redirect } from 'next/navigation';

/** The panel has no public home — `/` goes to the dashboard (the guard handles guests). */
export default function Page() {
  redirect('/dashboard');
}
