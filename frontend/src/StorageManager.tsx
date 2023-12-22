import { Divider } from "@suid/material";
import { batch, createContext, createMemo } from "solid-js";
import { copyOfRange, createBucket, useCtx } from "./mgrui/lib/components/utils";
import FileTree from "./FileTree";
import CurrentPathBrowser from "./CurrentPathBrowser";

interface StorageManagerContextDef {
  open: Consumer<string>;
  getPath: (...suffix: string[]) => string;
  backward: Callback;
  forward: Callback;
  changeCurrentPathByIdx: Consumer<number>;
}

const StorageManagerContext = createContext<StorageManagerContextDef>();

export function useStorageManager() {
  return useCtx<StorageManagerContextDef>(StorageManagerContext as any);
}

export default function StorageManager() {
  const path = createBucket<string[]>([]);
  const currentPath = createBucket(-1);
  return (
    <StorageManagerContext.Provider value={{
      getPath: (...suffix: string[]) => {
        const p = copyOfRange(path(), 0, currentPath() + 1);
        if (suffix) {
          p.push(...suffix);
        }
        return p.join("/");
      },
      open: (directory) => {
        if (path()[currentPath() + 1] !== directory) {
          const p = copyOfRange(path(), 0, currentPath() + 1);
          p.push(directory);
          batch(() => {
            path(p);
            currentPath(currentPath() + 1);
          });
        } else {
          currentPath(currentPath() + 1);
        }
      },
      backward: () => {
        currentPath(Math.max(-1, currentPath() - 1));
      },
      forward: () => {
        currentPath(Math.min(path().length - 1, currentPath() + 1));
      },
      changeCurrentPathByIdx: (idx) => {
        currentPath(idx);
      }
    }}>
      <div class="w-full h-full flex">
        <FileTree />
        <Divider orientation="vertical" />
        <CurrentPathBrowser />
      </div>
    </StorageManagerContext.Provider>
  )
}
