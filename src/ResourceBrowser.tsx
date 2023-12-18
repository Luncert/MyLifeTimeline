import { IconButton, Stack } from "@suid/material";
import { FiPlus  } from 'solid-icons/fi';
import { For, Match, Show, Switch, createContext, createSignal, onMount } from "solid-js";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand  } from 'solid-icons/tb';
import { createData, names, useCtx } from "./utils";
import { Resource } from "./Resource";
import { createDomEventRegistry } from "./EventRegistry";

interface ResourceBrowserContextDef {
  drag(evt: MouseEvent): void;
}

const ResourceBrowserContext = createContext<ResourceBrowserContextDef>();

export function useResourceBrowser() {
  return useCtx<ResourceBrowserContextDef>(ResourceBrowserContext as any);
}

export function ResourceBrowser(){
  const resourceSet = new Set<string>();
  const [collapsed, setCollapsed] = createSignal(false);
  const [resources, setResources] = createSignal<File[]>([]);
  
  const eventRegistry = createDomEventRegistry();
  const dragging = createData<Node | null>(null);
  const draggingTo = createData<Pos>([0, 0]);
  
  const onImport = (inputElem: HTMLInputElement) => {
    if (inputElem.files) {
      const files: File[] = [];
      for (let file of inputElem.files) {
        if (resourceSet.has(file.name)) {
          continue;
        }
        files.push(file);
        resourceSet.add(file.name);
      }
      setResources([...resources(), ...files]);
    }
  };
  
  const onMouseDown = (evt: MouseEvent) => {
    eventRegistry.on(window, 'mouseup', onMouseUp, false);
    eventRegistry.on(window, 'mousemove', onMouseMove, false);
    const elem = (evt.target as HTMLElement).cloneNode(true);
    (elem as HTMLElement).setAttribute("width", "300px");
    dragging(elem);
    draggingTo([evt.clientX, evt.clientY]);
  };

  const onMouseMove = (evt: MouseEvent) => {
    draggingTo([evt.clientX, evt.clientY]);
  };

  const onMouseUp = () => {
    dragging(null);
    eventRegistry.off(window, 'mousemove');
    eventRegistry.off(window, 'mouseup');
  };

  return (
    <>
      <div class="rounded-md overflow-hidden drop-shadow absolute z-10" style={{
        left: draggingTo()[0] + "px",
        top: draggingTo()[1] + "px",
      }}>
        <Show when={dragging() !== null}>
          {dragging()}
        </Show>
      </div>
      <div class={names("absolute top-[30px] w-[15%] h-[calc(100%-60px)] bg-white drop-shadow rounded-r-md transition-all",
        collapsed() ? "-translate-x-full" : "translate-x-[0px]")}>
        <div class="relative w-full h-full pt-10">
          <div class={names("absolute flex flex-row-reverse shrink-0 w-full top-0 bg-white rounded-md transition-all z-10",
            collapsed() ? "left-10" : "left-0")}>
            <IconButton color="primary"
              onClick={() => setCollapsed(!collapsed())}>
              <Switch>
                <Match when={collapsed()}>
                  <TbLayoutSidebarLeftExpand />
                </Match>
                <Match when={!collapsed()}>
                  <TbLayoutSidebarLeftCollapse />
                </Match>
              </Switch>
            </IconButton>
            <label for="import-configuration-input">
              <input
                class="hidden w-0 h-0"
                id="import-configuration-input"
                accept="image/*,video/*"
                type="file"
                multiple
                onChange={(evt) => onImport(evt.target)}
              />
              <IconButton color="primary" component="span">
                <FiPlus />
              </IconButton>
            </label>
          </div>
          <ResourceBrowserContext.Provider value={{
            drag: evt => onMouseDown(evt)
          }}>
            <div dir="rtl" class={names("relative w-full h-full shrink overflow-y-auto custom-scrollbar")}>
              <Stack class="p-2 gap-2">
                <For each={resources()}>{file => <Resource file={file} />}</For>
              </Stack>
            </div>
          </ResourceBrowserContext.Provider>
        </div>
      </div>
    </>
  )
}