import { Match, Switch, splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { names } from "../../mgrui/lib/components/utils";
import getBackend from "../../service/Backend";

export default function MediaFile(props: {
  file: StorageFile,
  elemWidth?: string | number;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ['file', "class", "elemWidth"]);
  const src = getBackend().getFileUrl(props.file);
  return (
    <div class={names("relative drop-shadow rounded-md overflow-hidden w-max h-max", local.class || "")}
      {...others}>
      <Switch>
        <Match when={local.file.mediaType.startsWith("image")}>
          <img width={local.elemWidth || 300} class="select-none" draggable={false} src={src} />
        </Match>
        <Match when={local.file.mediaType.startsWith("video")}>
          <video width={local.elemWidth || 300} class="select-none">
            <source src={src} />
          </video>
        </Match>
      </Switch>
    </div>
  )
};