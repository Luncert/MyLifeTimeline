/// <reference types="w3c-web-usb" />
import { Button, Divider } from "@suid/material";
import { Show, createEffect, onMount } from "solid-js";
import Field from "../../mgrui/lib/components/Field";
import { createBucket, names } from "../../mgrui/lib/components/utils";

export default function UsbConnection() {
  const selectedDevice = createBucket<USBDevice | null>(null);
  const deviceConnected = createBucket(false);

  createEffect(() => {
    const device = selectedDevice();
    if (device) {
      device.open().then(async() => {
        if (!device.configuration) {
          await device.selectConfiguration(0);
        }
        console.log(device.configuration)
        // chrome://device-log/ Interface 0 uses driver "UsbNcm" instead of WinUSB.
        await device.claimInterface(0);
        deviceConnected(true);

        // device.transferIn
      }).catch((e) => console.error(e));
    }
  });

  onMount(() => {
    navigator.usb.addEventListener("connect", evt => {
      console.log(evt);
    });
    navigator.usb.addEventListener("disconnect", evt => {
      console.log(evt);
    });
  })
  return (
    <div class="w-full h-full p-2">
      <div class="flex gap-2 items-center">
        <Button
          onClick={() => {
            navigator.usb.requestDevice({
              filters: []
            }).then(async device => {
              selectedDevice(device);
            }).catch((e) => console.error(e.message));
          }}>select device</Button>
        <Show when={selectedDevice() !== null}>
          <span class={names("inline-block w-2 h-2 rounded-md drop-shadow",
            deviceConnected() ? "bg-green-400" : "bg-red-500")}></span>
          <Field label="Device Name" value={selectedDevice()?.productName || ""} />
          <Field label="Serial Number" value={selectedDevice()?.serialNumber || ""} />
        </Show>
      </div>
      <Divider />
    </div>
  )
}