import { IconButton, Stack } from "@suid/material";
import { FiPlus  } from 'solid-icons/fi';
import { For, Match, Switch, onMount } from "solid-js";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand  } from 'solid-icons/tb';
import { createData, names, removeElementsFromArray } from "./utils";
import { DraggableResource, MediaResource } from "./Resource";
import { globalCustomEventRegistry } from "./EventRegistry";
import { Tab, Tabs } from "./Tabs";
import { Events } from "./TimelineCreator";

export function ResourceBrowser(){
  const resourceSet = new Set<string>();
  const collapsed = createData(false);
  const unusedResources = createData<Res[]>([]);
  const usedResources = createData<Res[]>([]);
  const selectedTab = createData<string>("unused");
  
  
  const onImport = (inputElem: HTMLInputElement) => {
    if (inputElem.files) {
      const arr: Res[] = [];
      for (let file of inputElem.files) {
        if (resourceSet.has(file.name)) {
          continue;
        }
        arr.push({file, src: URL.createObjectURL(file)});
        resourceSet.add(file.name);
      }
      unusedResources([...unusedResources(), ...arr]);
    }
  };

  onMount(() => {
    globalCustomEventRegistry.on(Events.DragTo, (evt) => {
      const res = evt.detail.res as Res;
      const unused = unusedResources();
      const removed = removeElementsFromArray(unused, (f) => f.file.name === res.file.name);
      if (removed.length > 0) {
        unusedResources([...unused]);
        usedResources([...usedResources(), res]);
      }
    });
  });

  return (
    <>
      <div class={names("absolute top-[30px] w-[15%] h-[calc(100%-60px)] bg-white drop-shadow rounded-r-md transition-all",
        collapsed() ? "-translate-x-full" : "translate-x-[0px]")}>
        <div class="flex flex-col relative w-full h-full pt-10">
          <div class={names("absolute flex flex-row-reverse shrink-0 w-full top-0 bg-white",
            "rounded-md transition-all z-10",
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

          <div dir="rtl" class={names("relative w-full h-full shrink overflow-y-auto custom-scrollbar",
            selectedTab() === 'unused' ? "block" : "hidden")}>
            <Stack class="p-2 gap-2">
              <For each={unusedResources()}>{res => <DraggableResource res={res} />}</For>
            </Stack>
          </div>
          <div dir="rtl" class={names("relative w-full h-full shrink overflow-y-auto custom-scrollbar",
            selectedTab() === 'used' ? "block" : "hidden")}>
            <Stack class="p-2 gap-2">
              <For each={usedResources()}>{res => <MediaResource res={res} />}</For>
            </Stack>
          </div>
        </div>
      </div>
    </>
  )
}