import { Fab } from "@suid/material";
import Timeline from "./Timeline";
import { IoAdd } from 'solid-icons/io';
import { FiEdit2 } from 'solid-icons/fi';
import ScrollBox from "../../mgrui/lib/components/ScrollBox";
import StorageBrowserModal from "../storageManager/StorageBrowserModal";
import { createBucket } from "../../mgrui/lib/components/utils";
import GalleryCanvas from "./GalleryCanvas";

export default function GalleryWithTimeline() {
  return (
    <div class="w-full h-full flex">
      <ScrollBox>
        <Edit />
      </ScrollBox>
    </div>
  )
}

function Show() {
  return (
    <div id="gallery-with-timeline-show" class="w-full h-full">
      <Timeline />
      <div class="absolute bottom-4 right-4 flex flex-col gap-2">
        <Fab color="info" aria-label="add" size="small">
          <IoAdd />
        </Fab>
        <Fab color="info" aria-label="edit" size="small">
          <FiEdit2 />
        </Fab>
      </div>
    </div>
  );
}

function Edit() {
  return (
    <div id="gallery-with-timeline-edit" class="w-full h-full">
      <GalleryCanvas />
    </div>
  );
}