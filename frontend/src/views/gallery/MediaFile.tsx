import { Match, Switch, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { names } from "../../mgrui/lib/components/utils";
import getBackend from "../../service/Backend";

export default function MediaFile(props: {
  file: StorageFile,
} & JSX.HTMLAttributes<HTMLImageElement | HTMLVideoElement>) {
  const [local, others] = splitProps(props, ['file', "class"]);
  const src = getBackend().getFileUrl(props.file);

  if (local.file.mediaType.startsWith("image")) {
    return (
      <img class={names("relative drop-shadow rounded-md overflow-hidden select-none object-cover", local.class || "")}
        draggable={false} src={src} {...others} />
    );
  } else if (local.file.mediaType.startsWith("video")) {
    return (
      <video class={names("relative drop-shadow rounded-md overflow-hidden select-none object-cover", local.class || "")}
        draggable={false} src={src} {...others}>
        <source src={src} />
      </video>
    );
  }
  return (<></>)
};
