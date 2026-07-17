import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads");

export async function saveUploadedFile(
  file: File,
  subdir: string
): Promise<{ storageKey: string }> {
  const dir = path.join(UPLOAD_ROOT, subdir);
  await mkdir(dir, { recursive: true });

  const ext = path.extname(file.name);
  const filename = `${randomUUID()}${ext}`;
  const storageKey = path.posix.join(subdir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_ROOT, subdir, filename), buffer);

  return { storageKey };
}

export async function readUploadedFile(storageKey: string): Promise<Buffer> {
  const resolved = path.join(UPLOAD_ROOT, storageKey);
  if (!resolved.startsWith(UPLOAD_ROOT)) {
    throw new Error("Invalid storage key");
  }
  return readFile(resolved);
}
