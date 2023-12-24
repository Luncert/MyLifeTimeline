import { Backdrop, Button, ButtonGroup, IconButton, useTheme } from "@suid/material";
import { For, JSX, createResource } from "solid-js";
import { createBucket } from "../../mgrui/lib/components/utils";
import { FileTreeNode } from "./FileTree";
import Paths from "../../common/Paths";
import getBackend from "../../service/Backend";
import { FaSolidCheck } from "solid-icons/fa";
import { TiCancel } from 'solid-icons/ti';
import { ImCross } from 'solid-icons/im';

export default function StorageBrowserModal(props: {
  open: Bucket<boolean>;
  onClose: (files: StorageFile[]) => void;
  opts?: {
    accept: string | string[];
  }
}) {
  const theme = useTheme();
  const path = Paths.resolvePath("/");
  const [files, filesAction] = createResource(
    () => getBackend().listFiles(Paths.resolvePath("/")),
    { initialValue: [] as StorageFile[]});
  const selectedFiles = createBucket<StorageFile[]>([]);
  const accepted = createBucket("");

  const onClose = () => {
    props.open(false);
    // props.onClose();
  };

  return (
    <Backdrop open={props.open()} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <div class="relative drop-shadow w-1/2 h-2/3 rounded-lg bg-white
        flex flex-col p-2">
        <For each={files()}>{f => (
          <FileTreeNode basePath={path} file={f}
            onSelect={(selectedFile) => selectedFiles([...selectedFiles(), selectedFile])} />
        )}</For>
        <div class="flex mt-auto w-full gap-1">
          <div class="rounded-md border-[1px] border-zinc-300 w-full h-10 p-1">
            <For each={selectedFiles()}>{f => (
              <Capsule onDelete={() => {}}>{f.name}</Capsule>
            )}</For>
          </div>
          <ButtonGroup size="small">
            <Button variant="contained">
              <FaSolidCheck size={18}/>
            </Button>
            <Button variant="contained">
              <TiCancel size={20} />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Backdrop>
  );
}

function Capsule(props: {
  onDelete: Callback;
  children: JSX.Element;
}) {
  return (
    <div class="flex inline-block w-max h-full p-1 rounded-md bg-zinc-300 shadow-md">
      <span class="px-1">{props.children}</span>
      <IconButton size="small" color="error" onClick={props.onDelete}>
        <ImCross size={14} />
      </IconButton>
    </div>
  )
}