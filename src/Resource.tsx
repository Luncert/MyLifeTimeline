import { Box, IconButton, styled } from "@suid/material";
import { Match, Show, Switch, splitProps } from "solid-js";
import { createData } from "./utils";
import { AiFillDelete } from 'solid-icons/ai';
import { useDraggingResource } from "./TimelineCreator";

export function _DraggableResource(props: {
  res: Res;
  onDrag?: () => void;
  onRemove?: () => void;
}) {
  const [local, others] = splitProps(props, ['res', 'onRemove']);
  const rb = useDraggingResource();
  const hovered = createData(false);

  return (
    <Box class="relative drop-shadow rounded-md overflow-hidden"
      onMouseDown={(e) => {
        props.onDrag?.();
        rb.drag(local.res, [e.clientX, e.clientY]);
      }}
      onMouseEnter={() => hovered(true)}
      onMouseLeave={() => hovered(false)}
      {...others}>
      <MediaResource res={local.res} />
      <div class="absolute top-0 right-0">
        <Show when={local.onRemove && hovered()}>
          <IconButton size="small" color="error" onClick={() => local.onRemove?.()}>
            <AiFillDelete />
          </IconButton>
        </Show>
      </div>
    </Box>
  )
}

export const DraggableResource = styled(_DraggableResource)();

function _MediaResource(props: {
  res: Res
}) {
  const [local, others] = splitProps(props, ['res']);
  return (
    <Box class="relative drop-shadow rounded-md overflow-hidden"
      {...others}>
      <Switch>
        <Match when={local.res.file.type.startsWith("image")}>
          <img width={300} class="select-none" draggable={false} src={local.res.src} />
        </Match>
        <Match when={local.res.file.type.startsWith("video")}>
          <video width={300} class="select-none">
            <source src={local.res.src} />
          </video>
        </Match>
      </Switch>
    </Box>
  )
};

export const MediaResource = styled(_MediaResource)();