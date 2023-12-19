import { IconButton, Stack } from "@suid/material";
import { FiPlus  } from 'solid-icons/fi';
import { For, onMount } from "solid-js";
import { createData, names, removeElementsFromArray } from "../utils";
import { DraggableResource, MediaResource } from "../Resource";
import { globalCustomEventRegistry } from "../EventRegistry";
import { Tab, Tabs } from "../Tabs";
import { Events } from "../TimelineCreator";

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
    <div class="w-full h-full shrink">
      <Tabs value={selectedTab()} onChangeTab={selectedTab}>
        <Tab label="unused">Unused</Tab>
        <Tab label="used">Used</Tab>
        <div class="ml-auto">
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
  )
}