/**
 * Google Analytics 4 Data API Helper
 * 
 * 使用方式（server-side only，static export 時需在 build 時執行或在 API route 中呼叫）：
 * - 靜態匯出網站無法在 client-side 呼叫 GA4 API
 * - 建議在建構時產生快報資料，或由小賀定期執行並更新 JSON 資料
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA4_PROPERTY_ID?.replace('properties/', '') || '';
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient {
  if (!analyticsDataClient) {
    analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: credentialsPath,
    });
  }
  return analyticsDataClient;
}

export interface GA4Overview {
  totalUsers: number;
  sessions: number;
  pageViews: number;
  avgSessionDuration: string;
  topPages: { path: string; views: number }[];
  topSources: { source: string; users: number }[];
  dateRange: string;
}

export async function getOverview(days: number = 30): Promise<GA4Overview> {
  const client = getClient();
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    metrics: [
      { name: 'totalUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
    ],
    dimensions: [{ name: 'date' }],
  });

  const rows = response.rows || [];
  let totalUsers = 0, sessions = 0, pageViews = 0, totalDuration = 0;
  
  for (const row of rows) {
    totalUsers += parseInt(row.metricValues?.[0]?.value || '0');
    sessions += parseInt(row.metricValues?.[1]?.value || '0');
    pageViews += parseInt(row.metricValues?.[2]?.value || '0');
    totalDuration += parseFloat(row.metricValues?.[3]?.value || '0');
  }

  // 熱門頁面
  const [pagesResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    metrics: [{ name: 'screenPageViews' }],
    dimensions: [{ name: 'pagePath' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  });

  const topPages = (pagesResponse.rows || []).map(row => ({
    path: row.dimensionValues?.[0]?.value || '',
    views: parseInt(row.metricValues?.[0]?.value || '0'),
  }));

  // 流量來源
  const [sourcesResponse] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    metrics: [{ name: 'totalUsers' }],
    dimensions: [{ name: 'sessionSource' }],
    orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    limit: 10,
  });

  const topSources = (sourcesResponse.rows || []).map(row => ({
    source: row.dimensionValues?.[0]?.value || '(direct)',
    users: parseInt(row.metricValues?.[0]?.value || '0'),
  }));

  return {
    totalUsers,
    sessions,
    pageViews,
    avgSessionDuration: sessions > 0 ? `${Math.round(totalDuration / sessions)}s` : '0s',
    topPages,
    topSources,
    dateRange: `最近 ${days} 天`,
  };
}

export async function getRealtimeUsers(): Promise<number> {
  const client = getClient();
  const [response] = await client.runRealtimeReport({
    property: `properties/${propertyId}`,
    metrics: [{ name: 'activeUsers' }],
  });
  return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0');
}
