import { Button, Stack, TextField, Typography } from "@suid/material";
import { createBucket } from "../../mgrui/lib/components/utils";
import StorageBrowserModal from "../storageManager/StorageBrowserModal";
import { useGalleryCanvas } from "./GalleryCanvas";
import { createEffect } from "solid-js";
import getBackend from "../../service/Backend";

export default function PageSettings() {
  const canvas = useGalleryCanvas();
  const openStorageBrowserModal = createBucket(false);
  const background = createBucket<StorageFile | null>(null);

  const onCloseStorageBrowserModal = (selectedFiles: StorageFile[] | null) => {
    if (selectedFiles) {
      background(selectedFiles[0]);
      openStorageBrowserModal(false);
    }
  }

  createEffect(() => {
    const file = background();
    if (file !== null) {
      canvas.background(getBackend().getFileUrl(file));
    }
  });

  return (
    <div class="flex flex-col w-full h-full p-2 gap-2">
      <TextField fullWidth label="Title" size="small" autoComplete="off"
        value={canvas.title()} onChange={(evt, v) => canvas.title(v)} />
      <TextField fullWidth label="Description" size="small" autoComplete="off"
        multiline minRows={4}
        value={canvas.title()} onChange={(evt, v) => canvas.title(v)} />
      <Stack class="items-center" direction="row" spacing={1}>
        <Typography>Background:</Typography>
        <Typography class="overflow-hidden whitespace-nowrap text-ellipsis">{background()?.name || ""}</Typography>
        <Button onClick={() => openStorageBrowserModal(true)}>select</Button>
      </Stack>
      <StorageBrowserModal open={openStorageBrowserModal()} onClose={onCloseStorageBrowserModal}/>
    </div>
  )
}