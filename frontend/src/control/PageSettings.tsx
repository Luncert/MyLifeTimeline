import { Button, Stack, TextField, Typography } from "@suid/material";
import { createBucket } from "../mgrui/lib/components/utils";
import StorageBrowserModal from "../views/storageManager/StorageBrowserModal";

export default function PageSettings() {
  const title = createBucket("");
  const openModal = createBucket(false);
  const background = createBucket<StorageFile | null>(null);

  return (
    <div class="flex flex-col w-full h-full p-2 gap-1">
      <div class="w-full">
        <TextField class="w-full" label="Title" size="small"  autoComplete="none"
          value={title()} onChange={(evt, v) => title(v)} />
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