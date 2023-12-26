import { Button, ButtonGroup, Paper } from "@suid/material";
import { Match, Show, Switch, batch, createEffect, createMemo } from "solid-js";
import getBackend from "../../service/Backend";
import Field from "../../mgrui/lib/components/Field";
import { TiCancel } from "solid-icons/ti";
import { AiFillDelete } from "solid-icons/ai";
import { useBackdrop } from "../../mgrui/lib/components/BackdropWrapper";

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

  return (
    <Show when={props.file !== null}>
      <Paper class="flex w-2/3 h-max overflow-hidden">
        <div class="w-max h-max">
          <Switch>
            <Match when={props.file.mediaType.startsWith("image")}>
              <img class="select-none" draggable={false} src={getBackend().getFileUrl(props.file)}
                style={{ "object-fit": "cover" }} />
            </Match>
            <Match when={props.file.mediaType.startsWith("video")}>
              <video class="select-none"
                style={{ "object-fit": "contain" }}>
                <source src={getBackend().getFileUrl(props.file)} />
              </video>
            </Match>
          </Switch>
        </div>
        <div class="flex flex-col p-4 gap-2 w-max shrink-0">
          <Field label="Name" value={props.file.name} />
          <Field label="Type" value={props.file.mediaType} />
          <Field label="Creation Time" value={parseTimestamp(props.file.creationTime)} />
          <Field label="Last Modified Time" value={parseTimestamp(props.file.lastModifiedTime)} />
          <Field label="Last Access Time" value={parseTimestamp(props.file.lastAccessTime)} />
          <ButtonGroup class="mt-auto ml-auto" size="small">
            <Button variant="contained" color="error" onClick={() => props.onClose()}>
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