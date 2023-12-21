import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export default function ResizeableElement(props: {
  children: JSX.Element;
}) {
  const [local, others] = splitProps(props, ["children"]);
  return (
    <div {...others}>
      {local.children}
    </div>
  )
}