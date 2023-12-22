import { Breadcrumbs, Button, ButtonGroup, Divider, Grid, IconButton, InputAdornment, Link, Stack, TextField, Typography } from "@suid/material";
import { IoArrowBackOutline, IoArrowForwardOutline } from 'solid-icons/io';
import { BiRegularSearchAlt } from 'solid-icons/bi';
import { For, Match, Show, Switch, createContext, createResource } from "solid-js";
import { createBucket, useCtx } from "./mgrui/lib/components/utils";
import { AiTwotoneFileText } from 'solid-icons/ai';
import { FaSolidAngleDown, FaSolidAngleRight, FaRegularFolderOpen, FaRegularFolderClosed } from 'solid-icons/fa';
import { IoFolderOpen, IoFolder } from 'solid-icons/io';
import { FaSolidUpload } from 'solid-icons/fa';
import getBackend from "./service/Backend";

interface FileNode {
  name: string;
  mediaType: string;
}

interface DirectoryNode {
  name: string;
  children: (DirectoryNode | FileNode)[];
}

type FileTree = (DirectoryNode | FileNode)[];

const fileTree: FileTree = [
  {
    name: "app",
    children: [
      {
        name: "config.ts",
        mediaType: "text"
      }
    ]
  },
  {
    name: "lib",
    children: []
  },
  {
    name: "Divider.tsx",
    mediaType: "text"
  }
];

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
      <div class="w-full h-full p-1 flex">
        <FileTree />
        <Divider orientation="vertical" />
        <CurrentPathBrowser />
      </div>
    </ResourceBrowserContext.Provider>
  )
}

function FileTree() {
  return (
    <div class="flex flex-col gap-1 p-1 w-1/3">
      <TextField class="w-full" size="small" autoComplete="none" InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" sx={{ borderRadius: 2 }}>
              <BiRegularSearchAlt />
            </IconButton>
          </InputAdornment>
        )
      }} />
      <For each={["x", "y", "z"]}>{item => (
        <FileTreeNode basePath="/" name={item} mediaType="directory" />
      )}</For>
    </div>
  )
}

function FileTreeNode(props: {
  basePath: string;
  name: string;
  mediaType: string;
}) {
  const expanded = createBucket(false);
  const isDirectory = props.mediaType === "directory";
  createResource(() => "");
  return (
    <div>
      <Button fullWidth color="inherit" size="small" startIcon={
        <div class="inline-block flex gap-1">
          <Show when={isDirectory} fallback={<AiTwotoneFileText />}>
            <Show when={expanded()} fallback={
              <>
                <FaSolidAngleRight />
                <IoFolder />
              </>
            }>
              <FaSolidAngleDown />
              <IoFolderOpen />
            </Show>
          </Show>
        </div>
      } sx={{justifyContent: "start"}} onClick={() => {
        expanded(!expanded());
      }}>
        <span>{props.name}</span>
      </Button>
      <Show when={isDirectory}>
        <div class="ml-[1.4rem]">
          <For each={["x", "y", "z"]}>{item => (
            <FileTreeNode basePath={props.basePath + "/" + props.name} name={item} mediaType="file" />
          )}</For>
        </div>
      </Show>
    </div>
  );
}

function CurrentPathBrowser() {
  const ctx = useResourceBrowser();
  const [files, filesAction] = createResource(
    () => getBackend().listFiles("/"),
    { initialValue: [] as StorageFile[] }
  );
  return (
    <div class="flex flex-col w-full h-full shrink">
      <Stack class="p-1 gap-x-1" direction="row">
        <ButtonGroup class="shrink-0" variant="contained" size="small">
          <Button size="small">New Folder</Button>
          <Button size="small">
            <FaSolidUpload />
          </Button>
          <Button onClick={() => {
            ctx.currentPath(Math.max(0, ctx.currentPath() - 1));
          }}>
            <IoArrowBackOutline />
          </Button>
          <Button onClick={() => {
            ctx.currentPath(Math.min(ctx.path().length - 1, ctx.currentPath() + 1));
          }}>
            <IoArrowForwardOutline />
          </Button>
        </ButtonGroup>

        <Breadcrumbs class="shrink-0" aria-label="breadcrumb" sx={{
        }}>
          <For each={ctx.path().filter((v, i) => i <= ctx.currentPath())}>{(item, idx) => (
            <IconButton disabled={idx() === ctx.currentPath()} size="small" sx={{ borderRadius: 2, paddingLeft: 2, paddingRight: 2 }}
              onClick={() => ctx.currentPath(idx())}>
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

function FileElement(props: {
  file: StorageFile;
}) {
  return (
    <IconButton color="info" sx={{
      flexShrink: 0,
      borderRadius: 1.5,
      width: "5rem",
      height: "5rem"
    }}>
      <div class="flex flex-col items-center">
        <AiTwotoneFileText class="text-5xl" />
        <span class="text-sm text-zinc-900">{props.file.name}</span>
      </div>
    </IconButton>
  )
}