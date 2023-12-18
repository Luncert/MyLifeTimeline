import { IconButton, Stack } from "@suid/material";
import { FiPlus  } from 'solid-icons/fi';
import { For, Match, Show, Switch, createContext, createMemo, createSignal, onMount } from "solid-js";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand  } from 'solid-icons/tb';
import { createData, names, useCtx } from "./utils";
import { DraggingResource, Resource } from "./Resource";
import { createDomEventRegistry } from "./EventRegistry";
import { Tab, Tabs } from "./Tabs";

interface ResourceBrowserContextDef {
  drag(file: File, pos: Pos): void;
}

const ResourceBrowserContext = createContext<ResourceBrowserContextDef>();

export function useResourceBrowser() {
  return useCtx<ResourceBrowserContextDef>(ResourceBrowserContext as any);
}

export function ResourceBrowser(){
  const resourceSet = new Set<string>();
  const collapsed = createData(false);
  const unusedResources = createData<File[]>([]);
  const usedResources = createData<File[]>([]);
  const selectedTab = createData<string>("unused");
  
  const eventRegistry = createDomEventRegistry();
  const dragging = createData<File | null>(null);
  const draggingTo = createData<Pos>([0, 0]);

  const filteredResources = createMemo(() => {
    switch (selectedTab()) {
      case "used":
        return usedResources();
      case "ununsed":
      default:
        return unusedResources();
    }
  });
  
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
      unusedResources([...unusedResources(), ...files]);
    }
  };
  
  const onMouseDown = (file: File, pos: Pos) => {
    eventRegistry.on(window, 'mouseup', onMouseUp, false);
    eventRegistry.on(window, 'mousemove', onMouseMove, false);

    dragging(file);
    draggingTo(pos);
  };

  const onMouseMove = (evt: MouseEvent) => {
    draggingTo([evt.clientX, evt.clientY]);
  };

  const onMouseUp = () => {
    const res = dragging();
    if (res) {
      dragging(null);
      let i = 0;
      const unused = unusedResources();
      for (const f of unused) {
        if (f.name === res.name) {
          unused.splice(i);
          unusedResources([...unused]);
          usedResources([...usedResources(), res]);
          break;
        }
        i++;
      }
    }
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
          <DraggingResource file={dragging() as File} />
        </Show>
      </div>
      <div class={names("absolute top-[30px] w-[15%] h-[calc(100%-60px)] bg-white drop-shadow rounded-r-md transition-all",
        collapsed() ? "-translate-x-full" : "translate-x-[0px]")}>
        <div class="relative w-full h-full pt-10">
          <div class={names("absolute flex flex-row-reverse shrink-0 w-full top-0 bg-white rounded-md transition-all z-10",
            collapsed() ? "left-10" : "left-0")}>
            <IconButton color="primary"
              onClick={() => collapsed(!collapsed())}>
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

          <Tabs class="justify-center" value={selectedTab()} onChangeTab={selectedTab}>
            <Tab label="unused">Unused</Tab>
            <Tab label="used">Used</Tab>
          </Tabs>

          <ResourceBrowserContext.Provider value={{
            drag: onMouseDown
          }}>
            <div dir="rtl" class={names("relative w-full h-full shrink overflow-y-auto custom-scrollbar")}>
              <Stack class="p-2 gap-2">
                <For each={filteredResources()}>{file => <Resource file={file} />}</For>
              </Stack>
            </div>
          </ResourceBrowserContext.Provider>
        </div>
      </div>
    </>
  )
}