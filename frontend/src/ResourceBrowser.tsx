import { Breadcrumbs, Button, ButtonGroup, Grid, IconButton, InputAdornment, Link, Stack, TextField, Typography } from "@suid/material";
import { IoArrowBackOutline, IoArrowForwardOutline } from 'solid-icons/io';
import { BiRegularSearchAlt } from 'solid-icons/bi';
import { For, createContext } from "solid-js";
import { createBucket, useCtx } from "./mgrui/lib/components/utils";
import { AiTwotoneFileText } from 'solid-icons/ai';

interface File {
  name: string;
  mediaType: string;
  directory?: boolean;
  preview?: string;
}

const files: File[] = [
  {
    name: "a.png",
    mediaType: "image/png"
  },
  {
    name: "a.png",
    mediaType: "image/png"
  },
  {
    name: "a.png",
    mediaType: "image/png"
  },
  {
    name: "a.png",
    mediaType: "image/png"
  },
]

interface ResourceBrowserContextDef {
  path: Bucket<string[]>;
  currentPath: Bucket<number>;
}

const ResourceBrowserContext = createContext<ResourceBrowserContextDef>();

export function useResourceBrowser() {
  return useCtx<ResourceBrowserContextDef>(ResourceBrowserContext as any);
}

export default function ResourceBrowser() {
  const path = createBucket<string[]>(["aadsasc", "bavvas"]);
  const currentPath = createBucket(0);
  return (
    <ResourceBrowserContext.Provider value={{
      path, currentPath
    }}>
      <div class="w-full h-full p-1">
        <Stack class="h-10 gap-x-1" direction="row">
          <ButtonGroup class="shrink-0 gap-1">
            <IconButton sx={{ borderRadius: 2 }} onClick={() => {
              currentPath(Math.max(0, currentPath() - 1));
            }}>
              <IoArrowBackOutline />
            </IconButton>
            <IconButton sx={{ borderRadius: 2 }} onClick={() => {
              currentPath(Math.min(path().length - 1, currentPath() + 1));
            }}>
              <IoArrowForwardOutline />
            </IconButton>
            <Breadcrumbs class="shrink-0 rounded-md bg-zinc-200" aria-label="breadcrumb" sx={{
            }}>
              <For each={path().filter((v, i) => i <= currentPath())}>{(item, idx) => (
                <IconButton size="small" sx={{ borderRadius: 2, paddingLeft: 2, paddingRight: 2 }}
                  onClick={() => currentPath(idx())}>
                  {item}
                </IconButton>
              )}</For>
            </Breadcrumbs>
          </ButtonGroup>

          <TextField class="w-full" size="small" autoComplete="none" InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" sx={{ borderRadius: 2 }}>
                  <BiRegularSearchAlt />
                </IconButton>
              </InputAdornment>
            )
          }} />
        </Stack>
        <div class="w-full h-full shrink">
          <Grid container spacing={2}>
            <For each={files}>{file => (
              <Grid item xs={8} md={1}>
                <FileElement file={file} />
              </Grid>
            )}</For>
          </Grid>
        </div>
      </div>
    </ResourceBrowserContext.Provider>
  )
}

function FileElement(props: {
  file: File;
}) {
  return (
    <div class="w-full h-full">
      <AiTwotoneFileText class="text-5xl" />
      {props.file.name}
    </div>
  )
}