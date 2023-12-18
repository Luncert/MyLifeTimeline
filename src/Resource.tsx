import { Box, IconButton } from "@suid/material";
import { Match, Show, Switch } from "solid-js";
import { useResourceBrowser } from "./ResourceBrowser";
import { AiTwotoneDelete } from 'solid-icons/ai';
import { createData } from "./utils";

export function Resource(props: {
  file: File;
  onRemove: () => void;
}) {
  const rb = useResourceBrowser();
  const hovered = createData(false);

  return (
    <Box class="relative drop-shadow rounded-md overflow-hidden"
      onMouseDown={rb.drag}
      onMouseEnter={() => hovered(true)}
      onMouseLeave={() => hovered(false)}>
      <Switch>
        <Match when={props.file.type.startsWith("image")}>
          <img class="select-none" draggable={false} src={URL.createObjectURL(props.file)} />
        </Match>
        <Match when={props.file.type.startsWith("video")}>
          <video class="select-none" width="100%" controls>
            <source src={URL.createObjectURL(props.file)} />
          </video>
        </Match>
      </Switch>
      <div class="absolute top-0 right-0">
        <Show when={hovered()}>
          <IconButton size="small" color="error" onClick={() => props.onRemove()}>
            <AiTwotoneDelete />
          </IconButton>
        </Show>
      </div>
    </Box>
  )
}
