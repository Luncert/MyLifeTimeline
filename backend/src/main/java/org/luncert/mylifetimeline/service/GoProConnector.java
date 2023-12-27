package org.luncert.mylifetimeline.service;

import org.sputnikdev.bluetooth.manager.BluetoothManager;
import org.sputnikdev.bluetooth.manager.DeviceDiscoveryListener;
import org.sputnikdev.bluetooth.manager.DiscoveredDevice;
import org.sputnikdev.bluetooth.manager.impl.BluetoothManagerBuilder;

public class GoProConnector {


  private final BluetoothManager manager = new BluetoothManagerBuilder()
      .withTinyBTransport(true)
      .withBlueGigaTransport("^*.$")
      .build();

  public void discover() {
    manager.addDeviceDiscoveryListener(new DeviceDiscoveryListener(){

      @Override
      public void discovered(DiscoveredDevice discoveredDevice) {

      }

      @Override
      public void deviceLost(DiscoveredDevice lostDevice) {
      }
    });
    manager.start(true);
    manager.stop();
  }
}
