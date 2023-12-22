import { Divider } from "@suid/material";
import HomeSidebar, { Entry } from "./HomeSidebar";
import { createBucket } from "./mgrui/lib/components/utils";
import { FaSolidFolderClosed } from 'solid-icons/fa';
import { For, ValidComponent } from "solid-js";
import ResourceBrowser from "./StorageManager";
import { Dynamic } from "solid-js/web";

interface EntryWithContent extends Entry {
  content: ValidComponent;
}

const entries: {[k: string]: EntryWithContent} = {
  resourceBrowser: {
    name: "Resource Browser",
    icon: FaSolidFolderClosed,
    content: ResourceBrowser
  }
}

export default function Home() {
  const activeEntry = createBucket("resourceBrowser");
  return (
    <div class="relative w-full h-full
      flex">
      <HomeSidebar activeEntry={activeEntry} entries={entries} />
      <Divider orientation="vertical" />
      <div class="w-full h-full shrink">
        <For each={Object.keys(entries)}>{name => (
          <Dynamic component={entries[name].content} />
        )}</For>
      </div>
    </div>
  )
}