import { Socket, io } from 'socket.io-client';
import EventEmitter from './EventEmitter';

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

  public async init(laudspeakerApiKey: string, options?: InitOptions) {
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

  public emitTracker(trackerId: string, event: string) {
    if (!this.socket?.connected) {
      console.error(
        'Impossible to send tracker event: no connection to API. Try to init connection first'
      );
      return;
    }

    this.socket.emit('custom', { trackerId, event });
  }
}
