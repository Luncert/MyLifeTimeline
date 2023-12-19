import { Box, IconButton } from "@suid/material";
import { Match, Show, Switch } from "solid-js";
import { createData } from "./utils";
import { AiFillDelete } from 'solid-icons/ai';
import { useDraggingResource } from "./TimelineCreator";

export function Resource(props: {
  res: Res;
  draggable?: boolean;
  onRemove?: () => void;
}) {
  const rb = useDraggingResource();
  const hovered = createData(false);

  return (
    <Box class="relative drop-shadow rounded-md overflow-hidden"
      onMouseDown={(e) => {
        if (props.draggable) {
          rb.drag(props.res, [e.clientX, e.clientY]);
        }
      }}
      onMouseEnter={() => hovered(true)}
      onMouseLeave={() => hovered(false)}>
      <Switch>
        <Match when={props.res.file.type.startsWith("image")}>
          <img class="select-none" draggable={false} src={props.res.src} />
        </Match>
        <Match when={props.res.file.type.startsWith("video")}>
          <video class="select-none" width="100%">
            <source src={props.res.src} />
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
  res: Res;
}) {
  return (
    <Box class="relative drop-shadow rounded-md overflow-hidden">
      <Switch>
        <Match when={props.res.file.type.startsWith("image")}>
          <img width={300} class="select-none" draggable={false} src={props.res.src} />
        </Match>
        <Match when={props.res.file.type.startsWith("video")}>
          <video width={300} class="select-none">
            <source src={props.res.src} />
          </video>
        </Match>
      </Switch>
    </Box>
  );
}