import { IKeusGMApplianceIdentifier } from "./gm-appliance";

export interface IKeusGMGroupHomeInfo {
  groupRoom: string;
  groupSection: string;
}

export interface IKeusGMGroupSyncInfo {
  syncStatus: number;
  syncRequestType: number;
  syncRequestId: string;
  syncRequestTime: number;
  syncRequestParams: object;
  jobTypeName?: string;
  jobMessage?: string;
}

export interface IKeusGMGroupStatusInfo {
  isConfigured: boolean;
  isHidden: boolean;
  isHighPower: boolean;
}

export interface IKeusGMGroupVoiceInfo {
  discoverGroup: boolean;
  groupVoiceName: string;
}

export interface IKeusGMGroupApplianceSyncInfo {
  applianceInSync: boolean;
  requestTime: number;
  requestType: number;
}

export interface IKeusGMGroupApplianceInfo {
  applianceIdentifier: IKeusGMApplianceIdentifier;
  groupApplianceSyncInfo: IKeusGMGroupApplianceSyncInfo;
}

export interface IKeusGMGroupIdentifier {
  groupId: string;
}

export interface IKeusGMGroupControlInfo {
  groupControlType: string;
  groupProtocolControlInfo: object;
}

export interface IKeusGMGroupScheduleAction {
  groupType: string;
  groupIdentifier: IKeusGMGroupIdentifier;
  groupState: object;
}

export interface IKeusGMGroupSceneAction {
  groupType: string;
  groupIdentifier: IKeusGMGroupIdentifier;
  groupState: object;
}

export interface ISmartConsoleGMGroupButtonProperties {
  groupId: string;
}
export interface IKeusGMGroupSavedStateAction {
  savedStateId: string;
  savedStateName: string;
  savedState: object; //gm Appliance state info
  createdBy: string;
}
export interface IKeusGMGroupAdditionalInfo {
  savedStateList: Array<IKeusGMGroupSavedStateAction>;
}

export interface IActivitySourceInfo {
  lastUpdateTime: number;
  lastUpdatedBy: string;
  lastUpdateUser: string;
  lastUpdateSource: string;
}

export interface IKeusGMGroup {
  groupId: string;
  groupType: string;
  groupCategory: string;
  groupName: string;
  groupIcon: number;
  groupControlInfo: IKeusGMGroupControlInfo;
  groupHomeInfo: IKeusGMGroupHomeInfo;
  groupSyncInfo: IKeusGMGroupSyncInfo;
  groupStatusInfo: IKeusGMGroupStatusInfo;
  groupApplianceList: Array<IKeusGMGroupApplianceInfo>;
  groupActivityInfo: IActivitySourceInfo;
  groupVoiceInfo: IKeusGMGroupVoiceInfo;
  groupState: object;
  groupProperties: object;
  groupAdditionalInfo?: IKeusGMGroupAdditionalInfo;
}
