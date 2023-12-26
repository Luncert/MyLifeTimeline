import { Button, Stack, TextField, Typography } from "@suid/material";
import { createBucket } from "../../mgrui/lib/components/utils";
import StorageBrowserModal from "../storageManager/StorageBrowserModal";
import { useGalleryCanvas } from "./GalleryCanvas";
import { createEffect } from "solid-js";
import getBackend from "../../service/Backend";
import Paths from "../../common/Paths";

export default function PageSettings() {
  const canvas = useGalleryCanvas();
  const openModal = createBucket(false);
  const background = createBucket<StorageFile | null>(null);
  createEffect(() => {
    const file = background();
    if (file !== null) {
      getBackend().getBinary(Paths.resolvePath(file.path))
        .then((v) => {
          const reader = new FileReader();
          reader.readAsDataURL(v);
          reader.onload = () => {
            canvas.background(reader.result as string);
            console.log(reader.result)
          }
        });
    }
  });

  return (
    <div class="flex flex-col w-full h-full p-2 gap-1">
      <div class="w-full">
        <TextField class="w-full" label="Title" size="small"  autoComplete="none"
          value={canvas.title()} onChange={(evt, v) => canvas.title(v)} />
      </div>
      <Stack class="items-center" direction="row" spacing={1}>
        <Typography>Background:</Typography>
        <Typography class="overflow-hidden whitespace-nowrap text-ellipsis">{background()?.name || ""}</Typography>
        <Button onClick={() => openModal(true)}>select</Button>
      </Stack>
      <StorageBrowserModal open={openModal} onClose={(files) => background(files[0])}/>
    </div>
  )
}