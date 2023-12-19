import { Show, createContext } from "solid-js";
import { ResourceBrowser } from "./ResourceBrowser";
import { createData, useCtx } from "./utils";
import { createDomEventRegistry, globalCustomEventRegistry } from "./EventRegistry";
import { DraggingResource } from "./Resource";

export const Events = {
  DragTo: 'TimelineCreator:DragTo'
}

interface DraggingResourceContextDef {
  drag(res: Res, pos: Pos): void;
}

const DraggingResourceContext = createContext<DraggingResourceContextDef>();

export function useDraggingResource() {
  return useCtx<DraggingResourceContextDef>(DraggingResourceContext as any);
}

export default function TimelineCreator() {
  const eventRegistry = createDomEventRegistry();
  const dragging = createData<Res | null>(null);
  const draggingTo = createData<Pos>([0, 0]);
  
  const onMouseDown = (res: Res, pos: Pos) => {
    eventRegistry.on(window, 'mouseup', onMouseUp, false);
    eventRegistry.on(window, 'mousemove', onMouseMove, false);

    dragging(res);
    draggingTo(pos);
  };

  const onMouseMove = (evt: MouseEvent) => {
    draggingTo([evt.clientX, evt.clientY]);
  };

  const onMouseUp = () => {
    const res = dragging();
    if (res) {
      dragging(null);
      globalCustomEventRegistry.dispatch(
        new CustomEvent(Events.DragTo, { detail: { res } }));
    }
    eventRegistry.off(window, 'mousemove');
    eventRegistry.off(window, 'mouseup');
  };

  return (
    <DraggingResourceContext.Provider value={{
      drag: onMouseDown
    }}>
      <div class="relative w-full h-full">
        <div class="rounded-md overflow-hidden drop-shadow absolute z-10" style={{
          left: draggingTo()[0] + "px",
          top: draggingTo()[1] + "px",
        }}>
          <Show when={dragging() !== null}>
            <DraggingResource res={dragging() as Res} />
          </Show>
        </div>
        
        <div class="w-full h-full" style={{
          "background-color": "white",
          "background-image": "radial-gradient(#e4e4e7 3px, #fafafa 1px)",
          "background-size": "50px 50px",
          "background-position": "-25px -25px",
        }}>

        </div>
        <ResourceBrowser />
      </div>
    </DraggingResourceContext.Provider>
  )
}
