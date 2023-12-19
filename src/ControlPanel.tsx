import { Divider, IconButton, ToggleButton, ToggleButtonGroup } from "@suid/material";
import { For, Match, Switch, ValidComponent, onMount } from "solid-js";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand  } from 'solid-icons/tb';
import { createData, names, removeElementsFromArray } from "./utils";
import { globalCustomEventRegistry } from "./EventRegistry";
import { Events } from "./TimelineCreator";
import { ResourceBrowser } from "./ResourceBrowser";
import { Dynamic } from "solid-js/web";
import { OcFiledirectoryopenfill2 } from 'solid-icons/oc';
import { RiSystemSettings3Fill } from 'solid-icons/ri';

interface ControlPanelView {
  name: string;
  icon: ValidComponent;
  view: ValidComponent;
}

const views: ControlPanelView[] = [
  {
    name: "Resource Manager",
    icon: OcFiledirectoryopenfill2,
    view: ResourceBrowser
  }
];

export function ControlPanel(){
  const resourceSet = new Set<string>();
  const collapsed = createData(false);
  const unusedResources = createData<Res[]>([]);
  const usedResources = createData<Res[]>([]);
  const selectedMenu = createData<string>(views[0].name);
  
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
    <div class={names("absolute top-[30px] w-[20%] h-[calc(100%-60px)] bg-white drop-shadow rounded-r-md transition-all",
      collapsed() ? "-translate-x-full" : "translate-x-[0px]")}>
      <div class="flex flex-col relative w-full h-full pt-10">
        {/* panel control */}
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
        </div>
        <Divider />
        <div class="flex w-full h-full shrink">
          <ToggleButtonGroup class="p-1" color="info" exclusive orientation="vertical"
            value={selectedMenu()}
            onChange={(evt, v) => selectedMenu(v)}
            sx={{
              "& > button": {
                border: "none"
              }
            }}>
            <For each={views}>{view => (
              <ToggleButton value={view.name}>
                <Dynamic component={view.icon} />
              </ToggleButton>
            )}
            </For>
          </ToggleButtonGroup>
          <Divider orientation="vertical" />
          <div class="w-full h-full shrink">
            <Switch>
              <For each={views}>{view => (
                <Match when={selectedMenu() === view.name}>
                  <Dynamic component={view.view} />
                </Match>
              )}
              </For>
            </Switch>
          </div>
        </div>
      </div>
    </div>
  )
}
