import { JSX, ValidComponent } from "solid-js";
import { StoreBucket, bucket, createStoreBucket } from "../../mgrui/lib/components/utils";
import { BasicComponentProps } from "../ComponentBrowser";
import InteractElement from "./InteractElement";

interface TextComponentAttributes {
  font: string;
  underline: boolean;
  italic: boolean;
  content: string;
}
interface TextComponentProps {
  attrs: StoreBucket<TextComponentAttributes>;
}

function TextComponent(props: TextComponentProps) {
  const editing = bucket(false);
  return (
    <InteractElement class="p-2 inline-block"
      draggable
      onFocusOrHover={editing}
      contentEditable={editing()}
      {...props}>
      {props.attrs.content}
    </InteractElement>
  );
}

function Config(props: TextComponentProps) {
  return (
    <div>
      hi
    </div>
  )
}

export default function createTextComponent(): [ValidComponent, JSX.Element] {
  const store = createStoreBucket<TextComponentAttributes>({
    content: "Text",
    font: "",
    italic: false,
    underline: false,
  });
  return [
    (props: any) => <TextComponent attrs={store} {...props} />,
    <Config attrs={store} />
  ]
}