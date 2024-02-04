import { IconButton, Typography, useTheme } from "@suid/material";
import { AiTwotoneFileText } from "solid-icons/ai";
import { IoFolder } from "solid-icons/io";
import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";
import { useStorageManager } from "./StorageManager";
import { BiSolidFile, BiSolidFileJpg, BiSolidFileJson, BiSolidFilePng } from 'solid-icons/bi';

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
      <MediaResourceIcon mediaType={props.file.mediaType} class="text-5xl" />
      <div class="absolute top-3/4 w-full h-max">
        <Typography class="break-all" sx={{
          color: (t) => t.palette.mode === "dark" ? "#e4e4e7" : "#18181b"
        }}>{props.file.name}</Typography>
      </div>
    </IconButton>
  )
}

const mediaTypeToIcon = {
  directory: IoFolder,
  "application/octet-stream": BiSolidFile,
  "application/json": BiSolidFileJson,
  "image/jpeg": BiSolidFileJpg,
  "image/jpg": BiSolidFileJpg,
  "image/png": BiSolidFilePng,
}

export function MediaResourceIcon(props: {
  mediaType: string;
} & JSX.HTMLAttributes<HTMLElement>) {
  const [local, others] = splitProps(props, ["mediaType"]);
  const icon = local.mediaType in mediaTypeToIcon
    ? (mediaTypeToIcon as any)[local.mediaType]
    : AiTwotoneFileText;
  return (<Dynamic component={icon} {...others} />);
}