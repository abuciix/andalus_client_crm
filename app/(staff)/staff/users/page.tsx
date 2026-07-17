import Link from "next/link";
import { requireStaff } from "@/lib/session";
import { listUsers } from "@/lib/data/users";

export default async function UsersPage() {
  const session = await requireStaff();
  const users = await listUsers(session);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-brand text-2xl font-semibold">Users</h1>
        <Link
          href="/staff/users/new"
          className="border border-foreground px-4 py-2 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background"
        >
          Add client
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-line border-y border-line">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-sm">{user.name}</div>
              <div className="text-sm text-muted">{user.email}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-meta text-[10px] uppercase tracking-wide text-muted">{user.role}</span>
              {user.role === "CLIENT" && (
                <span className="font-meta text-[10px] uppercase tracking-wide text-muted">
                  {user.inviteStatus ?? ""}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
