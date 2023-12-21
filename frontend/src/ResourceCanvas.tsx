import { For, onMount } from "solid-js";
import { conditionalValue, createBucket, removeElementsFromArray } from "./mgrui/lib/components/utils";
import { globalCustomEventRegistry } from "./EventRegistry";
import { DraggableResource } from "./Resource";
import Events from "./Events";

type ResWithPos = {
  pos: Pos;
} & Res;

export default function ResourceCanvas(props: {
  showGrid?: boolean;
}) {
  const resourceSet = new Set<string>();
  const resources = createBucket<ResWithPos[]>([]);
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
      resources([...resources(), {...res, pos: evt.detail.pos}]);
    });
    globalCustomEventRegistry.on(Events.SetBackground, (evt) => {
      const res = evt.detail as Res;
      background(res);
    })
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
      <For each={resources()}>{res =>
        <DraggableResource class="rounded-none" style={{
          position: "absolute",
          left: res.pos[0] + "px",
          top: res.pos[1] + "px",
        }} res={res} onDrag={() => {
          resourceSet.delete(res.file.name);
          const r = resources();
          removeElementsFromArray(r, (f) => f.file.name === res.file.name);
          resources([...r]);
        }}/>}
      </For>
    </div>
  )
}
