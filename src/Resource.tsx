import { IconButton } from "@suid/material";
import { JSX, Match, Show, Switch, splitProps } from "solid-js";
import { createData, names } from "./utils";
import { AiFillDelete } from 'solid-icons/ai';
import { useDraggingResource } from "./TimelineCreator";

export function DraggableResource(props: {
  res: Res;
  onDrag?: () => void;
  onRemove?: () => void;
  elemWidth?: string | number;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ['res', 'onRemove', "class", "elemWidth"]);
  const rb = useDraggingResource();
  const hovered = createData(false);

  return (
    <div class={names("relative", local.class || "")}
      onMouseDown={(e) => {
        if (e.buttons !== 1) {
          return;
        }
        const rect = e.target.getBoundingClientRect();
        rb.drag(local.res, [e.clientX, e.clientY], [e.clientX - rect.x, e.clientY - rect.y]);
        props.onDrag?.();
      }}
      onMouseEnter={() => hovered(true)}
      onMouseLeave={() => hovered(false)}
      onContextMenu={() => {}}
      {...others}>
      <MediaResource class="rounded-none" res={local.res} elemWidth={local.elemWidth} />
      <div class="absolute top-0 right-0">
        <Show when={local.onRemove && hovered()}>
          <IconButton size="small" color="error" onClick={() => local.onRemove?.()}>
            <AiFillDelete />
          </IconButton>
        </Show>
      </div>
    </div>
  )
}

export function MediaResource(props: {
  res: Res,
  elemWidth?: string | number;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ['res', "class", "elemWidth"]);
  return (
    <div class={names("relative drop-shadow rounded-md overflow-hidden", local.class || "")}
      {...others}>
      <Switch>
        <Match when={local.res.file.type.startsWith("image")}>
          <img width={local.elemWidth || 300} class="select-none" draggable={false} src={local.res.src} />
        </Match>
        <Match when={local.res.file.type.startsWith("video")}>
          <video width={local.elemWidth || 300} class="select-none">
            <source src={local.res.src} />
          </video>
        </Match>
      </Switch>
    </div>
  )
};
