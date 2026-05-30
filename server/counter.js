import { Redis } from '@upstash/redis';

const TOTAL_KEY = 'portfolio_visits';
const DAILY_PREFIX = 'portfolio_visits:day:';
const SOURCE_KEY = 'portfolio_visits:sources';
const HISTORY_DAYS = 60;
const SOURCE_BUCKETS = ['direct', 'github', 'linkedin', 'search', 'internal', 'other'];

function toUtcDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getDateKeys(days, endDate = new Date()) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(endDate);
    date.setUTCDate(date.getUTCDate() - (days - 1 - index));
    return toUtcDateKey(date);
  });
}

function safeUrl(value) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function normalizeHost(value) {
  return (value ?? '').replace(/^www\./, '').toLowerCase();
}

function classifyReferrer(referrer, host) {
  const parsedReferrer = safeUrl(referrer);

  if (!parsedReferrer) {
    return 'direct';
  }

  const referrerHost = normalizeHost(parsedReferrer.hostname);
  const currentHost = normalizeHost(host);

  if (currentHost && referrerHost === currentHost) {
    return 'internal';
  }

  if (referrerHost.includes('github.com')) {
    return 'github';
  }

  if (referrerHost.includes('linkedin.com')) {
    return 'linkedin';
  }

  if (
    referrerHost.includes('google.') ||
    referrerHost.includes('bing.com') ||
    referrerHost.includes('duckduckgo.com') ||
    referrerHost.includes('yahoo.com') ||
    referrerHost.includes('baidu.com')
  ) {
    return 'search';
  }

  return 'other';
}

function toNumber(value) {
  return Number(value ?? 0) || 0;
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function percentageChange(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }

  return ((current - previous) / previous) * 100;
}

function buildTrend(current, previous) {
  const changePct = percentageChange(current, previous);

  return {
    current,
    previous,
    changePct,
  };
}

function buildReferrerStats(sourceCounts) {
  return SOURCE_BUCKETS.map((bucket) => ({
    source: bucket,
    count: toNumber(sourceCounts[bucket]),
  })).filter((item) => item.count > 0).sort((left, right) => right.count - left.count);
}

export function getEnv(source = globalThis.process?.env ?? {}) {
  return {
    url: source.UPSTASH_REDIS_REST_URL ?? source.KV_REST_API_URL,
    token: source.UPSTASH_REDIS_REST_TOKEN ?? source.KV_REST_API_TOKEN,
  };
}

export async function incrementVisits(source = globalThis.process?.env ?? {}, options = {}) {
  const { url, token } = getEnv(source);
  const referrerBucket = classifyReferrer(options.referrer, options.host);

  if (!url || !token) {
    throw new Error('Missing Upstash Redis configuration');
  }

  const redis = new Redis({ url, token });

  const totalPromise = redis.incr(TOTAL_KEY);
  const dailyKey = `${DAILY_PREFIX}${toUtcDateKey(options.now ?? new Date())}`;
  const dailyIncrementPromise = redis.incr(dailyKey);
  const sourceIncrementPromise = redis.hincrby(SOURCE_KEY, referrerBucket, 1);

  const [total] = await Promise.all([totalPromise, dailyIncrementPromise, sourceIncrementPromise]);

  const dayKeys = getDateKeys(HISTORY_DAYS, options.now ?? new Date()).map((dateKey) => `${DAILY_PREFIX}${dateKey}`);
  const dailyValues = await redis.mget(...dayKeys);
  const counts = dailyValues.map((value) => toNumber(value));
  const sourceCounts = await redis.hgetall(SOURCE_KEY);

  const weekly = buildTrend(sum(counts.slice(-7)), sum(counts.slice(-14, -7)));
  const monthly = buildTrend(sum(counts.slice(-30)), sum(counts.slice(-60, -30)));

  return {
    total: toNumber(total),
    weekly,
    monthly,
    sparkline: counts.slice(-14),
    referrers: buildReferrerStats(sourceCounts),
  };
}

export const __counterInternals = {
  classifyReferrer,
  getDateKeys,
  percentageChange,
};
