import React, { FC, ReactNode, useEffect, useState } from 'react';
import { LaudspeakerContext } from '../context/laudspeakerContext';
import laudspeaker from '@laudspeaker/laudspeaker-js';

interface LaudspeakerProviderProps {
  children: ReactNode;
  apiKey: string;
  apiHost?: string;
  development?: boolean | undefined;
}

const LaudspeakerProvider: FC<LaudspeakerProviderProps> = ({
  children,
  apiKey,
  apiHost,
  development,
}) => {
  const trackerData = useState({});

  const handleTracker = (data: any) => {
    if (data?.trackerId) {
      trackerData[1]((prev) => ({ ...prev, [data.trackerId]: data }));
    }
  };

  useEffect(() => {
    laudspeaker.init(apiKey, { apiHost, development });
    laudspeaker.on('custom', handleTracker);

    return () => {
      laudspeaker.removeListener('custom', handleTracker);
      laudspeaker.disconnect();
    };
  }, []);

  return (
    <LaudspeakerContext.Provider value={{ laudspeaker, trackerData }}>
      {children}
    </LaudspeakerContext.Provider>
  );
};

export default LaudspeakerProvider;
