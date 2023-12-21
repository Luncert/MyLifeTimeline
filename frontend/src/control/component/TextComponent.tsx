import { Match, Switch  } from "solid-js";
import { createBucket } from "../../mgrui/lib/components/utils";
import { Input, TextField, Typography } from "@suid/material";
import { BasicComponentProps } from "../ComponentBrowser";
import InteractElement from "./InteractElement";

export default function TextComponent(props: BasicComponentProps) {
  const content = createBucket("Text Component");
  const editing = createBucket(false);
  return (
    <InteractElement class="p-2 inline-block"
      draggable resizeable
      onFocusOrHover={editing}
      contentEditable={editing()}>
      {content()}
    </InteractElement>
  )
}


// <Switch>
// <Match when={props.focused}>
//   {/* <TextField value={content()}
//     autoFocus
//     onChange={(evt, v) => content(v)}
//     multiline
//     sx={{
//       width: "100%",
//       height: "100%"
//     }} /> */}
//   <pre  onChange={(evt) => content(evt.target.textContent || "")}>
//     {content()}
//   </pre>
// </Match>
// <Match when={!props.focused}>
//   <pre>{content()}</pre>
//   {/* <Input value={content()}
//     multiline
//     readOnly
//     sx={{
//       width: "100%",
//       outline: "none",
//       border: "none",
//       "& > textarea:focus": {
//         outline: "none",
//         border: "none",
//       }
//     }} /> */}
// </Match>
// </Switch>