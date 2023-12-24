import { Fab } from "@suid/material";
import Timeline from "./Timeline";
import { IoAdd } from 'solid-icons/io';
import { FiEdit2 } from 'solid-icons/fi';

export default function GalleryWithTimeline() {
  return (
    <div class="w-full h-full flex">
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
  )
}