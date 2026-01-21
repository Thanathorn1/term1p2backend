import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';

// ===== ของเดิม =====
export async function safeUnlinkByRelativePath(relativePath: string) {
  if (!relativePath) return;

  const normalized = path
    .normalize(relativePath)
    .replace(/^(\.\.(\/|\\|$))+/, '');

  try {
    await fsPromises.unlink(normalized);
  } catch (err: any) {
    if (err?.code !== 'ENOENT') throw err;
  }
}

// ===== เพิ่มใหม่ =====
export function deleteFileIfExists(relativePath?: string) {
  if (!relativePath) return;

  const fullPath = path.join(process.cwd(), 'uploads', relativePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}
