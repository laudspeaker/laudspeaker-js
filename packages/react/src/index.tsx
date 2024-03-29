import LaudspeakerProvider from './components/LaudspeakerProvider';
import useLaudComponent from './hooks/useLaudComponent';
import useLaudspeaker from './hooks/useLaudspeaker';

export { LaudspeakerProvider, useLaudComponent, useLaudspeaker };

if (process.env.NODE_ENV === 'development') {
  (async () => {
    const ReactDOM = await import('react-dom/client');

    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );

    root.render(
      <LaudspeakerProvider
        apiKey="8hSKrIT44qHq6BWbs2tPmGnIB0nnGINND0ZbSg2R"
        apiHost="http://localhost:3001"
      >
        <div>Hello.</div>
      </LaudspeakerProvider>
    );
  })();
}
