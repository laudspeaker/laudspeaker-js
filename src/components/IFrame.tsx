import React, { useState, ReactNode, FC, CSSProperties } from 'react';
import { createPortal } from 'react-dom';

export interface IFrameProps {
  head?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
  [key: string]: unknown;
}

export const IFrame: FC<IFrameProps> = ({
  children,
  head,
  style,
  ...props
}) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountHeadNode = contentRef?.contentWindow?.document?.head;
  const mountBodyNode = contentRef?.contentWindow?.document?.body;

  return (
    <iframe
      style={{
        width: '100vw',
        minHeight: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2147483647,
        ...style,
      }}
      {...props}
      ref={setContentRef}
    >
      {mountHeadNode && head && createPortal(head, mountHeadNode)}
      {mountBodyNode && createPortal(children, mountBodyNode)}
    </iframe>
  );
};
