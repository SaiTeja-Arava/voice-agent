export interface IKeusGMApplianceHomeInfo {
    applianceRoom: string;
    applianceSection: string;
}

export interface IKeusGMApplianceControlInfo
{
    applianceControlType: string,
    applianceProtocolControlInfo: object
}
export interface IKeusGMApplianceSyncInfo {
    syncStatus: number;
    syncRequestType: number;
    syncRequestId: string;
    syncRequestTime: number;
    syncRequestParams: object;
    jobTypeName?: string;
    jobMessage?: string;
} 

export interface IKeusGMApplianceStatusInfo {
    isConfigured: boolean;
    isHidden: boolean;
}

export interface IKeusGMApplianceGroupInfo {
    inGroup: boolean;
    groupId: string;
}

export interface IKeusGMApplianceVoiceInfo {
    discoverAppliance: boolean;
    applianceVoiceName: string;
}

export interface IKeusGMApplianceSceneAction {
    applianceType: string;
    applianceIdentifier: IKeusGMApplianceIdentifier;
    applianceState: object;
}
export interface IKeusGMApplianceSavedStateAction{
    savedStateId:string
    savedStateName:string,
    savedState:object,//gm Appliance state info
    createdBy:string
}
export interface IKeusGMApplianceAdditionalInfo{
    savedStateList:Array<IKeusGMApplianceSavedStateAction>,
    recalibrationTimeList: Array<number> // stores the time for last 5 recalibrations.
}

export interface IKeusGMApplianceScheduleAction {
    applianceType: string;
    applianceIdentifier: IKeusGMApplianceIdentifier;
    applianceState: object;
}

export interface IKeusGMApplianceIdentifier {
    applianceId: string;
}

export interface IActivitySourceInfo {
    lastUpdateTime: number;
    lastUpdatedBy: string;
    lastUpdateUser: string;
    lastUpdateSource: string;
}

export interface IKeusGMAppliance {
    applianceId: string;
    applianceType: string;
    applianceCategory: string;
    applianceName: string;
    applianceHomeInfo: IKeusGMApplianceHomeInfo;
    applianceSyncInfo: IKeusGMApplianceSyncInfo;
    applianceStatusInfo: IKeusGMApplianceStatusInfo;
    applianceGroupInfo: IKeusGMApplianceGroupInfo;
    applianceActivityInfo: IActivitySourceInfo;
    applianceVoiceInfo: IKeusGMApplianceVoiceInfo;
    applianceIcon: number;
    applianceState: object;
    applianceProperties: object;
    applianceControlInfo:IKeusGMApplianceControlInfo;
    applianceAdditionalInfo?:IKeusGMApplianceAdditionalInfo

}