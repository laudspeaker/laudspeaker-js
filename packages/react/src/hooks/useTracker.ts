import { LaudspeakerContext } from '@root/context/laudspeakerContext';
import { useContext, useEffect } from 'react';

export interface BaseTrackerState {
  show: boolean;
  trackerId: string;
}

export type TrackerState<
  T extends Record<string | number | symbol, unknown> = Record<string, unknown>
> = (BaseTrackerState & T) | undefined;

const useTracker = <
  T extends Record<string | number | symbol, unknown> = Record<string, unknown>
>(
  id: string
): {
  state: TrackerState<T> | undefined;
  emitTrackerEvent: typeof emitTrackerEvent;
} => {
  const {
    laudspeaker,
    trackerData: [trackerData, setTrackerData],
  } = useContext(LaudspeakerContext);

  const state = trackerData[id] as TrackerState<T>;

  const setState = (value: TrackerState<T>) => {
    setTrackerData({ ...trackerData, [id]: value });
  };

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
