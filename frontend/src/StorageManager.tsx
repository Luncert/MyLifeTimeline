import { Divider } from "@suid/material";
import { batch, createContext } from "solid-js";
import { copyOfRange, createBucket, useCtx } from "./mgrui/lib/components/utils";
import FileTree from "./FileTree";
import CurrentPathBrowser from "./CurrentPathBrowser";
import { globalCustomEventRegistry } from "./mgrui/lib/components/EventRegistry";
import Events from "./Events";
import Paths, { Path } from "./Paths";

interface StorageManagerContextDef {
  open: Consumer<Path>;
  openInCwd: Consumer<string>;
  getPath: (path?: string) => Path;
  backward: Callback;
  forward: Callback;
  changeCurrentPathByIdx: Consumer<number>;
}

const StorageManagerContext = createContext<StorageManagerContextDef>();

export function useStorageManager() {
  return useCtx<StorageManagerContextDef>(StorageManagerContext as any);
}

export default function StorageManager() {
  const path = createBucket<Path>(Paths.resolvePath("/"));
  const currentPath = createBucket(-1);
  return (
    <StorageManagerContext.Provider value={{
      getPath: (p?: string) => {
        return p ? path().resolve(p) : path();
      },
      open: (newPath) => {
        const oldPath = path();
        if (oldPath.isChildOf(newPath)) {
          currentPath(newPath.length());
        } else {
          path(newPath);
          currentPath(newPath.length() - 1);
        }
        globalCustomEventRegistry.dispatch(new CustomEvent(Events.Storage.ChangeWorkDir));
      },
      openInCwd: (directory) => {
        if (path().getPattern(currentPath() + 1) !== directory) {
          const newPath = path().resolve(directory);
          batch(() => {
            path(newPath);
            currentPath(newPath.length() - 1);
          });
        } else {
          currentPath(currentPath() + 1);
        }
        globalCustomEventRegistry.dispatch(new CustomEvent(Events.Storage.ChangeWorkDir));
      },
      backward: () => {
        const old = currentPath();
        currentPath(Math.max(-1, currentPath() - 1));
        console.log(currentPath())
        if (old !== currentPath()) {
          globalCustomEventRegistry.dispatch(new CustomEvent(Events.Storage.ChangeWorkDir));
        }
      },
      forward: () => {
        const old = currentPath();
        currentPath(Math.min(path().length() - 1, currentPath() + 1));
        if (old !== currentPath()) {
          globalCustomEventRegistry.dispatch(new CustomEvent(Events.Storage.ChangeWorkDir));
        }
      },
      changeCurrentPathByIdx: (idx) => {
        const old = currentPath();
        currentPath(idx);
        if (old !== currentPath()) {
          globalCustomEventRegistry.dispatch(new CustomEvent(Events.Storage.ChangeWorkDir));
        }
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
