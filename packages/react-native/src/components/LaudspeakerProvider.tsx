import React, { FC, ReactNode, useEffect, useState } from 'react';
import { LaudspeakerContext } from '../context/laudspeakerContext';
import { Laudspeaker } from '@laudspeaker/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

const laudspeaker = new Laudspeaker(AsyncStorage);

interface LaudspeakerProviderProps {
  children: ReactNode;
  apiKey: string;
  apiHost?: string;
}

const LaudspeakerProvider: FC<LaudspeakerProviderProps> = ({
  children,
  apiKey,
  apiHost,
}) => {
  const trackerData = useState({});

  const handleTracker = (data: any) => {
    if (data?.trackerId) {
      trackerData[1]((prev) => ({ ...prev, [data.trackerId]: data }));
    }
  };

  useEffect(() => {
    laudspeaker.init(apiKey, { apiHost });
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
