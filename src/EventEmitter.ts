export default class EventEmitter<T extends string = string> {
  private handlersMap = new Map<T, ((payload?: unknown) => void)[]>();

  protected emit(event: T, payload?: unknown) {
    const handlers = this.handlersMap.get(event);

    if (!handlers) return;

    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (e) {
        console.error(e);
      }
    }
  }

  public on(event: T, handler: () => void) {
    const handlers = this.handlersMap.get(event);

    if (handlers) {
      handlers.push(handler);
      return;
    }

    this.handlersMap.set(event, [handler]);
  }
}
