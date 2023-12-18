import { Context, SignalOptions, createSignal, splitProps, useContext } from "solid-js";

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

// export function createData<T>(): UpdateAndGetFunc<T | undefined>;
export function createData<T>(value: T, options?: {
  beforeUpdate?: (newValue: T) => void;
  localStorageName?: string;
} & SignalOptions<T>): Data<T> {
  const [local, others] = options && splitProps(options, ["beforeUpdate", "localStorageName"])
    || [];
  const [v, setV] = createSignal<T>(value, others);
  // load from local storage
  if (local?.localStorageName) {
    const raw = localStorage.getItem(local.localStorageName);
    if (raw != null) {
      const t = JSON.parse(raw);
      setV(t);
      if (local?.beforeUpdate) {
        local.beforeUpdate(t);
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
      return setV(t as any);
    }
    return v();
  };
}