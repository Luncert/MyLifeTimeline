import { Show, createContext, createMemo } from "solid-js";
import { createData, useCtx } from "./utils";
import { createDomEventRegistry, globalCustomEventRegistry } from "./EventRegistry";
import { MediaResource } from "./Resource";
import ResourceCanvas from "./ResourceCanvas";
import { ControlPanel } from "./ControlPanel";
import Events from "./Events";

interface TimelineCreatorContextDef {
  drag(res: Res, mousePos: Pos, mouseOffsetToElement: Pos): void;
}

const TimelineCreatorContext = createContext<TimelineCreatorContextDef>();

export function useTimelineCreator() {
  return useCtx<TimelineCreatorContextDef>(TimelineCreatorContext as any);
}

export default function TimelineCreator() {
  const eventRegistry = createDomEventRegistry();
  const dragging = createData<Res | null>(null);
  const mousePosition = createData<Pos>([0, 0]);
  const mouseOffsetToElement = createData<Pos>([0, 0]);
  const draggingTo = createMemo(() => {
    const pos = mousePosition();
    const offset = mouseOffsetToElement();
    return [pos[0] - offset[0], pos[1] - offset[1]];
  });
  
  const onMouseDown = (res: Res, mousePos: Pos, mouseOffsetToElem: Pos) => {
    eventRegistry.on(window, 'mouseup', onMouseUp, false);
    eventRegistry.on(window, 'mousemove', onMouseMove, false);

    dragging(res);
    mousePosition(mousePos);
    mouseOffsetToElement(mouseOffsetToElem);
  };

  const onMouseMove = (evt: MouseEvent) => {
    mousePosition([evt.clientX, evt.clientY]);
  };

  const onMouseUp = (evt: MouseEvent) => {
    const res = dragging();
    if (res) {
      dragging(null);
      const offset = mouseOffsetToElement();
      console.log(offset)
      globalCustomEventRegistry.dispatch(
        new CustomEvent(Events.DragTo, {
          detail: {
            res,
            pos: [evt.clientX - offset[0], evt.clientY - offset[1]],
            target: evt.target
          }
        }));
    }
    eventRegistry.off(window, 'mousemove');
    eventRegistry.off(window, 'mouseup');
  };

  return (
    <TimelineCreatorContext.Provider value={{
      drag: onMouseDown,
    }}>
      <div class="relative w-full h-full">
        <div class="rounded-md overflow-hidden drop-shadow absolute z-10" style={{
          left: draggingTo()[0] + "px",
          top: draggingTo()[1] + "px",
        }}>
          <Show when={dragging() !== null}>
            <MediaResource class="border-2 border-sky-300" res={dragging() as Res} />
          </Show>
        </div>
        <ResourceCanvas />
        <ControlPanel />
      </div>
    </TimelineCreatorContext.Provider>
  )
}
