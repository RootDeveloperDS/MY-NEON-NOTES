export async function trackEvent(eventType: string, details?: string, userDisplayName?: string | null, userEmail?: string | null) {
  // Check if analytics is enabled via env flag (to prevent dev spam)
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_TELEGRAM_ANALYTICS === 'true';
  
  if (!isEnabled) {
    return;
  }

  try {
    // Fire and forget
    fetch('/api/telegram/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        details,
        userDisplayName,
        userEmail,
      }),
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}
