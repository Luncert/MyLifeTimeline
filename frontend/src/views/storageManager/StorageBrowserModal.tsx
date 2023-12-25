import { Backdrop, Button, ButtonGroup, Typography, useTheme } from "@suid/material";
import { For, JSX, createResource } from "solid-js";
import { createBucket } from "../../mgrui/lib/components/utils";
import { FileTreeNode } from "./FileTree";
import Paths from "../../common/Paths";
import getBackend from "../../service/Backend";
import { FaSolidCheck } from "solid-icons/fa";
import { TiCancel } from 'solid-icons/ti';

export default function StorageBrowserModal(props: {
  open: Bucket<boolean>;
  onClose: (files: StorageFile[]) => void;
  opts?: {
    accept: string | string[];
  }
}) {
  const fileFilter: FileFilter = props.opts?.accept
    ? (f) => true
    : () => true;
  const theme = useTheme();
  const path = Paths.resolvePath("/");
  const [files, filesAction] = createResource(
    () => getBackend().listFiles(Paths.resolvePath("/"))
      .then(files => files.filter(fileFilter)),
    { initialValue: [] as StorageFile[]});
  const selectedFiles = createBucket<StorageFile[]>([]);
  let selectedFileScroll: HTMLDivElement;

  const onClose = (files: StorageFile[]) => {
    props.open(false);
    props.onClose(files);
  };

  return (
    <Backdrop open={props.open()} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <div class="relative drop-shadow w-1/2 h-2/3 rounded-lg bg-white
        flex flex-col p-2">
        <For each={files()}>{f => (
          <FileTreeNode basePath={path} file={f} filter={fileFilter}
            onSelect={(file) => {
              selectedFiles([...selectedFiles(), file]);
            }}
            onUnselect={(file) => {
              selectedFiles(selectedFiles().filter((v, i) => v !== file));
            }} />
        )}</For>
        <div class="flex mt-auto w-full gap-1">
          <div ref={el => selectedFileScroll = el}
            class="rounded-md border-[1px] border-zinc-300 w-full h-10 p-1 overflow-y-hidden overflow-x-scroll invisible-scrollbar"
            onWheel={(evt) => {
              selectedFileScroll.scrollTo({
                behavior: "smooth",
                left: selectedFileScroll.scrollLeft + evt.deltaY
              });
            }}>
            <div class="flex gap-1 w-max">
              <For each={selectedFiles()}>{(f, idx) => (
                <Capsule onDelete={() => {
                  selectedFiles(selectedFiles().filter((v, i) => i !== idx()));
                }}>{f.name}</Capsule>
              )}</For>
            </div>
          </div>
          <ButtonGroup size="small">
            <Button variant="contained" onClick={() => onClose(selectedFiles())}>
              <FaSolidCheck size={18}/>
            </Button>
            <Button variant="contained" onClick={() => onClose([])}>
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
    <div class="flex inline-block w-max h-full p-1 rounded-md bg-sky-100 shadow-md">
      <Typography color="info" class="px-1">{props.children}</Typography>
      {/* <IconButton size="small" color="error" onClick={props.onDelete}>
        <ImCross size={14} />
      </IconButton> */}
    </div>
  )
}