import { Breadcrumbs, Button, ButtonGroup, Divider, IconButton, InputAdornment, Popover, Stack, TextField } from "@suid/material";
import { IoArrowBackOutline, IoArrowForwardOutline } from 'solid-icons/io';
import { For, Show, createResource, onMount } from "solid-js";
import { bucket } from "../../mgrui/lib/components/utils";
import { CgFolderAdd } from 'solid-icons/cg';
import { FaSolidCheck } from 'solid-icons/fa';
import getBackend from "../../service/Backend";
import FileElement from "./FileElement";
import { useStorageManager } from "./StorageManager";
import { FiUpload } from "solid-icons/fi";
import { globalCustomEventRegistry } from "../../mgrui/lib/components/EventRegistry";
import Events from "../../Events";
import Paths, { Path } from "../../common/Paths";
import FilePreview from "./FilePreview";

export default function CurrentPathBrowser() {
  const storage = useStorageManager();
  const createNewFolderAnchor = bucket<HTMLElement | null>(null);
  const newFolderName = bucket("");
  const selectedFile = bucket<StorageFile | null>(null);
  let inputEl: HTMLSpanElement;

  const [files, filesAction] = createResource(
    () => getBackend().listFiles(storage.getPath()),
    { initialValue: [] as StorageFile[] }
  );

  const afterUpload = (path: Path) => {
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
    const p = storage.getPath(name);
    getBackend().createDirectory(p)
      .then(() => afterUpload(p))
      .finally(() => newFolderName(""));
  };

  const onImport = (inputElem: HTMLInputElement) => {
    if (inputElem.files) {
      for (let f of inputElem.files) {
        getBackend().uploadFile(storage.getPath(), f)
          .then(() => afterUpload(storage.getPath(f.name)));
      }
    }
  };

  onMount(() => {
    globalCustomEventRegistry.on(Events.Storage.ChangeWorkDir, (evt) => {
      filesAction.refetch();
    });
    globalCustomEventRegistry.on(Events.Storage.Select, (evt) => {
      const file = evt.detail.file as StorageFile;
      if (file.mediaType === "directory") {
        storage?.open(Paths.resolvePath(file.path));
      } else {
        selectedFile(file);
      }
    });
  })

  return (
    <div class="relative flex flex-col w-full h-full shrink">
      <div class="flex flex-wrap w-full p-1 gap-x-1 shrink-0">
        <div class="flex shrink-0 m-1 p-1 gap-2 bg-sky-500 rounded-md">
          <IconButton size="small" onClick={() => storage.backward()}>
            <IoArrowBackOutline />
          </IconButton>

          {/* <Button onClick={() => storage.forward()}>
            <IoArrowForwardOutline />
          </Button> */}

          <IconButton size="small" onClick={(evt) => createNewFolderAnchor(evt.currentTarget)}>
            <CgFolderAdd />
          </IconButton>
          <Popover
            open={createNewFolderAnchor() !== null}
            anchorEl={createNewFolderAnchor()}
            onClose={() => createNewFolderAnchor(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            sx={{ marginTop: 0.5 }}
          >
            <TextField size="small" autoComplete="off" value={newFolderName()}
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

          <IconButton size="small" onClick={() => inputEl.click()}>
            <FiUpload />
          </IconButton>
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
        </div>

        <Breadcrumbs class="flex items-center" sx={{
        }}>
          <For each={storage.getPath().patterns()}>{(item, idx) => (
            <IconButton color="primary" size="small" sx={{ borderRadius: 2, paddingLeft: 2, paddingRight: 2, textTransform: "none" }}
              onClick={() => storage.changeCurrentPathByIdx(idx())}>
              {item}
            </IconButton>
          )}</For>
        </Breadcrumbs>
      </div>

      <Divider />
      
      <div class="w-full h-full shrink p-1 overflow-y-auto">
        <div class="flex flex-wrap gap-1">
          <For each={files()}>{file => (
            <FileElement file={file} onSelect={selectedFile} />
          )}</For>
        </div>
      </div>
      <FilePreview file={selectedFile()} onClose={() => selectedFile(null)} />
    </div>
  )
}
