import { Match, Switch } from "solid-js";
import ResizeableElement from "./ResizeableElement";
import { createBucket } from "../../mgrui/lib/components/utils";
import { TextField, Typography } from "@suid/material";
import { BasicComponentProps } from "../ComponentBrowser";

export default function TextComponent(props: {
  defaultValue?: string;
} & BasicComponentProps) {
  const editting = createBucket(false);
  const content = createBucket(props.defaultValue);

  return (
    <ResizeableElement>
      <Switch>
        <Match when={props.editable && editting()}>
          <TextField value={content()} onChange={(evt, v) => content(v)} />
        </Match>
        <Match when={!editting()}>
          <Typography onClick={() => editting(true)}>{content()}</Typography>
        </Match>
      </Switch>
    </ResizeableElement>
  )
}