import { promises as fs } from 'fs';

export async function readFile(path: string): Promise<string[]> {
  const content = await fs.readFile(path, { encoding: 'utf8' });
  return content.trim().split('\r\n');
}
