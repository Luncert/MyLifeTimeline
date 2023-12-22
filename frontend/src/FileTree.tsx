import { Button, IconButton, InputAdornment, TextField } from "@suid/material";
import { BiRegularSearchAlt } from "solid-icons/bi";
import { For, Show, createResource } from "solid-js";
import { createBucket } from "./mgrui/lib/components/utils";
import { FaSolidAngleDown, FaSolidAngleRight } from "solid-icons/fa";
import { IoFolder, IoFolderOpen } from "solid-icons/io";
import { DynamicIconByMediaType } from "./FileElement";

interface FileNode {
  name: string;
  mediaType: string;
}

interface DirectoryNode {
  name: string;
  children: (DirectoryNode | FileNode)[];
}

type FileTree = (DirectoryNode | FileNode)[];

export default function FileTree() {
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
          <Show when={isDirectory} fallback={<DynamicIconByMediaType mediaType={props.mediaType} />}>
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