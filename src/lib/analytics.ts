// Anti-spam cooldown map: tracks last execution timestamp per event key
const cooldownMap = new Map<string, number>();
const COOLDOWN_MS = 2500;

interface GeoInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  isp: string;
}

// In-memory cache for IP geo info to avoid redundant lookup calls
let cachedGeoInfo: GeoInfo | null = null;

async function getVisitorGeo(): Promise<GeoInfo> {
  if (cachedGeoInfo) {
    return cachedGeoInfo;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      cachedGeoInfo = {
        ip: data.ip || 'Unknown',
        city: data.city || '',
        region: data.region || '',
        country: data.country_name || '',
        isp: data.org || data.asn || 'Unknown',
      };
      return cachedGeoInfo;
    }
  } catch {
    // Graceful fallback if offline or blocked by ad-blocker
  }

  return {
    ip: 'Unknown',
    city: '',
    region: '',
    country: '',
    isp: 'Unknown',
  };
}

function parseUserAgent(ua: string) {
  let browser = 'Unknown';
  let os = 'Unknown';
  let deviceType = 'Desktop';

  if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/')) browser = 'Safari';
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  if (/Mobi|Android|iPhone|iPad/i.test(ua) || (typeof window !== 'undefined' && window.innerWidth < 768)) {
    deviceType = 'Mobile';
  }

  return { browser, os, deviceType };
}

export async function trackEvent(
  eventType: string,
  details?: string,
  userDisplayName?: string | null,
  userEmail?: string | null
) {
  // Single source of truth: only send if NEXT_PUBLIC_ENABLE_TELEGRAM_NOTIFY is explicitly 'true'. Default: false.
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_TELEGRAM_NOTIFY === 'true';

  if (!isEnabled) {
    return;
  }

  // Anti-spam cooldown check (2.5s window per action key)
  const eventKey = `${eventType}:${details || ''}`;
  const now = Date.now();
  const lastFired = cooldownMap.get(eventKey);

  if (lastFired && now - lastFired < COOLDOWN_MS) {
    return; // Suppress rapid duplicate triggers
  }

  cooldownMap.set(eventKey, now);

  try {
    const isClient = typeof window !== 'undefined';
    const ua = isClient ? navigator.userAgent : '';
    const { browser, os, deviceType } = parseUserAgent(ua);
    const geo = isClient ? await getVisitorGeo() : { ip: 'Unknown', city: '', region: '', country: '', isp: 'Unknown' };

    const locationGeoStr = [geo.city, geo.region, geo.country].filter(Boolean).join(', ') || 'Unknown Location';

    const payload = {
      eventType,
      details: details || null,
      userDisplayName: userDisplayName || null,
      userEmail: userEmail || null,
      browser,
      os,
      deviceType,
      screen: isClient ? `${window.screen?.width || 0}x${window.screen?.height || 0}` : 'Unknown',
      language: isClient ? navigator.language || 'en-US' : 'en-US',
      page: isClient ? window.location.pathname : '/',
      referrer: isClient ? document.referrer || 'Direct / Bookmark' : 'Direct / Bookmark',
      ip: geo.ip,
      geo: locationGeoStr,
      isp: geo.isp,
      time: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
    };

    // Non-blocking fire-and-forget fetch to backend notification API
    fetch('/api/telegram/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn('Telegram notify request failed silently:', err);
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

