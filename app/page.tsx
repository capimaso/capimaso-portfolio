'use client';

import Desktop from '@/components/Desktop';
import { LanguageProvider } from '@/lib/i18n';

export default function Home() {
  return (
    <LanguageProvider>
      <Desktop />
    </LanguageProvider>
  );
}
