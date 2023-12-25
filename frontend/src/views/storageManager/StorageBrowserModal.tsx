import { Button, ButtonGroup, Typography } from "@suid/material";
import { For, JSX, createEffect, createResource } from "solid-js";
import { createStampedUpdateBucket } from "../../mgrui/lib/components/utils";
import { FileTreeNode } from "./FileTree";
import Paths from "../../common/Paths";
import getBackend from "../../service/Backend";
import { FaSolidCheck } from "solid-icons/fa";
import { TiCancel } from 'solid-icons/ti';
import { useBackdrop } from "../../mgrui/lib/components/BackdropWrapper";

export default function StorageBrowserModal(props: {
  open: Bucket<boolean>;
  onClose: (files: StorageFile[]) => void;
  accept?: string | string[];
  multiple?: boolean;
}) {
  const backdrop = useBackdrop();
  const fileFilter: FileFilter = props.accept
    ? (f) => true
    : () => true;

  const onClose = (files: StorageFile[]) => {
    props.open(false);
    props.onClose(files);
  };

  createEffect(() => {
    if (props.open()) {
      backdrop.show({
        elem: () => (<StorageBrowserModalElem filter={fileFilter} onClose={onClose} />)
      });
    } else {
      backdrop.hide();
    }
  })

  return <></>;
}

function StorageBrowserModalElem(props: {
  filter: FileFilter;
  onClose: (files: StorageFile[]) => void;
}) {
  const path = Paths.resolvePath("/");
  const [files] = createResource(
    () => getBackend().listFiles(Paths.resolvePath("/"))
      .then(files => files.filter(props.filter)),
    { initialValue: [] as StorageFile[]});
  const [selectedFiles, selectedFilesUpdater] = createStampedUpdateBucket<Set<StorageFile>>(new Set());
  let selectedFileScroll: HTMLDivElement;

  return (
    <div class="relative drop-shadow w-1/2 h-2/3 rounded-lg bg-white
      flex flex-col p-2">
      <For each={files()}>{f => (
        <FileTreeNode basePath={path} file={f} filter={props.filter} selectedFilesUpdater={selectedFilesUpdater} />
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
            <For each={Array.from(selectedFiles().values())}>{(f) => (
              <Capsule onDelete={() => {
                selectedFilesUpdater(files => files.delete(f));
              }}>{f.name}</Capsule>
            )}</For>
          </div>
        </div>
        <ButtonGroup size="small">
          <Button variant="contained" onClick={() => props.onClose(Array.from(selectedFiles().values()))}>
            <FaSolidCheck size={18}/>
          </Button>
          <Button variant="contained" onClick={() => props.onClose([])}>
            <TiCancel size={20} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
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