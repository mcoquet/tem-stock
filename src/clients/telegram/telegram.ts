import { getStringConfig, setConfigEnvironment } from './configuration';
import { get, post } from './http';
import { loadPersistent, PersistentData, savePersistent } from './persistent';
import { GetUpdates, Message, SendMessage, Update } from './telegram.models';

export async function processUpdates(): Promise<void> {
  console.log('processUpdates');

  const res = await get<GetUpdates>('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/getUpdates`);
  const db = await loadPersistent();

  // console.log(JSON.stringify(res));

  for (const update of res.result) {
    if (db.lastUpdateId < update.update_id && update.message) {
      await processUpdate(update, db);
    }
  }

  db.lastUpdateId = res.result[res.result.length - 1].update_id;
  savePersistent(db);
}

export async function processUpdate(update: Update, db: PersistentData): Promise<void> {
  console.log('processUpdate');

  if (update.message.text === '/products') {
    reply(update.message, JSON.stringify(db.chats[update.message.chat.id].map(p => p.url)));

  } else if (update.message.text.startsWith('/setprocuts')) {
    console.log('setprocuts');

    const json = update.message.text.replace('/setprocuts ', '');

    try {
      const arr = JSON.parse(json);
      if (Array.isArray(arr)) {
        db.chats[update.message.chat.id] = arr.map(url => ({ url }));
        reply(update.message, 'Products list has been updated');
      } else {
        reply(update.message, 'The products list must be a valid JSON array of strings');
      }
    } catch (e) {
      reply(update.message, 'The products list must be a valid JSON array of strings. Exception: ' + e);
    }

  } else {
    reply(update.message, 'Unknown command');
  }
}

export async function reply(message: Message, text: string): Promise<void> {

  const body: SendMessage = {
    chat_id: message.chat.id,
    text,
    reply_to_message_id: message.message_id
  }

  console.log('body', body);

  await sendMessage(body);
}

export async function sendMessage(body: SendMessage): Promise<void> {
  const res = await post('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/sendMessage`, body);
  console.log(res);
}

export async function share(): Promise<void> {

  try {
    const a = await get<any>('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/getMyCommands`);
    console.log(a);
  } catch (e) { console.log('eee', e) }

  // try {
  //   const a = await get<any>('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/getUpdates`);
  //   console.log(JSON.stringify(a));
  // } catch (e) { console.log('eee', e) }
}

setConfigEnvironment('local');

setInterval(() => processUpdates(), 3000);


