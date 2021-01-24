import { promises as fs } from 'fs';

export interface PersistentData {
  lastUpdateId: number
  chats: { [id: number]: Product[] };
}

export interface Product {
  url: string;
  inStock?: boolean;
}

let persistent: PersistentData;

export async function loadPersistent(): Promise<PersistentData> {
  if (!persistent) {
    try {
      persistent = JSON.parse((await fs.readFile('./persistent.json')).toString());
    } catch {
      persistent = {
        lastUpdateId: 0,
        chats: {}
      };
    }
  }
  return persistent;
}

export async function savePersistent(data: PersistentData): Promise<void> {
  persistent = data;
  await fs.writeFile('./persistent.json', JSON.stringify(data));
}
