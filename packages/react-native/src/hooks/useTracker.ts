import { LaudspeakerContext } from '@root/context/laudspeakerContext';
import { useContext, useEffect, useState } from 'react';

interface TrackerState {
  show: boolean;
  trackerId: string;
}

const useTracker = <
  T extends Record<string | number | symbol, unknown> = Record<string, unknown>
>(
  id: string
): {
  state: (TrackerState & T) | undefined;
  emitTrackerEvent: typeof emitTrackerEvent;
} => {
  const [state, setState] = useState<TrackerState & T>();
  const { laudspeaker } = useContext(LaudspeakerContext);

  const modalListener = (modalData: unknown) => {
    const data = modalData as TrackerState & T;
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

  return { state, emitTrackerEvent };
};

export default useTracker;
