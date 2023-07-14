import { LaudspeakerContext } from '@root/context/laudspeakerContext';
import { useContext } from 'react';

const useLaudspeaker = () => {
  const {
    laudspeaker: { fire, identify },
  } = useContext(LaudspeakerContext);

  return { fire, identify };
};

export default useLaudspeaker;
