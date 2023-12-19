import { Context, SignalOptions, createSignal, splitProps, untrack, useContext } from "solid-js";

export function useCtx<T>(c: Context<T>): T {
  const context = useContext(c);
  if (!context) {
    throw new Error("cannot find a " + JSON.stringify(c))
  }
  return context;
}

export function names(...v: string[]) {
  return v.filter((name) => Boolean(name)).join(' ');
}

export function when<T>(condition: boolean, v: T): T {
  if (condition) {
    return v;
  }
  return undefined as any;
}

export function or<T>(v: T | undefined, v1: T): T {
  return v !== undefined ? v : v1;
}

export function check(result: boolean, className: string): string {
  return result ? className : '';
}

export function conditionalString(condition: any, value: string) {
  return condition ? value : '';
}

export function conditionalValue(condition: any, value: any) {
  return condition ? value : null;
}

export function conditionalRun(predicate: () => boolean, call: () => void) {
  return () => {
    if (predicate()) {
      call();
    }
  };
}

export function compareDateString(a: string, b: string): number {
  return Date.parse(a) - Date.parse(b);
}


// export function createData<T>(): UpdateAndGetFunc<T | undefined>;
export function createData<T>(value: T, options?: {
  beforeUpdate?: (newValue: T) => void;
  afterUpdate?: (newValue: T) => void;
  localStorageName?: string;
} & SignalOptions<T>): Data<T> {
  const [local, others] = options && splitProps(options, ["beforeUpdate", "afterUpdate", "localStorageName"])
    || [];
  const [v, setV] = createSignal<T>(value, others);
  // load from local storage
  if (local?.localStorageName) {
    const raw = localStorage.getItem(local.localStorageName);
    if (raw != null) {
      const t = JSON.parse(raw);
      if (local?.beforeUpdate) {
        local.beforeUpdate(t);
      }
      setV(t);
      if (local?.afterUpdate) {
        local.afterUpdate(t);
      }
    }
  }
  return (t?: T) => {
    if (t !== undefined) {
      if (local?.beforeUpdate) {
        local.beforeUpdate(t);
      }
      // save to local storage
      if (local?.localStorageName) {
        localStorage.setItem(local.localStorageName, JSON.stringify(t));
      }
      try {
        return setV(t as any);
      } finally {
        if (local?.afterUpdate) {
          local.afterUpdate(t);
        }
      }
    }
    return v();
  };
}

type ArraySetter<T> = (idx: number | Array<T>, v?: T) => void;

export function createArray<T>(initialSize: number, size: Data<number>): [Data<T[]>, ArraySetter<T>] {
  const array = createData(new Array<T>(initialSize));
  const setArray = (idx: number | Array<T>, v?: T) => {
    if (Array.isArray(idx)) {
      array(idx);
    } else if (v !== undefined) {
      const arr = new Array<T>(untrack(size));
      untrack(array).forEach((v, i) => arr[i] = v);
      arr[idx] = v;
      array(arr);
    }
  }
  return [array, setArray]
}

export type StoreObject<T> = T;

export function createStoreObject<T extends Object>(obj: T, setter: Callback,
  localStorageName?: string, ...paths: string[]): StoreObject<T> {
  const proxyObject: any = {};
  for (let key of Object.keys(obj)) {
    const k = key as keyof typeof obj;
    if (typeof(obj[k]) === 'object') {
      proxyObject[key] = createStoreObject(obj[k] as any, setter, localStorageName, ...paths, key);
    } else {
      const path = [...paths, key];
      // load from local storage
      if (localStorageName) {
        const raw = localStorage.getItem([localStorageName, ...path].join('.'));
        if (raw != null) {
          setter(...path, JSON.parse(raw));
        }
      }
      proxyObject[key] = (t?: T) => {
        if (t !== undefined) {
          setter(...path, t);
          // save to local storage
          if (localStorageName) {
            localStorage.setItem([localStorageName, ...path].join('.'), JSON.stringify(t));
          }
        }
        return obj[k];
      }
    }
  }
  return proxyObject;
}

export function clone(obj: any) {
  const type = typeof(obj);
  switch (type) {
    case 'object': {
      let r: any = Array.isArray(obj) ? [] : {};
      for (let key of Object.keys(obj)) {
        r[key] = clone(obj[key]);
      }
      return r;
    }
    default:
      return obj;
  }
}

export function sequence(start: number, end: number, step: number = 1) {
  const r = [];
  for (let i = start; i < end; i += step) {
    r.push(i);
  }
  return r;
}

export function toCapital(v: string) {
  return v.charAt(0).toUpperCase() + v.substring(1);
}

export function removeElementsFromArray<T>(arr: T[], filter: (t: T) => boolean): T[] {
  const idx: number[] = [];
  arr.forEach((t, i) => {
    if (filter(t)) {
      idx.push(i);
    }
  });
  return idx.map(i => arr.splice(i, 1)[0]);
}