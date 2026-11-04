// Dynamic Real-Time Date & Analytics Utilities for SakshamXTech

export interface DateDataPoint {
  id: string;
  dateLabel: string;
  fullDate: string;
  isoDate: string;
  visitors: number;
  pageViews: number;
  newUsers: number;
  youtubeClicks: number;
  topPage: string;
  deviceSplit: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

/**
 * Format a Date or ISO string into clean Date & Time without timezone suffix:
 * e.g. "04 Nov 2026, 08:45 PM"
 */
export function formatCleanDateTime(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a Date or ISO string into Delhi Time (Asia/Kolkata, UTC+5:30)
 * e.g. "04 Nov 2026, 08:45 PM IST"
 */
export function formatDelhiDateTime(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' IST';
}

/**
 * Format date in Delhi Time: "04 Nov 2026"
 */
export function formatDelhiDate(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time in Delhi Time: "08:45 PM IST"
 */
export function formatDelhiTime(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' IST';
}

/**
 * Returns current Date formatted for HTML datetime-local input in Delhi time
 */
export function getDelhiCurrentDateTimeLocal(): string {
  const now = new Date();
  // Format into YYYY-MM-DDTHH:mm using Intl
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';
  return `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}`;
}

/**
 * Checks whether an article is live published or scheduled for the future
 */
export function isBlogPostLive(post: { status?: 'published' | 'scheduled' | 'draft'; scheduledAt?: string }): boolean {
  if (post.status === 'draft') return false;
  if (post.status === 'scheduled' && post.scheduledAt) {
    const schedTime = new Date(post.scheduledAt).getTime();
    if (!isNaN(schedTime) && schedTime > Date.now()) {
      return false; // Scheduled in the future
    }
  }
  return true;
}

/**
 * Format a Date into YYYY-MM-DD in local time
 */
export function formatLocalDateIso(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Safely parse a date, ISO string, or YYYY-MM-DD into a local Date object without UTC drift
 */
export function parseLocalDate(date: Date | string): Date {
  if (date instanceof Date) return date;
  if (!date) return new Date();
  if (typeof date === 'string') {
    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const hours = match[4] ? parseInt(match[4], 10) : 0;
      const minutes = match[5] ? parseInt(match[5], 10) : 0;
      const seconds = match[6] ? parseInt(match[6], 10) : 0;
      return new Date(year, month, day, hours, minutes, seconds);
    }
  }
  const fallback = new Date(date);
  return isNaN(fallback.getTime()) ? new Date() : fallback;
}

/**
 * Calculates calendar day difference between baseDate (defaults to today) and target date.
 * Positive number = target is N days in the past.
 * 0 = target is same calendar day (Today).
 * Negative number = target is in the future.
 */
export function getCalendarDayDifference(target: Date | string, baseDate: Date = new Date()): number {
  const d = parseLocalDate(target);
  if (isNaN(d.getTime())) return 0;
  
  const baseMidnight = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 0, 0, 0, 0);
  const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);

  const diffMs = baseMidnight.getTime() - targetMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns formatted date string: e.g. "Nov 3, 2026"
 */
export function formatRealDate(date: Date | string = new Date()): string {
  const d = parseLocalDate(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns full date with day name: e.g. "Tuesday, Nov 3, 2026"
 */
export function formatFullDate(date: Date | string = new Date()): string {
  const d = parseLocalDate(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns date N days ago
 */
export function getDateDaysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/**
 * Returns ISO date string (YYYY-MM-DD) for N days ago in local time
 */
export function getDateIsoDaysAgo(days: number): string {
  return formatLocalDateIso(getDateDaysAgo(days));
}

/**
 * Returns today's ISO date string (YYYY-MM-DD) in local time
 */
export function getTodayISODate(): string {
  return formatLocalDateIso(new Date());
}

/**
 * Checks if a given date or ISO string falls on today's calendar date
 */
export function isDateToday(date: Date | string): boolean {
  if (!date) return false;
  return getCalendarDayDifference(date) === 0;
}

/**
 * Checks if a given date or ISO string falls on yesterday's calendar date
 */
export function isDateYesterday(date: Date | string): boolean {
  if (!date) return false;
  return getCalendarDayDifference(date) === 1;
}

/**
 * Returns friendly relative time string (e.g. "Today", "Yesterday", "2 days ago")
 * based on pure calendar-day transitions, never buggy 24-hr millisecond division.
 */
export function getRelativeTimeString(date: Date | string): string {
  if (!date) return '';
  const d = parseLocalDate(date);
  if (isNaN(d.getTime())) return String(date);

  const daysAgo = getCalendarDayDifference(d);

  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo > 1 && daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo >= 7 && daysAgo < 14) return '1 week ago';
  if (daysAgo >= 14 && daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
  if (daysAgo >= 30 && daysAgo < 365) return `${Math.floor(daysAgo / 30)} months ago`;
  if (daysAgo >= 365) return `${Math.floor(daysAgo / 365)} years ago`;

  if (daysAgo === -1) return 'Tomorrow';
  if (daysAgo < -1) return `In ${Math.abs(daysAgo)} days`;

  return formatRealDate(d);
}

/**
 * Generates dynamic, realistic date-wise analytics ending on TODAY
 */
export function generateDateWiseAnalytics(timeframe: 'today' | '7d' | '30d' | 'ytd'): {
  points: DateDataPoint[];
  summary: {
    totalVisitors: number;
    totalPageViews: number;
    totalNewUsers: number;
    totalYoutubeClicks: number;
    growthPercent: number;
  };
} {
  const points: DateDataPoint[] = [];
  const now = new Date();

  const topPagesList = [
    '/google-arcade',
    '/unstop/subarray-sum-equals-k',
    '/c-academy',
    '/arcade-calculator',
    '/opportunities',
    '/blogs/c-programming-under-the-hood',
    '/swags',
  ];

  if (timeframe === 'today') {
    // 8 Time buckets throughout today
    const hours = [0, 3, 6, 9, 12, 15, 18, 21];
    hours.forEach((hour) => {
      const d = new Date(now);
      d.setHours(hour, 0, 0, 0);
      const isPast = hour <= now.getHours();
      const baseVisitors = isPast ? Math.round(180 + Math.sin(hour / 3) * 120 + (hour >= 18 ? 160 : 60)) : 0;
      const visitors = Math.max(25, baseVisitors);
      const pageViews = Math.round(visitors * 3.2);
      const newUsers = Math.round(visitors * 0.42);
      const youtubeClicks = Math.round(visitors * 0.14);

      const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
      points.push({
        id: `today-${hour}`,
        dateLabel: hourLabel,
        fullDate: `Today at ${hourLabel} (${formatRealDate(now)})`,
        isoDate: d.toISOString(),
        visitors,
        pageViews,
        newUsers,
        youtubeClicks,
        topPage: topPagesList[hour % topPagesList.length],
        deviceSplit: {
          mobile: Math.round(visitors * 0.68),
          desktop: Math.round(visitors * 0.28),
          tablet: Math.round(visitors * 0.04),
        },
      });
    });
  } else if (timeframe === '7d') {
    // 7 Consecutive Days ending today
    for (let i = 6; i >= 0; i--) {
      const targetDate = getDateDaysAgo(i);
      const isToday = i === 0;
      const baseV = 2100 + (6 - i) * 160 + (i === 1 || i === 2 ? 380 : 0);
      const visitors = Math.round(baseV);
      const pageViews = Math.round(visitors * 3.35);
      const newUsers = Math.round(visitors * 0.54);
      const youtubeClicks = Math.round(visitors * 0.125);

      points.push({
        id: `7d-${i}`,
        dateLabel: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: `${formatFullDate(targetDate)}${isToday ? ' (Today)' : ''}`,
        isoDate: formatLocalDateIso(targetDate),
        visitors,
        pageViews,
        newUsers,
        youtubeClicks,
        topPage: topPagesList[(i * 2) % topPagesList.length],
        deviceSplit: {
          mobile: Math.round(visitors * 0.68),
          desktop: Math.round(visitors * 0.28),
          tablet: Math.round(visitors * 0.04),
        },
      });
    }
  } else if (timeframe === '30d') {
    // 7 Sample intervals across the last 30 days ending today
    const intervals = [29, 24, 19, 14, 9, 4, 0];
    intervals.forEach((daysAgo, idx) => {
      const targetDate = getDateDaysAgo(daysAgo);
      const isToday = daysAgo === 0;
      // Realistic growth curve matching mockup ~ 48K total
      const curve = [4200, 5100, 5800, 6900, 7800, 8900, 9600];
      const visitors = curve[idx] || 6000;
      const pageViews = Math.round(visitors * 3.15);
      const newUsers = Math.round(visitors * 0.59);
      const youtubeClicks = Math.round(visitors * 0.132);

      points.push({
        id: `30d-${daysAgo}`,
        dateLabel: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: `${formatFullDate(targetDate)}${isToday ? ' (Today)' : ''}`,
        isoDate: formatLocalDateIso(targetDate),
        visitors,
        pageViews,
        newUsers,
        youtubeClicks,
        topPage: topPagesList[idx % topPagesList.length],
        deviceSplit: {
          mobile: Math.round(visitors * 0.68),
          desktop: Math.round(visitors * 0.28),
          tablet: Math.round(visitors * 0.04),
        },
      });
    });
  } else {
    // YTD: Last 6 months ending on current month
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mShort = d.toLocaleDateString('en-US', { month: 'short' });
      const fullLabel = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const visitors = 18000 + (5 - i) * 6200;
      points.push({
        id: `ytd-${mShort}`,
        dateLabel: mShort,
        fullDate: fullLabel,
        isoDate: formatLocalDateIso(d),
        visitors,
        pageViews: Math.round(visitors * 3.2),
        newUsers: Math.round(visitors * 0.58),
        youtubeClicks: Math.round(visitors * 0.13),
        topPage: topPagesList[(5 - i) % topPagesList.length],
        deviceSplit: {
          mobile: Math.round(visitors * 0.68),
          desktop: Math.round(visitors * 0.28),
          tablet: Math.round(visitors * 0.04),
        },
      });
    }
  }

  const totalVisitors = points.reduce((acc, p) => acc + p.visitors, 0);
  const totalPageViews = points.reduce((acc, p) => acc + p.pageViews, 0);
  const totalNewUsers = points.reduce((acc, p) => acc + p.newUsers, 0);
  const totalYoutubeClicks = points.reduce((acc, p) => acc + p.youtubeClicks, 0);

  return {
    points,
    summary: {
      totalVisitors,
      totalPageViews,
      totalNewUsers,
      totalYoutubeClicks,
      growthPercent: 12.4,
    },
  };
}
