interface InitOptions {
  apiHost?: string;
}

export default class Laudspeaker {
  public init(laudspeakerApiKey: string, options?: InitOptions) {
    console.log('init');
  }

  public identify(
    uniqueProperties: { [key: string]: any },
    optionalProperties?: { [key: string]: any }
  ) {
    console.log('identify');
  }

  public fire() {
    console.log('fire');
  }
}
