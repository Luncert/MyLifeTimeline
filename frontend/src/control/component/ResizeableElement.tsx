import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export default function ResizeableElement(props: {
} & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["children"]);
  return (
    <div class="absolute" {...others}>
      {local.children}
    </div>
  )
}