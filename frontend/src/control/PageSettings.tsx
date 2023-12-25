import { Button, Stack, TextField, Typography } from "@suid/material";
import { createBucket } from "../mgrui/lib/components/utils";
import StorageBrowserModal from "../views/storageManager/StorageBrowserModal";

export default function PageSettings() {
  const title = createBucket("");
  const openModal = createBucket(false);
  const background = createBucket<StorageFile | null>(null);

  return (
    <div class="w-full h-full">
      <div class="p-1 pt-2 w-full">
        <TextField class="w-full" label="Title" size="small"  autoComplete="none"
          value={title()} onChange={(evt, v) => title(v)} />
      </div>
      <Stack class="items-center" direction="row">
        <Typography>Background:</Typography>
        <Button onClick={() => openModal(true)}>select</Button>
      </Stack>
      <StorageBrowserModal open={openModal} onClose={(files) => background(files[0])}/>
    </div>
  )
}