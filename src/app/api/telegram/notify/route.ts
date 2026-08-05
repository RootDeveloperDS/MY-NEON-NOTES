import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import { z } from 'zod';

const NotifySchema = z.object({
  eventType: z.string().max(255, "Event type too long"),
  details: z.string().max(5000, "Details too long").optional().nullable(),
  userDisplayName: z.string().max(255, "Display name too long").optional().nullable(),
  userEmail: z.string().max(255, "Email too long").optional().nullable(),
});

function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const parseResult = NotifySchema.safeParse(rawBody);

    if (!parseResult.success) {
      console.warn("Invalid telegram notification payload:", parseResult.error);
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const { eventType, details, userDisplayName, userEmail } = parseResult.data;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      // If tokens are missing, just silently return so it doesn't break the app
      console.warn("Telegram bot token or chat ID is missing.");
      return NextResponse.json({ success: false, error: "Missing config" }, { status: 200 });
    }

    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss 'UTC'");
    const userDisplay = escapeHtml(userDisplayName) || 'Anonymous';
    const emailHtml = userEmail ? `\n📧 <b>Email:</b> ${escapeHtml(userEmail)}` : '';
    const detailsHtml = details ? `\n🔗 <b>Details:</b> ${escapeHtml(details)}` : '';

    const message = `⚡ <b>NEON NOTES ANALYTICS</b> ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 <b>Event:</b> ${escapeHtml(eventType)}
👤 <b>User:</b> ${userDisplay}${emailHtml}${detailsHtml}
🕒 <b>Time:</b> ${timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // We intentionally don't await this if we want it to be fire-and-forget, 
    // but Next.js edge/serverless functions might terminate if we don't await.
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
      console.error("Failed to send telegram notification:", await response.text());
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending telegram notification:", error);
    // Never fail the request for the client
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
