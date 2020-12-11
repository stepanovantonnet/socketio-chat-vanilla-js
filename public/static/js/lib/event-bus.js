export default class EventBus {
  constructor() {
    this.eventProxy = document.createElement("event-proxy");
    //this.events = {};
  }

  /**
   * Add an event listener.
   */
  addEventListener(event, callback) {
    this.eventProxy.addEventListener(event, callback);
  }

  /**
   * Remove an event listener.
   */
  removeEventListener(event, callback) {
    this.eventProxy.removeEventListener(event, callback);
  }

  /**
   * Dispatch an event.
   */
  dispatchEvent(event, detail = {}) {
    this.eventProxy.dispatchEvent(new CustomEvent(event, { detail }));
  }
}
