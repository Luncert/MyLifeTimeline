import { Divider, ToggleButton, ToggleButtonGroup } from "@suid/material";
import { createBucket } from "../mgrui/lib/components/utils";
import { For, JSX, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";
import { IoText } from 'solid-icons/io';
import { FaSolidPenNib } from 'solid-icons/fa';
import { globalCustomEventRegistry } from "../mgrui/lib/components/EventRegistry";
import Events from "../Events";
import TextComponent from "./component/TextComponent";

function TextComponentConfig() {
  return (
    <div>
      text component config
    </div>
  )
}

export interface BasicComponentProps extends JSX.HTMLAttributes<HTMLDivElement> {
}

interface Component {
  name: string;
  icon: ValidComponent;
  view: ValidComponent;
  configView: ValidComponent;
}

const components: {[k: string]: Component} = {
  text: {
    name: "Text",
    icon: IoText,
    view: TextComponent,
    configView: TextComponentConfig
  },
  pen: {
    name: "Pen",
    icon: FaSolidPenNib,
    view: TextComponent,
    configView: TextComponentConfig
  }
}

export default function ComponentBrowser() {
  const selectedMenu = createBucket<string>("componentBrowser");

  return (
    <div class="flex w-full h-full shrink">
      <ToggleButtonGroup class="p-1" color="info" exclusive orientation="vertical"
        value={selectedMenu()}
        onChange={(evt, v) => {
          selectedMenu(v);
          globalCustomEventRegistry.dispatch(new CustomEvent(Events.AddComponent, {
            detail: components[v].view
          }))
        }}
        sx={{
          "& > button": {
            border: "none"
          }
        }}>
        <For each={Object.keys(components)}>{name => (
          <ToggleButton value={name}>
            <Dynamic component={components[name].icon} />
          </ToggleButton>
        )}
        </For>
      </ToggleButtonGroup>
      <Divider orientation="vertical" />
      <div class="w-full h-full shrink">
        {/* <For each={Object.keys(views)}>{viewName => (
          <div class={selectedMenu() === viewName ? "block" : "hidden"}>
            <Dynamic component={views[viewName].view} />
          </div>
        )}
        </For> */}
      </div>
    </div>
  )
}