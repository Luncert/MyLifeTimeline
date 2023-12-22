import { Breadcrumbs, Button, ButtonGroup, Divider, IconButton, InputAdornment, Popover, Stack, TextField } from "@suid/material";
import { IoArrowBackOutline, IoArrowForwardOutline } from 'solid-icons/io';
import { For, createEffect, createResource } from "solid-js";
import { createBucket } from "./mgrui/lib/components/utils";
import { FaSolidUpload } from 'solid-icons/fa';
import { CgFolderAdd } from 'solid-icons/cg';
import { FaSolidCheck } from 'solid-icons/fa';
import getBackend from "./service/Backend";
import FileElement from "./FileElement";
import { useStorageManager } from "./StorageManager";

export default function CurrentPathBrowser() {
  const ctx = useStorageManager();
  const createNewFolderAnchor = createBucket<HTMLElement | null>(null);
  const newFolderName = createBucket("");

  const [files, filesAction] = createResource(
    () => getBackend().listFiles(ctx.getPath()),
    { initialValue: [] as StorageFile[] }
  );

  createEffect(() => {
    ctx.getPath();
    filesAction.refetch();
  });

  const createNewFolder = () => {
    const name = newFolderName();
    if (name.length === 0) {
      return;
    }
    getBackend().createDirectory(ctx.getPath(name))
      .then(() => filesAction.refetch());
  };

  return (
    <div class="flex flex-col w-full h-full shrink">
      <Stack class="h-10 p-1 gap-x-1" direction="row">
        <ButtonGroup class="shrink-0" variant="contained" size="small">
          <Button size="small" onClick={(evt) => {
            createNewFolderAnchor(evt.currentTarget);
          }}>
            <CgFolderAdd />
          </Button>
          <Popover
            open={createNewFolderAnchor() !== null}
            anchorEl={createNewFolderAnchor()}
            onClose={() => createNewFolderAnchor(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <TextField size="small" autoComplete="none" value={newFolderName()}
              onChange={(evt, v) => newFolderName(v)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" edge="end" sx={{borderRadius: 1.5}}
                      onClick={() => {
                        createNewFolder();
                        createNewFolderAnchor(null);
                      }}>
                      <FaSolidCheck />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Popover>
          <Button size="small">
            <FaSolidUpload />
          </Button>
          <Button onClick={() => {
          }}>
            <IoArrowBackOutline />
          </Button>
          <Button onClick={() => {
          }}>
            <IoArrowForwardOutline />
          </Button>
        </ButtonGroup>

        <Breadcrumbs class="shrink-0" aria-label="breadcrumb" sx={{
        }}>
          <For each={ctx.getPath().split("/")}>{(item, idx) => (
            <IconButton size="small" sx={{ borderRadius: 2, paddingLeft: 2, paddingRight: 2 }}
              onClick={() => ctx.changeCurrentPathByIdx(idx())}>
              {item}
            </IconButton>
          )}</For>
        </Breadcrumbs>
      </Stack>
      <Divider />
      <div class="w-full h-full shrink p-1 overflow-y-auto">
        <div class="flex flex-wrap gap-1">
          <For each={files()}>{file => (
            <FileElement file={file} />
          )}</For>
        </div>
      </div>
    </div>
  )
}
