import { onCleanup } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';

type Handler = (...args: any[]) => void;
const listeners = new Map<any, Map<string, Map<string, Handler>>>;

function handleEvent(target: any, event: string, ...args: any[]) {
  const m = listeners.get(target);
  if (m !== undefined) {
    const handlers = m.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        handler(...args);
      });
    }
  }
}

export class DomEventRegistry {

  private readonly name: string;

  constructor(...names: string[]) {
    this.name = names.join('/');
    if (!this.name) {
      this.name = uuidv4();
    }
  }

  on(target: any, event: string, handler: Handler, addCleanup: boolean = true) {
    // console.log(this.name, event)
    if (target === window) {
      if (!target[`on${event}`]) {
        target[`on${event}`] = (...args: any[]) => handleEvent(target, event, ...args);
      }
      // window can't be key => map not updated error
      target = 0;
    } else if (!target.getAttribute(`${event}-listener`)) {
      // to support custom event
      target.addEventListener(event, (...args: any[]) => handleEvent(target, event, ...args));
      target.setAttribute(`${event}-listener`, 'true');
    }
    let trackedEvents = listeners.get(target);
    if (!trackedEvents) {
      trackedEvents = new Map();
      listeners.set(target, trackedEvents);
    }
    let handlers = trackedEvents.get(event);
    if (!handlers) {
      handlers = new Map();
      trackedEvents.set(event, handlers);
    }
    handlers.set(this.name, handler);
    if (addCleanup) {
      onCleanup(() => {
        this.off(target, 'mousedown');
      });
    }
  }

  off(target: any, event: string) {
    const trackedEvents = listeners.get(target === window ? 0 : target);
    if (trackedEvents) {
      let handlers = trackedEvents.get(event);
      if (handlers) {
        handlers.delete(this.name);
        if (handlers.size == 0) {
          if (target === window) {
            target[`on${event}`] = undefined;
          } else {
            // TODO: how to delete addEventListener
            // console.log(target.getAttribute(`${event}-listener`))
          }
          trackedEvents.delete(event);
        }
      }
    }
  }
}

export function createDomEventRegistry(...names: string[]) {
  return new DomEventRegistry(...names);
}

export class CustomEventRegistryImpl implements CustomEventRegistry {

  private trackedEvents = new Map<string, Map<string, CustomEventHandler>>;

  dispatch(evt: CustomEvent) {
    let handlers = this.trackedEvents.get(evt.type);
    if (handlers) {
      for (let h of handlers.values()) {
        h(evt);
      }
    }
  }
  
  on(event: string, handler: CustomEventHandler, addCleanup: boolean = true) {
    let handlers = this.trackedEvents.get(event);
    if (!handlers) {
      handlers = new Map();
      this.trackedEvents.set(event, handlers);
    }
    const id = uuidv4();
    handlers.set(id, handler);
    if (addCleanup) {
      onCleanup(() => {
        this.off(event, id);
      });
    }
  }

  
  off(event: string, handlerId: string) {
    let handlers = this.trackedEvents.get(event);
    if (handlers) {
      handlers.delete(handlerId);
    }
  }
}

export function createCustomEventRegistry() {
  return new CustomEventRegistryImpl();
}

export const globalCustomEventRegistry = createCustomEventRegistry();
