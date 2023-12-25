export { }

declare global {

  type Pair<K, V> = [key: K, value: V];

  type Consumer<T> = (v: T) => void;

  type Pos = [number, number];
  
  type Data<T> = (v?: T) => T;

  interface Res {
    file: File;
    src: string;
  }

  interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  interface DragNodeEventData {
    from: Pos;
    to: Pos;
  }

  type Callback = (...args: any) => any;

  type Supplier<T> = () => T;

  interface EventListener {
    name: string;
    handler: () => void;
  }
  
  type CustomEventHandler = (evt: CustomEvent) => void;

  interface CustomEventRegistry {
    dispatch(evt: CustomEvent): void;
    on(event: string, handler: CustomEventHandler, addCleanup?: boolean): void;
    off(event: string, handlerId: string): void;
  }


  type Comparator<T> = (a: T, b: T) => -1 | 0 | 1;

  type Call<T, R> = (v: T) => R;

  interface StorageFile {
    name: string;
    mediaType: string;
  }

  type FileFilter = (file: StorageFile) => boolean;
}

// declare module "solid-js" {
//   namespace JSX {
//     interface Directives {
//       bindEvents: string;
//     }
//   }
// }