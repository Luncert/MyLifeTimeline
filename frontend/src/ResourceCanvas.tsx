import { For, ValidComponent, onMount } from "solid-js";
import { conditionalValue, createBucket, removeElementsFromArray } from "./mgrui/lib/components/utils";
import { globalCustomEventRegistry } from "./mgrui/lib/components/EventRegistry";
import { DraggableResource } from "./Resource";
import Events from "./Events";
import { Dynamic } from "solid-js/web";

type ResWithPos = {
  pos: Pos;
} & Res;

type ComponentWithPos = {
  pos: Pos;
  component: ValidComponent;
};

type CanvasItem = ResWithPos | ComponentWithPos;

export default function ResourceCanvas(props: {
  showGrid?: boolean;
}) {
  const resourceSet = new Set<string>();
  const items = createBucket<CanvasItem[]>([]);
  const background = createBucket<Res | null>(null);
  let container: HTMLDivElement;

  onMount(() => {
    globalCustomEventRegistry.on(Events.DragTo, (evt) => {
      const res = evt.detail.res as Res;
      // evt.detail.target !== container || target is img
      if (resourceSet.has(res.file.name)) {
        return;
      }
      resourceSet.add(res.file.name);
      items([...items(), {...res, pos: evt.detail.pos}]);
    });
    globalCustomEventRegistry.on(Events.SetBackground, (evt) => {
      const res = evt.detail as Res;
      background(res);
    });
    globalCustomEventRegistry.on(Events.AddComponent, (evt) => {
      const component = evt.detail as ValidComponent;
      items([...items(), { pos: [300, 300], component }]);
    });
  });

  return (
    <div ref={el => container = el} class="w-full h-full"
      style={Object.assign({},
        conditionalValue(props.showGrid, {
          "background-color": "white",
          "background-image": "radial-gradient(#e4e4e7 3px, #fafafa 1px)",
          "background-size": "50px 50px",
          "background-position": "-25px -25px",
        }),
        conditionalValue(background(), {
          "background-image": `url(${background()?.src})`,
          "background-size": "cover"
        }))}>
      <For each={items()}>{item => {
        if (typeof(item) === "object" && "file" in item) {
          const i = item as ResWithPos;
          return (
            <DraggableResource class="rounded-none" style={{
              position: "absolute",
              left: i.pos[0] + "px",
              top: i.pos[1] + "px",
            }} res={i} onDrag={() => {
              resourceSet.delete(i.file.name);
              const r = items();
              removeElementsFromArray(r, (f) => typeof(f) === "object" && "file" in f && f.file.name === i.file.name);
              items([...r]);
            }}/>
          )
        } else {
          const i = item as ComponentWithPos;
          return (
            <Dynamic component={i.component} style={{
              left: i.pos[0] + "px",
              top: i.pos[1] + "px"
            }} />
          )
        }
      }}</For>
    </div>
  )
}
