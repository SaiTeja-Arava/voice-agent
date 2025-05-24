export interface IAreaSyncInfo {
  syncStatus: number;
  syncRequestType: number;
  syncRequestId: string;
  syncRequestTime: number;
  syncRequestParams: object;
}

export interface IKeusArea {
  areaId: number;
  areaName: string;
  areaSyncInfo: IAreaSyncInfo;
}
