"use client";

import { useRef, useTransition } from "react";
import { postMessageAction } from "@/lib/actions/messages";

type MessageItem = {
  id: string;
  body: string;
  createdAt: Date;
  sender: { name: string; role: string };
};

export function MessageThread({ projectId, messages }: { projectId: string; messages: MessageItem[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto border border-line p-4">
        {messages.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-meta text-[10px] uppercase tracking-wide text-muted mr-2">
              {m.sender.name}
            </span>
            <span>{m.body}</span>
          </div>
        ))}
      </div>
      <form
        ref={formRef}
        action={(formData) => {
          startTransition(async () => {
            await postMessageAction(projectId, formData);
            formRef.current?.reset();
          });
        }}
        className="flex gap-2"
      >
        <input
          name="body"
          required
          placeholder="Write a message…"
          className="flex-1 border border-line px-3 py-2 focus:outline-none focus:border-foreground"
        />
        <button
          type="submit"
          disabled={isPending}
          className="border border-foreground px-4 py-2 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
