import { IconButton } from "@suid/material";
import { AiTwotoneFileText } from "solid-icons/ai";
import { IoFolder } from "solid-icons/io";
import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { Dynamic } from "solid-js/web";
import { useStorageManager } from "./StorageManager";

export default function FileElement(props: {
  file: StorageFile;
}) {
  const ctx = useStorageManager();
  return (
    <IconButton color="info" sx={{
      flexShrink: 0,
      borderRadius: 1.5,
      width: "5rem",
      height: "5rem"
    }} onClick={() => ctx.openInCurrentPath(props.file.name)}>
      <div class="flex flex-col items-center">
        <DynamicIconByMediaType mediaType={props.file.mediaType} class="text-5xl" />
        <span class="text-sm text-zinc-900">{props.file.name}</span>
      </div>
    </IconButton>
  )
}

const mediaTypeToIcon = {
  directory: IoFolder
}

export function DynamicIconByMediaType(props: {
  mediaType: string;
} & JSX.HTMLAttributes<HTMLElement>) {
  const [local, others] = splitProps(props, ["mediaType"]);
  const icon = local.mediaType in mediaTypeToIcon
    ? (mediaTypeToIcon as any)[local.mediaType]
    : AiTwotoneFileText;
  return (<Dynamic component={icon} {...others} />);
}