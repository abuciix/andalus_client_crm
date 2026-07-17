import { getUserByInviteToken } from "@/lib/data/users";
import { AcceptInviteForm } from "./AcceptInviteForm";

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await getUserByInviteToken(token);

  if (!user || user.inviteStatus !== "PENDING") {
    return (
      <div className="mx-auto max-w-sm px-6 py-24">
        <h1 className="font-brand text-2xl font-semibold mb-2">Invite not found</h1>
        <p className="text-muted">This invite link is invalid or has already been used.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-brand text-2xl font-semibold mb-1">Welcome, {user.name}</h1>
      <p className="text-sm text-muted mb-8">Set a password to access your project portal.</p>
      <AcceptInviteForm token={token} />
    </div>
  );
}
