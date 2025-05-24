export interface IKeusDeviceSyncInfo {
  syncStatus: number;
  syncRequestType: number;
  syncRequestId: string;
  syncRequestTime: number;
  syncRequestParams: object;
  jobTypeName?: number;
  jobMessage?: string;
}

export interface IKeusDevice {
  deviceId: string;
  masterId: string;
  deviceType: string;
  deviceCategory: string;
  deviceName: string;
  deviceSection: string;
  deviceRoom: string;
  deviceLocation: string;
  deviceControlType: string;
  deviceParent: string;
  firmwareVersion: string;
  isHidden: boolean;
  isConfigured: boolean;
  manufacturerName: string;
  deviceTypeDisplayName: string;
  deviceTypeName: string;
  inGroup: boolean;
  deviceGroup: number;
  groupRoom: string;
  deviceState: object;
  deviceProperties: object;
  lastUpdateTime: number;
  lastUpdateBy: string;
  lastUpdateUser: string;
  lastUpdateSource: string;
  deviceSyncInfo: IKeusDeviceSyncInfo;
  markedForDelete: number;
  registeredAt: number;
}
