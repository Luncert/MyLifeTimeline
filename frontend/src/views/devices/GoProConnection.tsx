import { Button } from "@suid/material";
import { onMount } from "solid-js"
import { createBucket } from "../../mgrui/lib/components/utils";

export default function GoProConnection() {
  const bluetooth = (navigator as any).bluetooth;
  const scan = createBucket(false);
  return (
    <div class="w-full h-full p-2">
      <Button variant="contained"
        onClick={() => {
          scan(true);
          bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
            .then((device: any) => {
              console.log(device);
              return device.gatt.connect();
            })
            .then(server => {
              // Getting Battery Service…
              return server.getPrimaryService('battery_service');
            })
            .then(service => {
              // Getting Battery Level Characteristic…
              return service.getCharacteristic('battery_level');
            })
            .then(characteristic => {
              // Reading Battery Level…
              return characteristic.readValue();
            })
            .then(value => {
              console.log(`Battery percentage is ${value.getUint8(0)}`);
            })
            .catch((error: any) => { console.error(error); });
        }}>search</Button>
    </div>
  )
}