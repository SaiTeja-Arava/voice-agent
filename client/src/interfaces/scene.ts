export interface IKeusSceneTimeslot {
  timeslotId: number;
  timeslotDelay: number;
}

export interface IKeusSceneAction {
  actionId: string;
  zigbeeActionId: number;
  actionType: string;
  timeslotId: number;
  actionItem: object;
  syncStatus: number;
  syncRequestId: string;
  jobTypeName: number;
  jobMessage: string;
  syncRequestTime: number;
}
export interface IKeusGMSceneActionInfo {
  protocolType: string;
  protocolSceneActionControlInfo: object;
}
export interface IKeusAreaSceneAction {
  sceneId: number;
  roomId: string;
}

export interface IKeusExcuteSceneAction {
  sceneId: number;
  sceneRoom: string;
}

export interface IAdjustTsDelayParams {
  timeslotId: number;
  timeslotDelay: number;
}

export interface IAdjustTsDelayParams {
  timeslotId: number;
  timeslotDelay: number;
}

export interface IDeleteTsParams {
  timeslotId: number;
}

export interface IDeleteSceneParams {}

export interface ISceneSyncInfo {
  syncStatus: number;
  syncRequestId: string;
  syncRequestType: number;
  syncRequestTime: number;
  syncRequestParams:
    | IAdjustTsDelayParams
    | IDeleteSceneParams
    | IDeleteTsParams;
  jobTypeName: number;
  jobMessage: string;
}

export interface IKeusScene {
  sceneId: number;
  sceneName: string;
  sceneType: number;
  sceneScope: number;
  sceneExecutionType: number;
  sceneSection: string;
  sceneRoom: string;
  actionList: Array<IKeusSceneAction>;
  timeslotList: Array<IKeusSceneTimeslot>;
  lastUpdateTime: number;
  lastUpdateBy: string;
  lastUpdateUser: string;
  lastUpdateSource: string;
  sceneSyncInfo: ISceneSyncInfo;
  scenePresetType: number;
}
