import { LaudspeakerContext } from '@root/context/laudspeakerContext';
import { useContext, useEffect, useState } from 'react';

interface TrackerState {
  show: boolean;
  trackerId: string;
  [key: string]: any | unknown;
}

const useTracker = (
  id: string
): {state:TrackerState | undefined, emitTrackerEvent:typeof emitTrackerEvent} => {
  const [state, setState] = useState<TrackerState | undefined>(undefined);
  const { laudspeaker } = useContext(LaudspeakerContext);

  const modalListener = (modalData: unknown) => {
    const data = modalData as TrackerState;
    if (data.trackerId === id) {
      setState(data);
    }
  };

  const emitTrackerEvent = (event: string) => {
    if (state?.trackerId) {
      laudspeaker.emitTracker(id, event);
    } else {
      console.error(
        'You should get state of tracker from backend to emit tracker event'
      );
    }
  };

  useEffect(() => {
    laudspeaker.on('custom', modalListener);

    return () => laudspeaker.removeListener('custom', modalListener);
  }, []);

  return {state, emitTrackerEvent};
};

export default useTracker;
