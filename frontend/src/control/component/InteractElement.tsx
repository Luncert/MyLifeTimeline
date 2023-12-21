import interact from "interactjs"
import { JSX, createEffect, onMount, splitProps } from "solid-js"
import { conditionalString, createBucket, names } from "../../mgrui/lib/components/utils";
import { createDomEventRegistry } from "../../mgrui/lib/components/EventRegistry";

export default function InteractElement(props: {
  initialPos?: Pos;
  draggable?: boolean;
  resizeable?: boolean;
  onFocusOrHover?: Consumer<boolean>;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["initialPos", "class", "draggable", "resizeable", "onFocusOrHover", "children"]);
  const initialPos = local.initialPos;
  let ref: HTMLDivElement
  const focused = createBucket(false);
  const hovered = createBucket(false);

  createEffect(() => {
    local.onFocusOrHover?.(focused() || hovered());
  });

  const eventRegistry = createDomEventRegistry();

  onMount(() => {
    const i = interact(ref);
    if (props.draggable) {
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
      });
    }
    if (props.resizeable) {
      i.resizable({
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
    }

    eventRegistry.on(window, "mousedown", (evt) => {
      if (ref.contains(evt.target)) {
        return;
      }
      focused(false);
    }, true);

    ref.style.transform = `translate(${initialPos?.[0]}px, ${initialPos?.[1]}px)`;
  });


  return (
    <div class={names("inline-block",  local.class || "",
      conditionalString(focused() || hovered(), "rounded-md bg-sky-300"),
      )}
      ref={el => ref = el}
      onMouseEnter={() => hovered(true)}
      onMouseLeave={() => hovered(false)}
      onMouseDown={() => focused(true)}
      {...others}
      data-x={initialPos?.[0]}
      data-y={initialPos?.[1]}>
      {local.children}
    </div>
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