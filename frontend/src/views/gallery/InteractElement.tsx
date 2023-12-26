import interact from "interactjs";
import { ValidComponent, onMount, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

export default function InteractElement(props: {
  component: ValidComponent;
  initialPos?: Pos;
} & any) {
  const [local, others] = splitProps(props, ["component", "initialPos"]);
  const initialPos = local.initialPos;
  let target: HTMLElement;
  
  onMount(() => {
    const i = interact(target);
    i.draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,
      // dragMoveListener from the dragging demo above
      listeners: { move: dragMoveListener }
    }).resizable({
      edges: { left: true, right: true, bottom: true, top: true },

      listeners: { move: resizeListener },

      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent'
        }),
  
        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 }
        })
      ],
  
      inertia: true
    });

    target.style.transform = `translate(${initialPos?.[0]}px, ${initialPos?.[1]}px)`;
  });

  return (
    <Dynamic component={local.component} ref={(el: HTMLElement) => target = el}
      {...others} />
  )
}

function resizeListener(event: any) {
  const target = event.target as HTMLDivElement;
  var x = parseFloat(target.getAttribute('data-x') || "0");
  var y = parseFloat(target.getAttribute('data-y') || "0");

  // update the element's style
  target.style.width = event.rect.width + 'px'
  target.style.height = event.rect.height + 'px'

  // translate when resizing from top or left edges
  x += event.deltaRect.left
  y += event.deltaRect.top

  target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

  target.setAttribute('data-x', x + "")
  target.setAttribute('data-y', y + "")
}

function dragMoveListener(event: any) {
  var target = event.target

  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}