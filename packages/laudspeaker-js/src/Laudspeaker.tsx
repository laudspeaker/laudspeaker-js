import { Socket, io } from 'socket.io-client';
import EventEmitter from './EventEmitter';
import { Root, createRoot } from 'react-dom/client';
import { Modal } from './components/Modal';
import { ModalState } from './types';
import React from 'react';
import { renderPreviewModal } from './helpers/preview';

interface InitOptions {
  apiHost?: string;
}

type PossibleEvent =
  | 'connect'
  | 'disconnect'
  | 'log'
  | 'error'
  | 'customerId'
  | 'modal'
  | 'custom';

export class Laudspeaker extends EventEmitter<PossibleEvent> {
  private host = 'https://laudspeaker.com';
  private socket?: Socket;
  private apiKey?: string;
  private readonly rootDiv = document.createElement('div');
  private _reactRoot: Root;
  public renderPreviewModal = renderPreviewModal;

  constructor() {
    // for debugging and logging
    localStorage.debug = '*';
    super();

    document.body.appendChild(this.rootDiv);
    this._reactRoot = createRoot(this.rootDiv);
  }

  public init(laudspeakerApiKey: string, options?: InitOptions) {
    this.apiKey = laudspeakerApiKey;

    if (options?.apiHost) this.host = options.apiHost;

    if (this.socket?.io._readyState === 'open') this.socket.close();

    this.socket = io(this.host, {
      auth: {
        apiKey: laudspeakerApiKey,
        customerId: localStorage.getItem('customerId'),
      },
    });

    this.socket
      .on('connect', () => {
        console.log('Connected to laudspeaker API websocket gateway');
        this.updateModalState();
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
        this.updateModalState();
        this.emit('customerId');
      })
      .on('modal', (modalState: ModalState) => {
        this._renderModalState(modalState);
        this.emit('modal');
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

  public async updateModalState() {
    try {
      const modalState = await this._retrieveModalState();
      if (!modalState) return;

      this._renderModalState(modalState);
    } catch (e) {
      console.error(e);
    }
  }

  private async _retrieveModalState(): Promise<ModalState> {
    try {
      const res = await fetch(
        this.host + '/modals/' + localStorage.getItem('customerId'),
        {
          headers: {
            Authorization: `Api-Key ${this.apiKey}`,
          },
        }
      );

      if (!res.ok) throw new Error('Error while retrieving modal state');

      const modalState = (await res.json()) as ModalState;
      return modalState;
    } catch (e) {
      throw 'Error while retrieving modal state: ' + e;
    }
  }

  public _renderModalState(modalState: ModalState) {
    this._reactRoot.unmount();
    this._reactRoot = createRoot(this.rootDiv);
    this._reactRoot.render(<Modal modalState={modalState} />);
  }
}
