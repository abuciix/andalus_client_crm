import { VerifyDocumentButton } from "@/app/(staff)/staff/projects/[projectId]/documents/DocumentActions";

type DocumentItem = {
  id: string;
  type: string;
  version: number;
  status: string;
  fileName: string;
  createdAt: Date;
};

export function DocumentViewer({
  documents,
  projectId,
  role,
}: {
  documents: DocumentItem[];
  projectId: string;
  role: "STAFF" | "CLIENT";
}) {
  const grouped = documents.reduce<Record<string, DocumentItem[]>>((acc, doc) => {
    (acc[doc.type] ??= []).push(doc);
    return acc;
  }, {});

  Object.values(grouped).forEach((versions) => versions.sort((a, b) => b.version - a.version));

  if (documents.length === 0) {
    return <p className="text-sm text-muted">No documents yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(grouped).map(([type, versions]) => (
        <div key={type}>
          <h3 className="font-medium mb-2">{type}</h3>
          <div className="flex flex-col divide-y divide-line border-y border-line">
            {versions.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-meta text-xs text-muted">v{doc.version}</span>
                  <a
                    href={`/api/documents/${doc.id}/download`}
                    className="hover:underline"
                  >
                    {doc.fileName}
                  </a>
                  <span
                    className={`font-meta text-[10px] uppercase tracking-wide px-1.5 py-0.5 border ${
                      doc.status === "VERIFIED" ? "border-green-700 text-green-700" : "border-line text-muted"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
                {role === "STAFF" && doc.status === "PENDING" && (
                  <VerifyDocumentButton documentId={doc.id} projectId={projectId} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
