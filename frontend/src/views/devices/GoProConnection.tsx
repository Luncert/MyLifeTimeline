/// <reference types="web-bluetooth" />

import { Button } from "@suid/material";
import { createBucket, names } from "../../mgrui/lib/components/utils";
import { Show } from "solid-js";
import Field from "../../mgrui/lib/components/Field";

const formatUUID = (shorthand: string) => `b5f9${shorthand.substring(3)}-aa8d-11e3-9046-0002a5d5c51b`;

async function readWifiInfo(server: BluetoothRemoteGATTServer) {
  try {
    const decoder = new TextDecoder();
    const service = await server.getPrimaryService(formatUUID("GP-0001"));
    const ssid = await service.getCharacteristic(formatUUID("GP-0002"))
      .then(v => v.readValue()).then(v => decoder.decode(v));
    const pwd = await service.getCharacteristic(formatUUID("GP-0003"))
    .then(v => v.readValue()).then(v => decoder.decode(v));
    return [ssid, pwd];
  } catch (e) {
    console.error(e)
  }
}

async function enableAp(server: BluetoothRemoteGATTServer, on: boolean) {
  return new Promise(async (resolve, reject) => {
    const service = await server.getPrimaryService(0xFEA6);
    const apControl = await service.getCharacteristic(formatUUID("GP-0072"));
    // apControl.addEventListener("characteristicvaluechanged", e => {
    //   console.log(e);
    //   resolve(e);
    // });
    await apControl.writeValue(new Uint8Array([0x03, 0x17, 0x01, on ? 0x01 : 0x00]));
  });
}

export default function GoProConnection() {
  const selectedDevice = createBucket<BluetoothDevice | null>(null);
  const deviceConnected = createBucket(false);

  return (
    <div class="w-full h-full p-2">
      <div class="flex gap-2 items-center">
        <Button variant="contained"
          onClick={() => {
            navigator.bluetooth.requestDevice({ 
              acceptAllDevices: true,
              optionalServices: [0xFEA6, formatUUID("GP-0001")]
            }).then(async device => {
              if (!device.gatt) {
                return;
              }
              selectedDevice(device);
              device.addEventListener("gattserverdisconnected", (e) => {
                deviceConnected(true)
              });
              device.addEventListener("gattserverdisconnected", (e) => {
                deviceConnected(false);
              })

              const server = await device.gatt.connect();
              const wifiInfo = await readWifiInfo(server);
              console.log(wifiInfo)
              // await enableAp(server, true);
              // await enableAp(server, false);
            });
            //.catch((error: any) => { console.error(123, error); });
          }}>select device</Button>
        <Show when={selectedDevice() !== null}>
          <span class={names("inline-block w-2 h-2 rounded-md drop-shadow",
            deviceConnected() ? "bg-green-400" : "bg-red-500")}></span>
          <Field label="Device Name" value={selectedDevice()?.name || ""} />
          <Field label="ID" value={selectedDevice()?.id || ""} />
        </Show>
      </div>
    </div>
  )
}