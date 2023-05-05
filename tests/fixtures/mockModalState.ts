import {
  AdditionalClickOptions,
  Alignment,
  BackgroundType,
  DismissPosition,
  DismissType,
  GeneralClickAction,
  MediaClickAction,
  MediaPosition,
  MediaType,
  ModalPosition,
  ModalState,
  PrimaryButtonPosition,
  SizeUnit,
} from '../../src/types';

const mockModalState: ModalState = {
  body: {
    hidden: false,
    content:
      "## **Say hi to our new look** 👋\n\nWe've made some changes to our styling and our navigation. We did this to speed up your workflows and save you some clicks. Take a few moments to get familiar with the changes.\n",
    fontSize: 14,
    alignment: Alignment.CENTER,
    linkColor: '#515E7D',
    textColor: '#FFFFFF',
  },
  media: {
    key: null,
    type: MediaType.IMAGE,
    height: {
      unit: SizeUnit.PERCENTAGE,
      value: 60,
    },
    hidden: false,
    altText: '',
    imageSrc: '',
    position: MediaPosition.TOP,
    videoUrl: null,
    actionOnClick: MediaClickAction.COMPLETE,
    additionalClick: {
      OPENURL: {
        action: AdditionalClickOptions.OPENURL,
        hidden: true,
        object: {
          url: 'google.com',
          openNewTab: true,
        },
      },
      NOACTION: {
        action: AdditionalClickOptions.NOACTION,
        hidden: true,
      },
    },
  },
  title: {
    hidden: false,
    content: 'ABC',
    fontSize: 14,
    alignment: Alignment.CENTER,
    linkColor: '#515E7D',
    textColor: '#FFFFFF',
  },
  width: {
    unit: SizeUnit.PIXEL,
    value: 401,
  },
  shroud: {
    blur: 2,
    color: '#000000',
    hidden: false,
    opacity: 0.79,
  },
  dismiss: {
    type: DismissType.CROSS,
    color: '#FFFFFF',
    hidden: false,
    content: 'close',
    position: DismissPosition.INSIDE_RIGHT,
    textSize: 15,
    timedDismiss: {
      enabled: false,
      duration: 3,
      timerColor: '#1CC88A',
      displayTimer: false,
    },
  },
  xOffset: {
    unit: SizeUnit.PIXEL,
    value: 0,
  },
  yOffset: {
    unit: SizeUnit.PIXEL,
    value: 0,
  },
  position: ModalPosition.BOTTOM_LEFT,
  background: {
    image: {
      key: null,
      type: BackgroundType.IMAGE,
      imageSrc: '',
    },
    solid: {
      type: BackgroundType.SOLID,
      color: '#003C80',
      opacity: 1,
    },
    gradient: {
      type: BackgroundType.GRADIENT,
      color1: '#ff0000',
      color2: '#000aff',
      opacity: 0.99,
    },
    selected: BackgroundType.GRADIENT,
  },
  borderRadius: {
    unit: SizeUnit.PIXEL,
    value: 22,
  },
  primaryButton: {
    hidden: false,
    content: 'Read more',
    position: PrimaryButtonPosition.BOTTOM_CENTER,
    fillColor: '#1A86FF',
    textColor: '#FFFFFF',
    borderColor: '#64CF67',
    clickAction: GeneralClickAction.NONE,
    borderRadius: {
      unit: SizeUnit.PIXEL,
      value: 8,
    },
    additionalClick: {
      OPENURL: {
        action: AdditionalClickOptions.OPENURL,
        hidden: true,
        object: {
          url: 'google.com',
          openNewTab: true,
        },
      },
      NOACTION: {
        action: AdditionalClickOptions.NOACTION,
        hidden: true,
      },
    },
  },
};

export default mockModalState;
