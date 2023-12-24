import { Backdrop, Button, ButtonGroup, MenuItem, Select, useTheme } from "@suid/material";
import { For, createResource } from "solid-js";
import { createBucket } from "../../mgrui/lib/components/utils";
import { FileTreeNode } from "./FileTree";
import Paths from "../../common/Paths";
import getBackend from "../../service/Backend";
import { FaSolidCheck } from "solid-icons/fa";
import { TiCancel } from 'solid-icons/ti';

const mediaTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg"
]

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
          <FileTreeNode basePath={path} file={f} />
        )}</For>
        <div class="flex mt-auto w-full gap-1">
          <div class="rounded-md bg-zinc-300 w-full h-10"></div>
          <Select
            id="demo-simple-select-autowidth"
            value={accepted()}
            onChange={(evt) => accepted(evt.target.value)}
            autoWidth size="small"
          >
            <For each={mediaTypes}>{item => (
              <MenuItem value={item}>{item}</MenuItem>
            )}</For>
          </Select>
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