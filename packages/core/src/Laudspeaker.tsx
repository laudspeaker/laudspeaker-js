import * as Sentry from '@sentry/browser';
import { CaptureConsole, HttpClient } from '@sentry/integrations';
import { Socket, io } from 'socket.io-client';
import EventEmitter from './EventEmitter';
import { sha256 } from 'js-sha256';
import { Buffer } from 'buffer';

Sentry.init({
  dsn: 'https://2444369e8e13b39377ba90663ae552d1@o4506038702964736.ingest.sentry.io/4506038705192960',

  // Alternatively, use `process.env.npm_package_version` for a dynamic release version
  // if your build tool supports it.
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
    new CaptureConsole({ levels: ['error'] }),
    new HttpClient(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  sendDefaultPii: true,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/laudspeaker\.com\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

interface InitOptions {
  apiHost?: string;
  development?: boolean;
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
  protected development?: boolean;
  private blockList: Record<string, boolean>;

  constructor(protected storage: LaudspeakerStorage) {
    super();
    // for debugging and logging
    this.storage.setItem('debug', '*');
    this.blockList = {};
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

    setTimeout(() => {
      delete es[base64];
    }, 2000);
    return true;
  }

  private async removeProcessedTrackerHash(hash: string) {
    const es = await this.getEventStorageData();

    if (!es[hash]) delete es[hash];

    await this.storage.setItem('eventsStore', JSON.stringify(es));
  }

  public async init(laudspeakerApiKey: string, options?: InitOptions) {
    await this.storage.setItem('eventsStore', '{}');

    this.apiKey = laudspeakerApiKey;
    this.development = !!options?.development;

    if (options?.apiHost) this.host = options.apiHost;

    if (this.socket?.io._readyState === 'open') this.socket.close();

    this.socket = io(this.host, {
      auth: {
        apiKey: laudspeakerApiKey,
        customerId: await this.storage.getItem('customerId'),
        development: this.development,
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

  public async emitCustomComponents(trackerId: string, event: string) {
    if (!this.socket?.connected) {
      console.error(
        'Impossible to send custom component event: no connection to API. Try to init connection first'
      );
      return;
    }

    if (this.blockList[trackerId + event]) return;

    this.blockList[trackerId + event] = true;

    const id = await this.storage.getItem('customerId');
    const result = await this.addTrackerHash(event + trackerId + id);

    if (result) this.socket.emit('custom', { trackerId, event });

    delete this.blockList[trackerId + event];
  }
}
