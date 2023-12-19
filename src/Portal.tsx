import { JSX, Show } from "solid-js";
import { Portal as P } from "solid-js/web";

export default function Portal(props: {
  show: boolean;
  mount?: Node;
  children: JSX.Element;
}) {
  return (
    <P mount={props.mount}>
      <Show when={props.show}>
        {props.children}
      </Show>
    </P>
  )
}