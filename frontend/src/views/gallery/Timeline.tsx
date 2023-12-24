import { Popover, Stack, Typography } from "@suid/material";
import { createBucket, names } from "../../mgrui/lib/components/utils";

interface TimelineNode {
  time: number;
  title: string;
  description: string;
}

export default function Timeline() {
  return (
    <div class="px-4 h-full shrink-0
      before:block before:content-[' '] before:w-4 before:h-full before:bg-rose-300">
      <TimelineItems offset={121} node={{ time: 1703386851635, title: "XX", description: "ASXS"}} />
    </div>
  )
}

function TimelineItems(props: {
  node: TimelineNode;
  offset: number;
}) {
  const anchorEl = createBucket<HTMLElement | null>(null);
  const hovered = createBucket(false);
  return (
    <div class="absolute" style={{
      top: props.offset + "px"
    }}>
      <div class="w-4 h-4 bg-white outline outline-4 outline-offset-0 outline-rose-300 rounded-3xl transition-all
        hover:drop-shadow
        active:outline-rose-200 active:bg-rose-100"
        onMouseEnter={(evt) => {
          anchorEl(evt.currentTarget);
          hovered(true);
        }}
        onMouseLeave={() => {
          anchorEl(null);
          hovered(false);
        }}
      >
      </div>
      <div class="absolute left-[100%] top-1/2">
        <div class={names("w-max",
          "before:block before:relative before:content-[' '] before:h-[1px] before:bg-rose-300 before:transition-[width left] before:duration-200",
          hovered() ? "before:left-1 before:w-[140%]": "before:left-1/2 before:w-0"
        )}>
          <div class={names("w-max text-rose-400 transition-all px-3",
            hovered() ? "-translate-y-[100%]" : "-translate-y-1/2")}>
            {parseTimestamp(props.node.time)}
          </div>
          <div class={names("flex flex-col absolute -top-[100%] drop-shadow p-2 bg-rose-400 text-white transition-[opacity left] duration-150",
            hovered() ? "opacity-1 left-full" : "opacity-0 left-0")}>
            <span class="text-lg font-semibold">{props.node.title}</span>
            <span>{props.node.description}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function parseTimestamp(v: number) {
  const d = new Date(v);
  const month = d.toLocaleString('default', { month: 'long' });
  let r = `${d.getDate()} ${month.substring(0, 3).toUpperCase()}`;
  if (d.getMonth() === 0) {
    r += ", " + d.getFullYear();
  }
  return r;
}