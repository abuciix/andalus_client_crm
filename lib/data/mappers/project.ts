import type {
  Document,
  Invoice,
  Message,
  Project,
  Task,
  TaskChecklistItem,
  User,
} from "@/app/generated/prisma/client";
import { toClientDocumentView, toStaffDocumentView } from "./document";
import { toClientInvoiceView, toStaffInvoiceView } from "./invoice";
import { toClientTaskView, toStaffTaskView } from "./task";

export type ProjectWithRelations = Project & {
  documents: Document[];
  invoices: Invoice[];
  tasks: (Task & { checklistItems: TaskChecklistItem[] })[];
  messages: (Message & { sender: User })[];
  client?: User | null;
  staff?: User | null;
};

// Deliberately an allowlist: new sensitive fields added to Project later are hidden
// from clients by default unless explicitly added here.
export function toClientProjectView(p: ProjectWithRelations) {
  return {
    id: p.id,
    title: p.title,
    stage: p.stage,
    city: p.city,
    createdAt: p.createdAt,
    documents: p.documents.map(toClientDocumentView),
    invoices: p.invoices.map(toClientInvoiceView),
    tasks: p.tasks.map(toClientTaskView),
    messages: p.messages,
    // deliberately omitted: notes, contactName/Email/Phone, staffId, clientId, staff relation
  };
}

export function toStaffProjectView(p: ProjectWithRelations) {
  return {
    ...p,
    documents: p.documents.map(toStaffDocumentView),
    invoices: p.invoices.map(toStaffInvoiceView),
    tasks: p.tasks.map(toStaffTaskView),
  };
}

export function toStaffProjectListItem(p: Project) {
  return p;
}
