import { Socket, io } from 'socket.io-client';
import EventEmitter from './EventEmitter';
import { sha256 } from 'js-sha256';
import { Buffer } from 'buffer';

interface InitOptions {
  apiHost?: string;
}

type PossibleEvent =
  | 'connect'
  | 'disconnect'
  | 'log'
  | 'error'
  | 'customerId'
  | 'custom';

export interface LaudspeakerStorage {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
}

export class Laudspeaker<E extends string = PossibleEvent> extends EventEmitter<
  PossibleEvent | E
> {
  protected host = 'https://laudspeaker.com';
  protected socket?: Socket;
  protected apiKey?: string;

  constructor(protected storage: LaudspeakerStorage) {
    super();
    // for debugging and logging
    this.storage.setItem('debug', '*');
  }

  private async getEventStorageData() {
    const es = await this.storage.getItem('eventsStore');
    let storageData;
    try {
      if (es) storageData = JSON.parse(es);
    } catch (e) {
      await this.storage.setItem('eventsStore', '{}');
      return {};
    }

    return storageData;
  }

  private async addTrackerHash(value: string) {
    const es = await this.getEventStorageData();

    const base64 = Buffer.from(sha256.create().update(value).hex()).toString(
      'base64'
    );

    if (es[base64] === false) {
      console.warn(
        `Event ${base64} has not been yet finished please be patient.`
      );
      return false;
    }

    es[base64] = false;
    await this.storage.setItem('eventsStore', JSON.stringify(es));
    return true;
  }

  private async removeProcessedTrackerHash(hash: string) {
    const es = await this.getEventStorageData();

    if (es[hash]) delete es[hash];

    await this.storage.setItem('eventsStore', JSON.stringify(es));
  }

  public async init(laudspeakerApiKey: string, options?: InitOptions) {
    await this.storage.setItem('eventsStore', '{}');

    this.apiKey = laudspeakerApiKey;

    if (options?.apiHost) this.host = options.apiHost;

    if (this.socket?.io._readyState === 'open') this.socket.close();

    this.socket = io(this.host, {
      auth: {
        apiKey: laudspeakerApiKey,
        customerId: await this.storage.getItem('customerId'),
      },
    });

    this.socket
      .on('connect', () => {
        console.log('Connected to laudspeaker API websocket gateway');
        this.emit('connect');
      })
      .on('disconnect', () => {
        console.log('Disconnected from laudspeaker API websocket gateway');
        this.emit('disconnect');
      })
      .on('log', (message) => {
        console.log('[laudspeaker API]: ' + message);
        this.emit('log');
      })
      .on('error', (message) => {
        console.error('[laudspeaker API]: ' + message);
        this.emit('error');
      })
      .on('customerId', async (id) => {
        await this.storage.setItem('customerId', id);
        this.emit('customerId');
      })
      .on('custom', (payload: unknown) => {
        this.emit('custom', payload);
      })
      .on('processedEvent', async (eventHash) => {
        await this.removeProcessedTrackerHash(eventHash);
      });
  }

  public disconnect() {
    if (this.socket?.io._readyState === 'open') this.socket.close();
  }

  public identify(
    uniqueProperties: { [key: string]: unknown },
    optionalProperties?: { [key: string]: unknown }
  ) {
    if (!this.socket?.connected) {
      console.error(
        'Impossible to identify: no connection to API. Try to init connection first'
      );
      return;
    }

    this.socket.emit('identify', { uniqueProperties, optionalProperties });
  }

  public fire(event: { [key: string]: unknown }) {
    if (!this.socket?.connected) {
      console.error(
        'Impossible to fire: no connection to API. Try to init connection first'
      );
      return;
    }

    this.socket.emit('fire', event);
  }

  public ping() {
    if (!this.socket?.connected) {
      console.error(
        'Impossible to ping: no connection to API. Try to init connection first'
      );
      return;
    }

    this.socket.emit('ping');
  }

  public async emitTracker(trackerId: string, event: string) {
    if (!this.socket?.connected) {
      console.error(
        'Impossible to send tracker event: no connection to API. Try to init connection first'
      );
      return;
    }

    const id = await this.storage.getItem('customerId');
    const result = await this.addTrackerHash(event + trackerId + id);

    if (result) this.socket.emit('custom', { trackerId, event });
  }
}
