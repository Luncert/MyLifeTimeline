import { Input, Typography } from "@suid/material";
import Field from "../../mgrui/lib/components/Field";
import { bucket } from "../../mgrui/lib/components/utils";

export default function ComponentAttributesEditor() {
  const rotation = bucket(0);
  const scale = bucket(0);
  const pos = bucket<Pos>([0, 0]);
  return (
    <div class="p-2">
      <div class="flex items-center gap-2">
        <Field label="x" value={pos()[0]} />
        <Field label="y" value={pos()[0]} />
      </div>
      <div class="flex items-center gap-2">
        <Field label="Rotation" value={Math.round(rotation() / 100 * 360) + "°"} />
        <Input type="range" fullWidth disableUnderline value={rotation()}
          onChange={(evt, v) => rotation(parseInt(v))} />
      </div>
      <div class="flex items-center gap-2">
        <Field label="Scale" value={scale() + "x"} />
        <Input type="range" fullWidth disableUnderline value={scale()}
          onChange={(evt, v) => scale(parseInt(v))} />
      </div>
    </div>
  )
}
