// STUB — no real WhatsApp Business API wired up yet. Replace with a real client
// (e.g. Twilio, Meta Cloud API) when credentials are available. Call sites are real.
export async function notifyWhatsApp(userId: string, message: string) {
  console.log(`[whatsapp stub] -> user ${userId}: ${message}`);
  return { ok: true as const, stub: true as const };
}
