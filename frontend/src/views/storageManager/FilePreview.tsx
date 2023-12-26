import { Paper, Slide } from "@suid/material";
import { Show, Switch } from "solid-js";
import MediaFile from "../gallery/MediaFile";

export default function FilePreview(props: {
  file: StorageFile | null;
}) {
  return (
    <Show when={props.file !== null}>
      <div class="absolute w-2/3 h-2/3 top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2">
        <Paper class="w-full h-full">
          <MediaFile file={props.file as StorageFile} />
        </Paper>
      </div>
    </Show>
  )
}