import { IconButton, Stack } from "@suid/material";
import { FiPlus  } from 'solid-icons/fi';
import { For } from "solid-js";
import { createBucket, createStampedBucket, names } from "../../mgrui/lib/components/utils";
import { Tab, Tabs } from "../../mgrui/lib/components/navigation/Tabs";
import StorageBrowserModal from "../storageManager/StorageBrowserModal";
import MediaFile from "./MediaFile";
import { useGalleryCanvas } from "./GalleryCanvas";

export function ResourceBrowser(){
  const canvas = useGalleryCanvas();
  const selectedTab = createBucket<string>("imported");
  const openStorageBrowserModal = createBucket(false);
  const importedFiles = createStampedBucket(new Set<StorageFile>());

  const onCloseStorageBrowserModal = (selectedFiles: StorageFile[] | null) => {
    openStorageBrowserModal(false);
    importedFiles((files) => {
      if (selectedFiles) {
        selectedFiles.forEach((f) => files.add(f));
        canvas.add(...Array.from(selectedFiles.values()));
      }
    });
  };

  return (
    <div class="w-full h-full">
      <Tabs value={selectedTab()} onChangeTab={selectedTab}>
        <Tab label="imported">imported</Tab>
        <div class="ml-auto">
          <IconButton color="primary" onClick={() => openStorageBrowserModal(true)}>
            <FiPlus />
          </IconButton>
        </div>
      </Tabs>

      <div dir="rtl" class={names("relative w-full h-full shrink overflow-y-auto custom-scrollbar",
        selectedTab() === 'imported' ? "block" : "hidden")}>
        <Stack class="p-2 gap-2">
          <For each={Array.from(importedFiles().data.values())}>
            {f => <MediaFile file={f} />}
          </For>
        </Stack>
      </div>

      <StorageBrowserModal multiple
        open={openStorageBrowserModal()} onClose={onCloseStorageBrowserModal}/>
    </div>
  )
}