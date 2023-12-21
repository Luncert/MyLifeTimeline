import { TextField } from "@suid/material";
import { createBucket } from "../mgrui/lib/components/utils";

export default function PageSettings() {
  const title = createBucket("");
  return (
    <div class="w-full h-full">
      <div class="p-1 pt-2 w-full">
        <TextField class="w-full" label="Title" size="small"  autoComplete="none"
          value={title()} onChange={(evt, v) => title(v)} />
      </div>
    </div>
  )
}