import React from 'react';
import { Modal } from '../components/Modal';
import { ModalState } from '../types';

const renderPreviewModal = (modalState: ModalState) => {
  return <Modal modalState={modalState} />;
};
export { renderPreviewModal };
