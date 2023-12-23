import { Button, IconButton, InputAdornment, TextField } from "@suid/material";
import { BiRegularSearchAlt } from "solid-icons/bi";
import { For, Show, createEffect, createResource, onMount } from "solid-js";
import { createBucket } from "./mgrui/lib/components/utils";
import { FaSolidAngleDown, FaSolidAngleRight } from "solid-icons/fa";
import { IoFolder, IoFolderOpen } from "solid-icons/io";
import { MediaResourceIcon } from "./FileElement";
import getBackend from "./service/Backend";
import { globalCustomEventRegistry } from "./mgrui/lib/components/EventRegistry";
import Events from "./Events";
import { useStorageManager } from "./StorageManager";
import Paths, { Path } from "./Paths";

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
      {/* <TextField class="w-full" size="small" autoComplete="none" InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" sx={{ borderRadius: 2 }}>
              <BiRegularSearchAlt />
            </IconButton>
          </InputAdornment>
        )
      }} /> */}
      <For each={files()}>{f => (
        <FileTreeNode basePath={path} file={f} />
      )}</For>
    </div>
  )
}

function FileTreeNode(props: {
  basePath: Path;
  file: StorageFile;
}) {
  const storage = useStorageManager();
  const expanded = createBucket(false);
  const isDirectory = props.file.mediaType === "directory";
  const children = createBucket<StorageFile[] | null>(null);
  const path = props.basePath.resolve(props.file.name);

  const load = () => {
    getBackend().listFiles(path)
      .then((files) => {
        children(files);
      });
  };

  onMount(() => {
    globalCustomEventRegistry.on(Events.Storage.Upload, (evt) => {
      const p = evt.detail.path as Path;
      if (p.isChildOf(path)) {
        load();
      }
    });
  });

  return (
    <div>
      <Button fullWidth color="inherit" size="small" startIcon={
        <div class="inline-block flex gap-1">
          <Show when={isDirectory} fallback={<MediaResourceIcon mediaType={props.file.mediaType} />}>
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
      } sx={{justifyContent: "start", textTransform: "none"}} onClick={() => {
        if (isDirectory) {
          expanded(!expanded());
          storage.open(path);
          if (!children()) {
            load();
          }
        }
      }}>
        <span class="whitespace-nowrap text-ellipsis overflow-hidden">{props.file.name}</span>
      </Button>
      <Show when={isDirectory && expanded()}>
        <div class="ml-[1.4rem]">
          <For each={children()}>{f => (
            <FileTreeNode basePath={path} file={f} />
          )}</For>
        </div>
      </Show>
    </div>
  );
}