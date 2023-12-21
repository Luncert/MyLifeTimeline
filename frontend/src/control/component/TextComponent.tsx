import { createBucket } from "../../mgrui/lib/components/utils";
import { BasicComponentProps } from "../ComponentBrowser";
import InteractElement from "./InteractElement";

export default function TextComponent(props: any) {
  const content = createBucket("Text Component");
  const editing = createBucket(false);
  return (
    <InteractElement class="p-2 inline-block"
      draggable
      onFocusOrHover={editing}
      contentEditable={editing()}
      {...props}>
      {content()}
    </InteractElement>
  )
}