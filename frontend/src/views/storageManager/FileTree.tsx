import { Button, IconButton, InputAdornment, TextField } from "@suid/material";
import { BiRegularSearchAlt } from "solid-icons/bi";
import { Accessor, For, Show, batch, createEffect, createMemo, createResource, onMount, useContext } from "solid-js";
import { bucket } from "../../mgrui/lib/components/utils";
import { FaSolidAngleDown, FaSolidAngleRight } from "solid-icons/fa";
import { IoFolder, IoFolderOpen } from "solid-icons/io";
import { MediaResourceIcon } from "./FileElement";
import getBackend from "../../service/Backend";
import { globalCustomEventRegistry } from "../../mgrui/lib/components/EventRegistry";
import Events from "../../Events";
import { StorageManagerContext, useStorageManager } from "./StorageManager";
import Paths, { Path } from "../../common/Paths";

interface FileNode {
  name: string;
  mediaType: string;
}

interface DirectoryNode {
  name: string;
  children: (DirectoryNode | FileNode)[];
}

type FileTree = (DirectoryNode | FileNode)[];

export default function FileTree() {
  const [files, filesAction] = createResource(
    () => getBackend().listFiles(Paths.resolvePath("/")),
    { initialValue: [] as StorageFile[]});
  const path = Paths.resolvePath("/");

  onMount(() => {
    globalCustomEventRegistry.on(Events.Storage.Upload, (evt) => {
      const p = evt.detail.path as Path;
      if (p.isChildOf(path)) {
        filesAction.refetch();
      }
    });
  });

  return (
    <div class="flex flex-col gap-1 p-1 w-1/3">
      {/* <TextField class="w-full" size="small" autoComplete="off" InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" sx={{ borderRadius: 2 }}>
              <BiRegularSearchAlt />
            </IconButton>
          </InputAdornment>
        )
      }} /> */}
      <For each={files()}>{f => (
        <FileTreeNode basePath={path} file={f} enableStorageEvent />
      )}</For>
    </div>
  )
}

export function FileTreeNode(props: {
  basePath: Path;
  file: StorageFile;
  filter?: FileFilter;
  isActive?: (f: StorageFile) => boolean;
  onSelect?: Consumer<StorageFile>;
  onUnselect?: Consumer<StorageFile>;
  enableStorageEvent?: boolean;
}) {
  const expanded = bucket(false);
  const isDirectory = props.file.mediaType === "directory";
  const children = bucket<StorageFile[] | null>(null);
  const path = props.basePath.resolve(props.file.name);

  const load = () => {
    getBackend().listFiles(path)
      .then((files) => children(props.filter ? files.filter(props.filter) : files));
  };

  const onClick = () => {
    if (isDirectory) {
      expanded(!expanded());
      // load the first time
      if (!children()) {
        load();
      }
    } else {
      if (props.isActive?.(props.file)) {
        props.onUnselect?.(props.file);
      } else {
        props.onSelect?.(props.file);
      }
    }
    
    if (props.enableStorageEvent) {
      globalCustomEventRegistry.dispatch(new CustomEvent(Events.Storage.Select, {
        detail: {
          file: props.file
        }
      }));
    }
  };

  if (props.enableStorageEvent) {
    onMount(() => {
      globalCustomEventRegistry.on(Events.Storage.Upload, (evt) => {
        const p = evt.detail.path as Path;
        if (p.isChildOf(path)) {
          load();
        }
      });
    });
  }

  return (
    <div>
      <Button fullWidth color={props.isActive?.(props.file) ? "primary" : "inherit"} size="small" startIcon={
        <div class="inline-block flex gap-1">
          <Show when={isDirectory} fallback={<MediaResourceIcon file={props.file} />}>
            <Show when={expanded()} fallback={
              <>
                <FaSolidAngleRight />
                <IoFolder />
              </>
            }>
              <FaSolidAngleDown />
              <IoFolderOpen />
            </Show>
          </Show>
        </div>
      } sx={{justifyContent: "start", textTransform: "none"}} onClick={onClick}>
        <span class="whitespace-nowrap text-ellipsis overflow-hidden">{props.file.name}</span>
      </Button>
      <Show when={isDirectory && expanded()}>
        <div class="ml-[1.4rem]">
          <For each={children()}>{f => (
            <FileTreeNode basePath={path} file={f}
              isActive={props.isActive} onSelect={props.onSelect} onUnselect={props.onUnselect}
              enableStorageEvent={props.enableStorageEvent} />
          )}</For>
        </div>
      </Show>
    </div>
  );
}