import ReactDOM from 'react-dom/client';

export { default as LaudspeakerProvider } from './LaudspeakerProvider';
export { default as useTracker } from './hooks/useTracker';

if (process.env.NODE_ENV === 'development') {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(<></>);
}
