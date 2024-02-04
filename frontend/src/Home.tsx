import { Divider, Paper } from "@suid/material";
import HomeSidebar, { Entry } from "./HomeSidebar";
import { bucket } from "./mgrui/lib/components/utils";
import { FaSolidFolderClosed } from 'solid-icons/fa';
import { For, ValidComponent } from "solid-js";
import ResourceBrowser from "./views/storageManager/StorageManager";
import { Dynamic } from "solid-js/web";
import GalleryWithTimeline from "./views/gallery/GalleryWithTimeline";
import { FaSolidTimeline } from 'solid-icons/fa';
import { RiDeviceDeviceFill } from 'solid-icons/ri';
import GoProConnection from "./views/devices/GoProConnection";
import UsbConnection from "./views/devices/UsbConnection";

interface EntryWithContent extends Entry {
  content: ValidComponent;
}

const entries: {[k: string]: EntryWithContent} = {
  resourceBrowser: {
    name: "Resource Browser",
    icon: FaSolidFolderClosed,
    content: ResourceBrowser
  },
  // gallery: {
  //   name: "Gallery",
  //   icon: FaSolidTimeline,
  //   content: GalleryWithTimeline,
  // },
  // devices: {
  //   name: "External Devices",
  //   icon: RiDeviceDeviceFill,
  //   content: GoProConnection,
  // }
}

export default function Home() {
  const activeEntry = bucket("resourceBrowser");
  return (
    <Paper square class="relative w-full h-full flex">
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
    </Paper>
  )
}