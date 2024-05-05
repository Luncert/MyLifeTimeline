import { Button, ButtonGroup, Paper } from "@suid/material";
import { Match, Show, Switch, batch, createEffect, createMemo } from "solid-js";
import getBackend from "../../service/Backend";
import Field from "../../mgrui/lib/components/Field";
import { TiCancel, TiDownload } from "solid-icons/ti";
import { AiFillDelete } from "solid-icons/ai";
import { useBackdrop } from "../../mgrui/lib/components/BackdropWrapper";
import { names } from "../../mgrui/lib/components/utils";
import { isMobile } from "../../common/utils";
import { useStorageManager } from "./StorageManager";
import { Path } from "../../common/Paths";

export default function FilePreview(props: {
  file: StorageFile | null;
  onClose: VoidCall;
}) {
  const backdrop = useBackdrop();
  const file = createMemo(() => props.file || {} as StorageFile);

  const onClose = () => {
    batch(() => {
      backdrop.hide();
      props.onClose();
    });
  };
  
  createEffect(() => {
    if (props.file !== null) {
      backdrop.show({
        elem: () => (<FilePreviewElem file={file()} onClose={onClose} />),
        onClose,
      });
    }
  })

  return <></>;
}

export function FilePreviewElem(props: {
  file: StorageFile;
  onClose: VoidCall;
}) {
  const isMobileBrowser = isMobile();
  return (
    <Show when={props.file !== null}>
      <Paper class={names("w-max max-w-2/3 overflow-hidden", isMobileBrowser ? "flex-col" : "flex")} sx={{
        maxWidth: "80%",
        maxHeight: "80%"
      }}>
        <div class={names("flex flex-col justify-center", isMobileBrowser ? "w-full" : "w-max")}>
          <Switch>
            <Match when={props.file.mediaType.startsWith("image")}>
              <img class="select-none" draggable={false} src={getBackend().getFileUrl(props.file)}
                style={{ "object-fit": "cover" }} />
            </Match>
            <Match when={props.file.mediaType.startsWith("video")}>
              <video class="select-none" controls
                style={{ "object-fit": "contain" }}>
                <source src={getBackend().getFileUrl(props.file)} />
              </video>
            </Match>
          </Switch>
        </div>
        <div class={names("flex flex-col p-4 gap-2 shrink-0", isMobileBrowser ? "w-full" : "w-max")}>
          <Field label="Name" value={props.file.name} />
          <Field label="Type" value={props.file.mediaType} />
          <Field label="Creation Time" value={parseTimestamp(props.file.creationTime)} />
          <Field label="Last Modified Time" value={parseTimestamp(props.file.lastModifiedTime)} />
          <Field label="Last Access Time" value={parseTimestamp(props.file.lastAccessTime)} />
          <ButtonGroup class="mt-auto ml-auto" size="small">
            <Button variant="contained" onClick={() => getBackend().downloadFile(new Path(props.file.path.split('/')))}>
              <TiDownload size={20} />
            </Button>
            <Button disabled variant="contained" color="error" onClick={() => props.onClose()}>
              <AiFillDelete size={20} />
            </Button>
            <Button variant="contained" onClick={() => props.onClose()}>
              <TiCancel size={20} />
            </Button>
          </ButtonGroup>
        </div>
      </Paper>
    </Show>
  )
}

function parseTimestamp(v: number) {
  const d = new Date(v);
  const month = d.toLocaleString('default', { month: 'long' });
  return `${d.getDate()} ${month.substring(0, 3).toUpperCase()}, ${d.getFullYear()}`;
}
