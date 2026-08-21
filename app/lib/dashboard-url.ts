import type { DashboardFilter } from '@/app/lib/dashboard-stats';

/**
 * Build a dashboard filter URL.
 * `date` wins over quick ranges (`days` / from–to) so day-bar clicks work.
 */
export function buildDashboardHref(filter: Partial<DashboardFilter>) {
  const params = new URLSearchParams();

  if (filter.date) {
    params.set('date', filter.date);
    if (filter.year) {
      params.set('year', String(filter.year));
    }
    if (filter.month) {
      params.set('month', String(filter.month));
    }
  } else if (filter.days) {
    params.set('days', String(filter.days));
  } else if (filter.from && filter.to) {
    params.set('from', filter.from);
    params.set('to', filter.to);
  } else {
    if (filter.year) {
      params.set('year', String(filter.year));
    }
    if (filter.month) {
      params.set('month', String(filter.month));
    }
  }

  if (filter.fruitId) {
    params.set('fruitId', String(filter.fruitId));
  }
  if (filter.workerId) {
    params.set('workerId', String(filter.workerId));
  }

  const query = params.toString();
  return query ? `/dashboard?${query}` : '/dashboard';
}
