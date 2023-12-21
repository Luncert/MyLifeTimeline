import { StoreBucket, createBucket, createStoreBucket } from "../../mgrui/lib/components/utils";
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
  const editing = createBucket(false);
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

function createTextComponent() {
  const store = createStoreBucket<TextComponentAttributes>({
    content: "Text",
    font: "",
    italic: false,
    underline: false,
  });
  return [
    (props: any) => <TextComponent attrs={store} {...props} />,
    () => <Config attrs={store} />
  ]
}