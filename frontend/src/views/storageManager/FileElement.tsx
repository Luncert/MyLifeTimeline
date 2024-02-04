import { IconButton, Typography, useTheme } from "@suid/material";
import { AiTwotoneFileText } from "solid-icons/ai";
import { IoFolder } from "solid-icons/io";
import { Match, Switch, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";
import { useStorageManager } from "./StorageManager";
import { BiSolidFile, BiSolidFileJpg, BiSolidFileJson, BiSolidFilePng } from 'solid-icons/bi';
import getBackend from "../../service/Backend";

export default function FileElement(props: {
  file: StorageFile;
  onSelect: Consumer<StorageFile>;
}) {
  const ctx = useStorageManager();
  const theme = useTheme();
  return (
    <IconButton class="relative" color="info" sx={{
      flexShrink: 0,
      borderRadius: 1.5,
      width: "5rem",
      height: "5rem",
      backgroundColor: 'rgb(18, 18, 18)',
      backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"
    }} onClick={() => {
      if (props.file.mediaType === 'directory') {
        ctx.openInCwd(props.file.name);
      } else {
        props.onSelect(props.file);
      }
    }}>
      <MediaResourceIcon file={props.file} class="text-5xl" />
      <div class="absolute top-3/4 w-full h-max">
        <Typography class="break-all" sx={{
          color: (t) => t.palette.mode === "dark" ? "#e4e4e7" : "#18181b",
          textShadow: "0px 0px 3px black"
        }}>{props.file.name}</Typography>
      </div>
    </IconButton>
  )
}

function MediaFile(props: {
  file: StorageFile;
}) {
  return (
    <Switch>
      <Match when={props.file.mediaType.startsWith("image")}>
        <img class="select-none" draggable={false} src={getBackend().getFileUrl(props.file)}
          style={{ "object-fit": "cover" }} />
      </Match>
      <Match when={props.file.mediaType.startsWith("video")}>
        <video class="select-none" controls
          style={{ "object-fit": "contain" }}>
          <source src={getBackend().getFileUrl(props.file)} />
        </video>
      </Match>
    </Switch>
  )
}

const mediaTypeToIcon = {
  directory: IoFolder,
  "application/octet-stream": BiSolidFile,
  "application/json": BiSolidFileJson,
  "image/jpeg": MediaFile,
  "image/jpg": MediaFile,
  "image/png": MediaFile,
}

export function MediaResourceIcon(props: {
  file: StorageFile;
} & JSX.HTMLAttributes<HTMLElement>) {
  const [local, others] = splitProps(props, ["file"]);
  const icon = local.file.mediaType in mediaTypeToIcon
    ? (mediaTypeToIcon as any)[local.file.mediaType]
    : AiTwotoneFileText;
  return (<Dynamic component={icon} file={local.file} {...others} />);
}
