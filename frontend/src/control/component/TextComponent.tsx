import { Match, Switch, splitProps } from "solid-js";
import ResizeableElement from "./ResizeableElement";
import { createBucket } from "../../mgrui/lib/components/utils";
import { Input, TextField, Typography } from "@suid/material";
import { BasicComponentProps } from "../ComponentBrowser";

export default function TextComponent(props: {
} & BasicComponentProps) {
  const editting = createBucket(false);
  const content = createBucket("Text Component");
  const [local, others] = splitProps(props, []);

  return (
    <ResizeableElement {...others}>
      <Switch>
        <Match when={editting()}>
          {/* <TextField value={content()} onChange={(evt, v) => content(v)} /> */}
          <Input value={content()}
            onBlur={() => editting(false)}
            onChange={(evt, v) => content(v)} />
        </Match>
        <Match when={!editting()}>
          <Typography onClick={() => editting(true)}>{content()}</Typography>
        </Match>
      </Switch>
    </ResizeableElement>
  )
}