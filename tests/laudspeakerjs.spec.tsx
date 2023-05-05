import React from 'react';
import laudspeakerjs from '../dist';
import mockModalState from './fixtures/mockModalState';
import { cleanup, render, screen, within } from '@testing-library/react';
import {
  Modal,
  alignmentStyleMap,
  dismissPositionMap,
  mediaPositionMap,
  modalPositionMap,
  primaryButtomPositionMap,
} from '../src/components/Modal';
import fromReactToDOMStyles from './utils/fromReactToDOMStyles';
import { BackgroundType, PrimaryButtonPosition, SizeUnit } from '../src/types';
import ReactMarkdown from 'react-markdown';

describe('laudspeakerjs - general', () => {
  test('document body is present', () => {
    expect(document.body).toBeDefined();
  });

  test('laudspeakerjs is defined', () => {
    expect(laudspeakerjs).toBeDefined();
    expect(typeof laudspeakerjs).toStrictEqual('object');
  });

  test('renderPreviewModal is defined', () => {
    expect(laudspeakerjs.renderPreviewModal).toBeDefined();
    expect(typeof laudspeakerjs.renderPreviewModal).toStrictEqual('function');
  });
});

describe('laudspeakerjs - modal renderer', () => {
  beforeEach(() => {
    render(<Modal modalState={mockModalState} />);
  });

  afterEach(() => {
    cleanup();
  });

  test('renders iframe correctly', () => {
    const iframe = screen.getByTestId('laudspeaker-modal-iframe');

    expect(iframe).toHaveStyle({
      width: '100vw',
      minHeight: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 2147483647,
      display: 'block',
    });
  });

  test('renders shroud correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const shroudWrapper = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-shroud-wrapper'
    );

    expect(shroudWrapper).toHaveStyle(
      fromReactToDOMStyles({
        ...modalPositionMap[mockModalState.position],
        ...(mockModalState.shroud.hidden
          ? {}
          : {
              backgroundColor: `${mockModalState.shroud.color}${
                (mockModalState.shroud.opacity * 255).toString(16).split('.')[0]
              }`,
              // TODO: fix
              // backdropFilter: `blur(${mockModalState.shroud.blur}px)`,
            }),
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        zIndex: 2147483645,
        padding: '20px',
      })
    );
  });

  test('renders modal view correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalViewWrapper = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-view-wrapper'
    );

    const CanvasBackground: Record<BackgroundType, string> = {
      [BackgroundType.SOLID]: `${
        mockModalState.background[BackgroundType.SOLID].color
      }${
        (mockModalState.background[BackgroundType.SOLID].opacity * 255)
          .toString(16)
          .split('.')[0]
      }`,
      [BackgroundType.GRADIENT]: `linear-gradient(45deg, ${
        mockModalState.background[BackgroundType.GRADIENT].color1
      }${
        (mockModalState.background[BackgroundType.GRADIENT].opacity * 255)
          .toString(16)
          .split('.')[0]
      } 0%, ${mockModalState.background[BackgroundType.GRADIENT].color2}${
        (mockModalState.background[BackgroundType.GRADIENT].opacity * 255)
          .toString(16)
          .split('.')[0]
      }) 100%`,
      [BackgroundType.IMAGE]: `url(${
        mockModalState.background[BackgroundType.IMAGE].imageSrc
      })`,
    };

    expect(modalViewWrapper).toHaveStyle(
      fromReactToDOMStyles({
        top: `${mockModalState.yOffset.value}${
          mockModalState.yOffset.unit === SizeUnit.PERCENTAGE
            ? 'vw'
            : SizeUnit.PIXEL
        }`,
        left: `${mockModalState.xOffset.value}${
          mockModalState.xOffset.unit === SizeUnit.PERCENTAGE
            ? 'vw'
            : SizeUnit.PIXEL
        }`,
        width: `${mockModalState.width.value}${
          mockModalState.width.unit === SizeUnit.PERCENTAGE
            ? 'vw'
            : SizeUnit.PIXEL
        }`,
        borderRadius: `${mockModalState.borderRadius.value}${mockModalState.borderRadius.unit}`,
        background: CanvasBackground[mockModalState.background.selected],
        position: 'relative',
        padding: '18px',
      })
    );
  });

  test('renders dismiss wrapper correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalDismissWrapper = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-dismiss-wrapper'
    );

    expect(modalDismissWrapper).toHaveStyle(
      fromReactToDOMStyles({
        position: 'absolute',
        userSelect: 'none',
        cursor: 'pointer',
        ...dismissPositionMap[mockModalState.dismiss.position],
        ...(mockModalState.dismiss.hidden ? { display: 'none' } : {}),
        color: mockModalState.dismiss.color,
        fontSize: mockModalState.dismiss.textSize + 'px',
      })
    );
  });

  test('renders title wrapper correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalTitleWrapper = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-title-wrapper'
    );

    if (mockModalState.title.hidden)
      expect(modalTitleWrapper).toHaveStyle({ display: 'none' });
  });

  test('renders title correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalTitle = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-title'
    );

    expect(modalTitle).toHaveStyle(
      fromReactToDOMStyles({
        textAlign: alignmentStyleMap[mockModalState.title.alignment],
        color: mockModalState.title.textColor,
        fontSize: mockModalState.title.fontSize + 'px',
        minHeight: '20px',
      })
    );
  });

  test('renders primary button wrapper correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalPrimaryButtonWrapper = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-primary-button-wrapper'
    );

    if (
      mockModalState.primaryButton.position ===
      PrimaryButtonPosition.CENTER_RIGHT
    )
      expect(modalPrimaryButtonWrapper).toHaveStyle(
        fromReactToDOMStyles({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        })
      );
  });

  test('renders media wrapper correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalMediaWrapper = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-media-wrapper'
    );

    expect(modalMediaWrapper).toHaveStyle(
      fromReactToDOMStyles({
        display: 'flex',
        ...mediaPositionMap[mockModalState.media.position],
        justifyContent: 'center',
        alignItems: 'center',
      })
    );
  });

  test('renders media correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalMedia = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-media'
    );

    expect(modalMedia).toHaveStyle(
      fromReactToDOMStyles({
        width: `${mockModalState.media.height.value}${mockModalState.media.height.unit}`,
        ...(mockModalState.media.hidden
          ? { display: 'none' }
          : {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }),
      })
    );
  });

  test('renders body wrapper correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalBodyWrapper = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-body-wrapper'
    );

    if (mockModalState.body.hidden)
      expect(modalBodyWrapper).toHaveStyle({ display: 'none' });
  });

  test('renders body correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalBody = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-body'
    );

    expect(modalBody).toHaveStyle(
      fromReactToDOMStyles({
        textAlign: alignmentStyleMap[mockModalState.body.alignment],
        color: mockModalState.body.textColor,
        fontSize: mockModalState.body.fontSize + 'px',
        minHeight: '20px',
      })
    );
  });

  test('renders primary button correctly', () => {
    const iframe = screen.getByTestId(
      'laudspeaker-modal-iframe'
    ) as HTMLIFrameElement;
    const iframeDocument =
      iframe.contentWindow?.document || iframe.contentDocument;

    if (!iframeDocument) throw new Error('No iframe content found');

    const modalPrimaryButton = within(iframeDocument.body).getByTestId(
      'laudspeaker-modal-primary-button'
    );

    expect(modalPrimaryButton).toHaveStyle(
      fromReactToDOMStyles({
        backgroundColor: mockModalState.primaryButton.fillColor,
        color: mockModalState.primaryButton.textColor,
        borderColor: mockModalState.primaryButton.borderColor,
        borderRadius: `${mockModalState.primaryButton.borderRadius.value}${mockModalState.primaryButton.borderRadius.unit}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'fit-content',
        padding: '5px 9px 3px 9px',
        userSelect: 'none',
        cursor: 'pointer',
        borderWidth: '2px',
        margin: '0px 18px 0px 0px',
        whiteSpace: 'nowrap',
        ...primaryButtomPositionMap[mockModalState.primaryButton.position],
        ...(mockModalState.primaryButton.hidden ? { display: 'none' } : {}),
      })
    );

    expect(modalPrimaryButton).toHaveTextContent(
      mockModalState.primaryButton.content
    );
  });
});
