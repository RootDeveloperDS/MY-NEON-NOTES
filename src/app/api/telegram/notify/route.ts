import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import { z } from 'zod';

const NotifySchema = z.object({
  eventType: z.string().max(255, 'Event type too long'),
  details: z.string().max(5000, 'Details too long').optional().nullable(),
  userDisplayName: z.string().max(255, 'Display name too long').optional().nullable(),
  userEmail: z.string().max(255, 'Email too long').optional().nullable(),
  browser: z.string().max(255).optional().nullable(),
  os: z.string().max(255).optional().nullable(),
  deviceType: z.string().max(255).optional().nullable(),
  screen: z.string().max(255).optional().nullable(),
  language: z.string().max(255).optional().nullable(),
  page: z.string().max(255).optional().nullable(),
  referrer: z.string().max(255).optional().nullable(),
  ip: z.string().max(255).optional().nullable(),
  geo: z.string().max(255).optional().nullable(),
  isp: z.string().max(255).optional().nullable(),
  time: z.string().max(255).optional().nullable(),
});

function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const parseResult = NotifySchema.safeParse(rawBody);

    if (!parseResult.success) {
      console.warn('Invalid telegram notification payload:', parseResult.error);
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const {
      eventType,
      details,
      userDisplayName,
      userEmail,
      browser,
      os,
      deviceType,
      screen,
      language,
      page,
      referrer,
      ip,
      geo,
      isp,
      time,
    } = parseResult.data;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const isEnabled = process.env.NEXT_PUBLIC_ENABLE_TELEGRAM_NOTIFY === 'true';

    if (!isEnabled || !botToken || !chatId) {
      console.warn('Telegram notifications are disabled or missing bot token/chat ID.');
      return NextResponse.json({ success: false, error: 'Notifications disabled or missing config' }, { status: 200 });
    }

    const headerIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip');
    // Prioritize server-detected header IP over client-provided IP to prevent spoofing
    const finalIp = headerIp || (ip && ip !== 'Unknown' ? ip : 'Unknown');

    const timestamp = time || format(new Date(), "M/d/yyyy, h:mm:ss a 'UTC'");
    const userDisplay = escapeHtml(userDisplayName) || 'Anonymous';
    const emailStr = userEmail ? ` (${escapeHtml(userEmail)})` : '';
    const detailsHtml = details
      ? `\n📋 <b>Details:</b>\n  • <b>Info:</b> ${escapeHtml(details)}`
      : '';

    const message = `🚀 <b>[MY NEON NOTES] — Action Alert</b>

⚡ <b>Action:</b> ${escapeHtml(eventType)}${detailsHtml}

👤 <b>Visitor Metadata:</b>
  • <b>User:</b> ${userDisplay}${emailStr}
  • <b>Device:</b> ${escapeHtml(browser || 'Unknown')} on ${escapeHtml(os || 'Unknown')} (${escapeHtml(deviceType || 'Desktop')})
  • <b>Screen:</b> ${escapeHtml(screen || 'Unknown')}
  • <b>Language:</b> ${escapeHtml(language || 'en-US')}
  • <b>Page:</b> ${escapeHtml(page || '/')}
  • <b>Referrer:</b> ${escapeHtml(referrer || 'Direct / Bookmark')}
  • <b>IP:</b> ${escapeHtml(finalIp)} (${escapeHtml(geo || 'Unknown Location')})
  • <b>ISP / Org:</b> ${escapeHtml(isp || 'Unknown')}
  • <b>Time:</b> ${escapeHtml(timestamp)}`;

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send telegram notification:', await response.text());
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending telegram notification:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

