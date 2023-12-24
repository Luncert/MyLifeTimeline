import { Divider } from "@suid/material";
import HomeSidebar, { Entry } from "./HomeSidebar";
import { createBucket } from "./mgrui/lib/components/utils";
import { FaSolidFolderClosed } from 'solid-icons/fa';
import { RiMediaGalleryFill } from 'solid-icons/ri';
import { For, ValidComponent } from "solid-js";
import ResourceBrowser from "./StorageManager";
import { Dynamic } from "solid-js/web";
import Gallery from "./Gallery";

interface EntryWithContent extends Entry {
  content: ValidComponent;
}

const entries: {[k: string]: EntryWithContent} = {
  resourceBrowser: {
    name: "Resource Browser",
    icon: FaSolidFolderClosed,
    content: ResourceBrowser
  },
  gallery: {
    name: "Gallery",
    icon: RiMediaGalleryFill,
    content: Gallery,
  }
}

export default function Home() {
  const activeEntry = createBucket("gallery");
  return (
    <div class="relative w-full h-full
      flex">
      <HomeSidebar activeEntry={activeEntry} entries={entries} />
      <Divider orientation="vertical" />
      <div class="w-full h-full shrink">
        <For each={Object.keys(entries)}>{name => (
          <div class="relative w-full h-full" style={{
            display: activeEntry() === name ? "block": "none"
          }}>
            <Dynamic component={entries[name].content} />
          </div>
        )}</For>
      </div>
    </div>
  )
}