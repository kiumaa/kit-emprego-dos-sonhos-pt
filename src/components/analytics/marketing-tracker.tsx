'use client';

import { useEffect } from 'react';
import { captureMarketingParams } from '@/lib/analytics/utm-tracker';

export function MarketingTracker() {
  useEffect(() => {
    captureMarketingParams();
  }, []);

  return null;
}
