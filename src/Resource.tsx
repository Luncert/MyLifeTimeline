import { IconButton, Menu, MenuItem, MenuList, Paper, ThemeProvider, Typography } from "@suid/material";
import { JSX, Match, Show, Switch, splitProps } from "solid-js";
import { createData, names } from "./utils";
import { AiFillDelete } from 'solid-icons/ai';
import { useTimelineCreator } from "./TimelineCreator";
import { useBackdrop } from "./BackdropWrapper";
import { globalCustomEventRegistry } from "./EventRegistry";
import Events from "./Events";

export function DraggableResource(props: {
  res: Res;
  onDrag?: () => void;
  onRemove?: () => void;
  elemWidth?: string | number;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ['res', 'onRemove', "class", "elemWidth"]);
  const creator = useTimelineCreator();
  const backdrop = useBackdrop();
  const hovered = createData(false);

  return (
    <div class={names("relative", local.class || "")}
      onMouseDown={(e) => {
        if (e.buttons !== 1) {
          return;
        }
        const rect = e.target.getBoundingClientRect();
        creator.drag(local.res, [e.clientX, e.clientY], [e.clientX - rect.x, e.clientY - rect.y]);
        props.onDrag?.();
      }}
      onMouseEnter={() => hovered(true)}
      onMouseLeave={() => hovered(false)}
      onContextMenu={(evt) => {
        backdrop.show({
          elem: createRightClickContext(props.res),
          elemPos: [evt.clientX, evt.clientY],
        });
        evt.preventDefault();
      }}
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

function createRightClickContext(res: Res) {
  return (() => {
    const backdrop = useBackdrop();
    return (
      <Paper class="min-w-[100px]">
        <MenuList>
          <MenuItem onClick={() => {
            backdrop.hide();
            globalCustomEventRegistry.dispatch(new CustomEvent(Events.SetBackground, { detail: res }))
          }}>
            <Typography>Set as background</Typography>
          </MenuItem>
        </MenuList>
      </Paper>
    );
  })
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
