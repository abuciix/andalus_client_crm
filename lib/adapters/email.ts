// STUB — no real email provider wired up yet (e.g. Resend, SES). Call sites are real.
export async function sendInviteEmail(user: { email: string; name: string; inviteToken: string }) {
  console.log(`[email stub] invite -> ${user.email} (${user.name}), token=${user.inviteToken}`);
  return { ok: true as const, stub: true as const };
}
