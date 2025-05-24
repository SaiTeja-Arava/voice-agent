export interface IGroupSyncState {
  syncState: number;
  lastRequestId: string;
  lastRequestType: number;
  lastRequestParameters: object;
  lastRequestTime: number;
  syncedDevices: Array<string>;
  jobTypeName: number;
  jobMessage: string;
}

export interface IKeusGroup {
  groupId: number;
  groupName: string;
  groupRoom: string;
  groupSection: string;
  groupType: number;
  groupIconType: number;
  isHighPower: boolean;
  isConfigured: boolean;
  isHidden: boolean;
  groupVoiceName: string;
  deviceList: Array<string>;
  groupState: object;
  groupProperties: object;
  groupSyncState: IGroupSyncState;
  lastUpdateTime: number;
  lastUpdateBy: string;
  lastUpdateUser: string;
  lastUpdateSource: string;
}
