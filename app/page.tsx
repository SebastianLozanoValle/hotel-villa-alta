import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirección directa sin middleware
  redirect('/es');
}
