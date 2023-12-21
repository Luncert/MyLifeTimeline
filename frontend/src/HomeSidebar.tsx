import { ToggleButton, ToggleButtonGroup } from "@suid/material";
import { For, ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

export interface Entry {
  name: string;
  icon: ValidComponent;
}

export default function HomeSidebar(props: {
  activeEntry: Bucket<string>;
  entries: {[k: string]: Entry};
}) {
  return (
    <div class="shrink-0">
      <ToggleButtonGroup class="p-1" color="info" orientation="vertical"
        exclusive
        value={props.activeEntry()}
        onChange={(evt, v) => props.activeEntry(v)}
        size="large"
        sx={{
          "& > button": {
            padding: "10px",
            border: "none",
            fontSize: "1.25rem",
            lineHeight: "1.75rem"
          }
        }}>
        <For each={Object.keys(props.entries)}>{name => (
          <ToggleButton value={name}>
            <Dynamic component={props.entries[name].icon} />
          </ToggleButton>
        )}
        </For>
      </ToggleButtonGroup>
    </div>
  )
}