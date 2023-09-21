import { LaudspeakerContext } from '@root/context/laudspeakerContext';
import { useContext } from 'react';

export interface BaseTrackerState {
  show: boolean;
  trackerId: string;
}

export type TrackerState<
  T extends Record<string | number | symbol, unknown> = Record<string, unknown>
> = (BaseTrackerState & T) | undefined;

const useLaudComponent = <
  T extends Record<string | number | symbol, unknown> = Record<string, unknown>
>(
  id: string
): {
  state: TrackerState<T> | undefined;
  emitCustomComponents: typeof emitCustomComponents;
} => {
  const {
    laudspeaker,
    trackerData: [trackerData],
  } = useContext(LaudspeakerContext);

  const state = trackerData[id] as TrackerState<T>;

  const emitCustomComponents = (event: string) => {
    if (state?.trackerId) {
      laudspeaker.emitCustomComponents(id, event);
    } else {
      console.error(
        'You should get state of tracker from backend to emit tracker event'
      );
    }
  };

  return { state, emitCustomComponents };
};

export default useLaudComponent;
