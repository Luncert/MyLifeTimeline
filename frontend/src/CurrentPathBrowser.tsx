import { Breadcrumbs, Button, ButtonGroup, Divider, IconButton, InputAdornment, Popover, Stack, TextField } from "@suid/material";
import { IoArrowBackOutline, IoArrowForwardOutline } from 'solid-icons/io';
import { For, createResource, onMount } from "solid-js";
import { createBucket } from "./mgrui/lib/components/utils";
import { CgFolderAdd } from 'solid-icons/cg';
import { FaSolidCheck } from 'solid-icons/fa';
import getBackend from "./service/Backend";
import FileElement from "./FileElement";
import { useStorageManager } from "./StorageManager";
import { FiUpload } from "solid-icons/fi";
import { globalCustomEventRegistry } from "./mgrui/lib/components/EventRegistry";
import Events from "./Events";

export default function CurrentPathBrowser() {
  const ctx = useStorageManager();
  const createNewFolderAnchor = createBucket<HTMLElement | null>(null);
  const newFolderName = createBucket("");
  let inputEl: HTMLSpanElement;

  const [files, filesAction] = createResource(
    () => getBackend().listFiles(ctx.getPath()),
    { initialValue: [] as StorageFile[] }
  );

  const afterUpload = (path: string) => {
    filesAction.refetch();
    globalCustomEventRegistry.dispatch(new CustomEvent(Events.Storage.Upload, {
      detail: { path }
    }));
  };

  const createNewFolder = () => {
    const name = newFolderName();
    if (name.length === 0) {
      return;
    }
    const p = ctx.getPath(name);
    getBackend().createDirectory(p)
      .then(() => afterUpload(p));
  };

  const onImport = (inputElem: HTMLInputElement) => {
    if (inputElem.files) {
      for (let f of inputElem.files) {
        getBackend().uploadFile(ctx.getPath(), f)
          .then(() => afterUpload(ctx.getPath(f.name)));
      }
    }
  };

  onMount(() => {
    globalCustomEventRegistry.on(Events.Storage.ChangeWorkDir, (evt) => {
      filesAction.refetch();
    });
  })

  return (
    <div class="flex flex-col w-full h-full shrink">
      <Stack class="h-11 p-1 gap-x-1 shrink-0" direction="row">
        <ButtonGroup class="shrink-0" variant="contained">
          <Button onClick={(evt) => createNewFolderAnchor(evt.currentTarget)}>
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

          <Button onClick={() => inputEl.click()}>
            <FiUpload />
          </Button>
          <label for="import-configuration-input">
            <input
              class="hidden"
              id="import-configuration-input"
              accept="*"
              type="file"
              onChange={(evt) => onImport(evt.target)}
            />
            <span ref={el => inputEl = el} class="hidden"></span>
          </label>
          <Button onClick={() => ctx.backward()}>
            <IoArrowBackOutline />
          </Button>
          <Button onClick={() => ctx.forward()}>
            <IoArrowForwardOutline />
          </Button>
        </ButtonGroup>

        <Breadcrumbs class="flex shrink-0 items-center" sx={{
        }}>
          <For each={ctx.getPath().split("/")}>{(item, idx) => (
            <Button size="small" sx={{ borderRadius: 2, paddingLeft: 2, paddingRight: 2 }}
              onClick={() => ctx.changeCurrentPathByIdx(idx())}>
              {item}
            </Button>
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
