import { For, onMount } from "solid-js";
import { conditionalValue, createData, removeElementsFromArray } from "./utils";
import { globalCustomEventRegistry } from "./EventRegistry";
import { Events } from "./TimelineCreator";
import { DraggableResource } from "./Resource";

type ResWithPos = {
  pos: Pos;
} & Res;

export default function ResourceCanvas(props: {
  showGrid?: boolean;
}) {
  const resources = createData<ResWithPos[]>([]);
  const resourceSet = new Set<string>();
  let container: HTMLDivElement;

  onMount(() => {
    globalCustomEventRegistry.on(Events.DragTo, (evt) => {
      const res = evt.detail.res as Res;
      if (evt.detail.target !== container || resourceSet.has(res.file.name)) {
        return;
      }
      resourceSet.add(res.file.name);
      resources([...resources(), {...res, pos: evt.detail.pos}]);
    });
  });

  return (
    <div ref={el => container = el} class="w-full h-full"
      style={conditionalValue(props.showGrid, {
        "background-color": "white",
        "background-image": "radial-gradient(#e4e4e7 3px, #fafafa 1px)",
        "background-size": "50px 50px",
        "background-position": "-25px -25px",
      })}>
      <For each={resources()}>{res =>
        <DraggableResource sx={{
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
