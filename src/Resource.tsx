import { Box, IconButton } from "@suid/material";
import { Match, Show, Switch } from "solid-js";
import { useResourceBrowser } from "./ResourceBrowser";
import { createData } from "./utils";
import { AiFillDelete } from 'solid-icons/ai';

export function Resource(props: {
  file: File;
  draggable?: boolean;
  onRemove?: () => void;
}) {
  const rb = useResourceBrowser();
  const hovered = createData(false);

  return (
    <Box class="relative drop-shadow rounded-md overflow-hidden"
      onMouseDown={(e) => rb.drag(props.file, [e.clientX, e.clientY])}
      onMouseEnter={() => hovered(true)}
      onMouseLeave={() => hovered(false)}>
      <Switch>
        <Match when={props.file.type.startsWith("image")}>
          <img class="select-none" draggable={false} src={URL.createObjectURL(props.file)} />
        </Match>
        <Match when={props.file.type.startsWith("video")}>
          <video class="select-none" width="100%">
            <source src={URL.createObjectURL(props.file)} />
          </video>
        </Match>
      </Switch>
      <div class="absolute top-0 right-0">
        <Show when={props.draggable && hovered()}>
          <IconButton size="small" color="error" onClick={() => props.onRemove?.()}>
            <AiFillDelete />
          </IconButton>
        </Show>
      </div>
    </Box>
  )
}

export function DraggingResource(props: {
  file: File;
}) {
  return (
    <Box class="relative drop-shadow rounded-md overflow-hidden">
      <Switch>
        <Match when={props.file.type.startsWith("image")}>
          <img width={300} class="select-none" draggable={false} src={URL.createObjectURL(props.file)} />
        </Match>
        <Match when={props.file.type.startsWith("video")}>
          <video width={300} class="select-none">
            <source src={URL.createObjectURL(props.file)} />
          </video>
        </Match>
      </Switch>
    </Box>
  );
}