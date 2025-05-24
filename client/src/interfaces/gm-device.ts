//keus zigbee device control info
export interface IKeusZigbeeDeviceControlInfo {
  deviceId: string;
  deviceParent: string;
  deviceGateway: string;
}

export interface IKeusZigbeeDeviceState {
  deviceType: string;
  deviceState: object;
}

//keus zigbee device info
export interface IKeusZigbeeDeviceInfo {
  deviceType: string;
  deviceCategory: string;
  deviceProperties: object;
}

export interface IKeusIpDeviceControlInfo {
  deviceIp: string;
  deviceId: string;
}

//ethernet device info here
export interface IKeusIpDeviceInfo {
  deviceType: string;
  deviceCategory: string;
  deviceProperties: Object;
}

export interface IKeusIpDeviceState {
  deviceType: string;
  deviceState: object;
}

export interface IKeusGMDeviceState {
  deviceControlType: string;
  deviceStateInfo: IKeusZigbeeDeviceState | IKeusIpDeviceState;
}
export interface IKeusGMDeviceControlInfo {
  deviceControlType: string;
  protocolControlInfo: IKeusZigbeeDeviceControlInfo | IKeusIpDeviceControlInfo;
}

export interface IKeusGMDeviceMaintenanceInfo {
  firmwareVersion?: string;
  manufacturerName?: string;
  registeredAt?: number;
  serialNumber?: string;
  device_pin?: string;
}

export interface IKeusGMDeviceSyncInfo {
  syncStatus: number;
  syncRequestType: number;
  syncRequestId: string;
  syncRequestTime: number;
  //to be confirmed syncRequestParams is defined as string in proto
  syncRequestParams: object;
  jobTypeName?: string;
  jobMessage?: string;
}

export interface IKeusGMDeviceStatusInfo {
  markedForDelete: boolean;
  onlineStatus: boolean;
  lastSeenOnline: number;
}

export interface IKeusGMDeviceHomeInfo {
  deviceRoom: string;
  deviceSection: string;
}

export interface IKeusGMDeviceInfo {
  protocolDeviceInfo: IKeusZigbeeDeviceInfo | IKeusIpDeviceInfo;
}

export interface IKeusGMDevice {
  deviceId: string;
  deviceName: string;
  deviceLocation: string;
  deviceControlInfo: IKeusGMDeviceControlInfo;
  deviceHomeInfo: IKeusGMDeviceHomeInfo;
  deviceMaintenanceInfo: object;
  deviceSyncInfo: IKeusGMDeviceSyncInfo;
  deviceStatusInfo: IKeusGMDeviceStatusInfo;
  deviceInfo: IKeusGMDeviceInfo;
}
