import { Socket, io } from 'socket.io-client';
import EventEmitter from './EventEmitter';

interface InitOptions {
  apiHost?: string;
}

type PossibleEvent = 'connect' | 'disconnect' | 'log' | 'error' | 'customerId';

export default class Laudspeaker extends EventEmitter<PossibleEvent> {
  private host = 'https://laudspeaker.com';
  private socket?: Socket;
  private apiKey?: string;

  constructor() {
    // for debugging and logging
    localStorage.debug = '*';
    super();
  }

  public init(laudspeakerApiKey: string, options?: InitOptions) {
    this.apiKey = laudspeakerApiKey;

    if (options.apiHost) this.host = options.apiHost;

    if (this.socket) this.socket.close();

    this.socket = io(this.host, {
      auth: {
        apiKey: laudspeakerApiKey,
        customerId: localStorage.getItem('customerId'),
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
      .on('customerId', (id) => {
        localStorage.setItem('customerId', id);
        this.emit('customerId');
      });
  }

  public identify(
    uniqueProperties: { [key: string]: unknown },
    optionalProperties?: { [key: string]: unknown }
  ) {
    if (!this.socket) {
      console.error(
        'Impossible to identify: no connection to API. Try to init connection first'
      );
      return;
    }

    this.socket.emit('identify', { uniqueProperties, optionalProperties });
  }

  public fire(event: { [key: string]: unknown }) {
    if (!this.socket) {
      console.error(
        'Impossible to fire: no connection to API. Try to init connection first'
      );
      return;
    }

    this.socket.emit('fire', event);
  }

  public ping() {
    this.socket.emit('ping');
  }
}
