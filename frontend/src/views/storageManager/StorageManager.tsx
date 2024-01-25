import { Divider } from "@suid/material";
import { batch, createContext } from "solid-js";
import { copyOfRange, bucket, useCtx } from "../../mgrui/lib/components/utils";
import FileTree from "./FileTree";
import CurrentPathBrowser from "./CurrentPathBrowser";
import { globalCustomEventRegistry } from "../../mgrui/lib/components/EventRegistry";
import Events from "../../Events";
import Paths, { Path } from "../../common/Paths";

interface StorageManagerContextDef {
  open: Consumer<Path>;
  openInCwd: Consumer<string>;
  getPath: (path?: string) => Path;
  backward: Callback;
  forward: Callback;
  changeCurrentPathByIdx: Consumer<number>;
}

export const StorageManagerContext = createContext<StorageManagerContextDef>();

export function useStorageManager() {
  return useCtx<StorageManagerContextDef>(StorageManagerContext as any);
}

export default function StorageManager() {
  const path = bucket<Path>(Paths.resolvePath("/"));
  const currentPath = bucket(-1);
  return (
    <StorageManagerContext.Provider value={{
      getPath: (p?: string) => {
        const patterns = path().subPatterns(currentPath() + 1);
        const r = Paths.of(patterns);
        return p ? r.resolve(p) : r;
      },
      open: (newPath) => {
        const oldPath = path();
        if (oldPath.contains(newPath)) {
          currentPath(newPath.length() - 1);
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
