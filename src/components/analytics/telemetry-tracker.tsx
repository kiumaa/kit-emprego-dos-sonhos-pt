'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initTelemetryTracking } from '@/lib/analytics/telemetry-client';

export function TelemetryTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Não rastrear visitas internas do próprio backoffice
    if (pathname && pathname.startsWith('/backoffice')) return;
    initTelemetryTracking();
  }, [pathname]);

  return null;
}
