import { Root, createRoot } from 'react-dom/client';
import { Modal } from './components/Modal';
import { ModalState } from './types';
import React from 'react';
import { renderPreviewModal } from './helpers/preview';
import { Laudspeaker } from '@laudspeaker/core';

type PossibleModalEvent = 'modal';

export class LaudspeakerJS extends Laudspeaker<PossibleModalEvent> {
  private readonly rootDiv = document.createElement('div');
  private _reactRoot: Root;
  public renderPreviewModal = renderPreviewModal;

  constructor() {
    super(localStorage);

    document.body.appendChild(this.rootDiv);
    this._reactRoot = createRoot(this.rootDiv);
  }

  public async init(
    laudspeakerApiKey: string,
    // TODO: fix type
    options: { apiHost?: string; development?: boolean }
  ): Promise<void> {
    await super.init(laudspeakerApiKey, options);
    this.socket?.on('modal', (modalState) => {
      console.log(modalState);
      this._renderModalState(modalState as ModalState);
      this.emit('modal');
    });
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
      const customerId = await this.storage.getItem('customerId');

      const res = await fetch(this.host + '/modals/' + customerId, {
        headers: {
          Authorization: `Api-Key ${this.apiKey}`,
        },
      });

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
