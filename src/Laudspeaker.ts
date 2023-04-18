import { Socket, io } from 'socket.io-client';

interface InitOptions {
  apiHost?: string;
}

export default class Laudspeaker {
  private host = 'https://laudspeaker.com';
  private socket?: Socket;
  private apiKey?: string;

  constructor() {
    // for debugging and logging
    localStorage.debug = '*';
  }

  public init(laudspeakerApiKey: string, options?: InitOptions) {
    this.apiKey = laudspeakerApiKey;

    if (options.apiHost) this.host = options.apiHost;

    if (this.socket) this.socket.close();

    this.socket = io(this.host, {
      auth: { apiKey: laudspeakerApiKey },
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to laudspeaker API websocket gateway');
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected from laudspeaker API websocket gateway');
    });
    this.socket.on('log', (message) =>
      console.log('[laudspeaker API]: ' + message)
    );
    this.socket.on('error', (message) => {
      console.error('[laudspeaker API]: ' + message);
    });
    this.socket.on('cookie', (cookieId) => {
      fetch(`${this.host}/cookies/set/${cookieId}`, {
        credentials: 'same-origin',
      });
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

  public fire(event: string, payload: { [key: string]: unknown }) {
    if (!this.socket) {
      console.error(
        'Impossible to fire: no connection to API. Try to init connection first'
      );
      return;
    }

    this.socket.emit('fire', { event, payload });
  }

  public ping() {
    this.socket.emit('ping');
  }
}
