import { notFound } from "next/navigation";

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  // Deferred: no article content model exists yet.
  notFound();
}
