import { Divider, IconButton, ToggleButton, ToggleButtonGroup } from "@suid/material";
import { For, Match, Switch, ValidComponent, onMount } from "solid-js";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand  } from 'solid-icons/tb';
import { createBucket, names, removeElementsFromArray } from "../../mgrui/lib/components/utils";
import { globalCustomEventRegistry } from "../../mgrui/lib/components/EventRegistry";
import { ResourceBrowser } from "../../control/ResourceBrowser";
import { Dynamic } from "solid-js/web";
import { OcFiledirectoryopenfill2 } from 'solid-icons/oc';
import { RiSystemSettings3Fill } from 'solid-icons/ri';
import PageSettings from "./PageSettings";
import Events from "../../Events";
import { BiSolidComponent } from "solid-icons/bi";
import ComponentBrowser from "../../control/ComponentBrowser";

interface ControlPanelView {
  name: string;
  icon: ValidComponent;
  view: ValidComponent;
}

const views: {[k: string]: ControlPanelView} = {
  // resourceManager: {
  //   name: "Resource Manager",
  //   icon: OcFiledirectoryopenfill2,
  //   view: ResourceBrowser
  // },
  // componentBrowser: {
  //   name: "Components",
  //   icon: BiSolidComponent,
  //   view: ComponentBrowser
  // },
  pageSettings: {
    name: "Page Settings",
    icon: RiSystemSettings3Fill,
    view: PageSettings
  },
};

export function ControlPanel(){
  const collapsed = createBucket(false);
  const unusedResources = createBucket<Res[]>([]);
  const usedResources = createBucket<Res[]>([]);
  const selectedMenu = createBucket<string>("pageSettings");
  
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
      <div class="flex flex-col relative w-full h-full overflow-hidden">
        <div class="h-10 leading-10 px-2 align-middle font-semibold text-zinc-600">{views[selectedMenu()].name}</div>
        <div class={names("absolute flex flex-row-reverse shrink-0 top-0 bg-white",
          "rounded-md transition-all z-10",
          collapsed() ? "-right-10" : "right-0")}>
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

        <div class="relative flex w-full h-full shrink">
          <ToggleButtonGroup class="p-1" color="info" exclusive orientation="vertical"
            value={selectedMenu()}
            onChange={(evt, v) => selectedMenu(v)}
            sx={{
              "& > button": {
                border: "none"
              }
            }}>
            <For each={Object.keys(views)}>{viewName => (
              <ToggleButton value={viewName}>
                <Dynamic component={views[viewName].icon} />
              </ToggleButton>
            )}
            </For>
          </ToggleButtonGroup>

          <Divider orientation="vertical" />

          <div class="w-full h-full shrink overflow-hidden">
            <For each={Object.keys(views)}>{viewName => (
              <div class={selectedMenu() === viewName ? "block" : "hidden"}>
                <Dynamic component={views[viewName].view} />
              </div>
            )}
            </For>
          </div>
        </div>
      </div>
    </div>
  )
}
