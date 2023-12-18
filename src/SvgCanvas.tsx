import { JSX } from "solid-js"

export default function SvgCanvas(props: {
  anchor: Element | null;
  children: JSX.Element;
}) {
  if (props.anchor === null) {
    return (<></>);
  }
  return (
    <svg class="absolute z-10" style={{
      left: props.anchor.getBoundingClientRect().left + "px",
      top: props.anchor.getBoundingClientRect().top + "px",
    }}>
      {props.children}
    </svg>
  )
}