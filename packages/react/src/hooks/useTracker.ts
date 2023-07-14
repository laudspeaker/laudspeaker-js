import { LaudspeakerContext } from '@root/context/laudspeakerContext';
import { useContext, useEffect, useState } from 'react';

const useTracker = (id: string): [unknown, typeof laudspeaker.fire] => {
  const [state, setState] = useState<unknown>();
  const { laudspeaker } = useContext(LaudspeakerContext);

  const modalListener = (modalData: unknown) => {
    setState(modalData);
  };

  useEffect(() => {
    laudspeaker.on('special-modal', modalListener);

    return () => laudspeaker.removeListener('special-modal', modalListener);
  }, []);

  return [state, laudspeaker.fire];
};

export default useTracker;
