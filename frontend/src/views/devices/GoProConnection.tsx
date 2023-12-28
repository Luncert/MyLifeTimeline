/// <reference types="web-bluetooth" />

import { Button } from "@suid/material";
import { createBucket } from "../../mgrui/lib/components/utils";

const formatUUID = (shorthand: string) => `b5f9${shorthand.substring(3)}-aa8d-11e3-9046-0002a5d5c51b`;

async function readSsid(server: BluetoothRemoteGATTServer) {
  const service = await server.getPrimaryService(formatUUID("GP-0001"));
  const readSsid = await service.getCharacteristic(formatUUID("GP-0002"));
  const ssid = await readSsid.readValue();
  return new TextDecoder().decode(ssid);
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
  const scan = createBucket(false);
  return (
    <div class="w-full h-full p-2">
      <Button variant="contained"
        onClick={() => {
          scan(true);
          console.log(123)
          navigator.bluetooth.requestDevice({ 
            acceptAllDevices: true,
            optionalServices: [0xFEA6, formatUUID("GP-0001")]
          }).then(async device => {
            if (!device.gatt) {
              return;
            }
            const server = await device.gatt.connect();
            console.log(await readSsid(server));
            // await enableAp(server, true);
            // await enableAp(server, false);
          });
          //.catch((error: any) => { console.error(123, error); });
        }}>search</Button>
    </div>
  )
}