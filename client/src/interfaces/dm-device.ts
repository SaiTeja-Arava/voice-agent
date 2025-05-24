export enum DaliDeviceStatus {
  VALID = "VALID",
  ADDRESS_LOST = "LOST",
  ADDR_REASSIGNED = "ADDR REASSIGNED",
  ADDR_NEW = "ADDR NEW",
}

export enum DaliRecoveryType {
  HUB = 0,
  CONSOLE = 1,
}

// Edit both interface & schema when making changes to device structure
// Device interface for server
export interface IKeusDMDaliDevice {
  deviceId: string;
  zigbeeBridgeId?: string;
  shortAddr: number;
  longAddr?: number;
  minVal?: number;
  maxVal?: number;
  fadeTime?: number;
  fadeRate?: number;
  deviceType?: number;
  powerOnLevel?: number;
  powerFailLevel?: number;
  colourType?: number;
  deviceTypeArray?: Array<number>; //if deviceType is MASK(=255)
  minTemp?: number;
  maxTemp?: number;
  uniqueId?: string;
  deviceStatus?: DaliDeviceStatus;
  hasKeusId?: boolean;
  hasValidUniqueId?: boolean;
  isRecoverable?: boolean;
  isProblematic?: boolean;

  //v2 implementation
  detailedInfo?: any;
}

export interface IKeusDMZigbeeFanInfo {}

export interface IKeusDMZigbeeCurtainInfo {
  invert: boolean;
  relayActiveTime: number;
}

export interface IKeusDMZigbeeIRBlasterInfo {
  remotes: Array<{
    remoteType: number;
    companyId: string;
    modelId: string;
    remoteName: string;
    remoteVersion: string;
    configIds: Array<number>;
  }>;
}

export interface IKeusDMZigbeeSceneWizardInfo {
  buttons: Array<
    Partial<{
      type: number;
      isHighPower: boolean;
      groupId: number;
      sceneId: number;
      relayId: number;
      isRelayGroup: boolean;
      isRemoteRelay: boolean;
      fanId: string;
      curtainIds: Array<string>;
      isInc: boolean;
    }>
  >;
  secondaryButtons: Array<
    Partial<{
      type: number;
      sceneId: number;
      triggerType: number;
    }>
  >;
}

export interface IKeusDMZigbeeEmbeddedSceneSwitchInfo {
  executionType: number;
  batteryLevel: number;
  sceneMap: Array<number>;
}

export interface IKeusDMZigbeeSmartConsoleInfo {
  buttons: Array<
    Partial<{
      type: number;
      isHighPower: boolean;
      groupId: number;
      sceneId: number;
      relayId: number;
      isRelayGroup: boolean;
      isRemoteRelay: boolean;
      fanId: string;
      curtainIds: Array<string>;
      incDec: {
        isInc: boolean;
        supportedOperation: number;
      };
    }>
  >;
  defaultFanInfo: {
    fanId: string;
  };
  sceneStepValue: number;
  defaultSceneInfo: {
    sceneId: number;
  };
  longPressDuration: number;
  sceneHoldTime: number;
  sleepTime: number;
  interactionMode: number;
  startUpMode: number;
  secondaryButtons: Array<
    Partial<{
      type: number;
      sceneId: number;
      triggerType: number;
    }>
  >;
  supportsDaliFwRecovery?: boolean;
  proximitySettings?: {
    modeSettings: [
      {
        interactionMode: number;
        standbyBrightness: number;
        wakeBrightness: number;
        proximityEnabled: boolean;
      }
    ];
    proximitySensitivity: number;
    wakeDuration: number;
  };
}

export interface IKeusDMZigbeeEmbeddedApplianceInfo {
  gid: string;
  id: number;
  type: number;
  gType: number;
  outputIds: Array<number>;
  state: Array<number>;
  properties: {
    fadeTime: number;
    minValue: number;
    maxValue: number;
    defaultState: number;
  };
}

export interface IKeusDMZigbeeEmbeddedSwitchInfo {
  id: number;
  type: number;
  gType: number;
  typeTarget?: {
    fanDeviceId?: string;
    applianceId?: number;
    areaGroupId?: number;
  };
  state: number;
}

export interface IKeusDMZigbeeEmbeddedInfo {
  appliances: Array<IKeusDMZigbeeEmbeddedApplianceInfo>;
  switches: Array<IKeusDMZigbeeEmbeddedSwitchInfo>;
}

export interface IKeusDMZigbeeRGBWWAApplianceInfo {
  id: number;
  channels: Array<number>;
  properties: {
    fadeTime: number;
    defaultStates: number[];
  };
}

export interface IKeusDMZigbeeRGBWWAInfo {
  appliances: Array<IKeusDMZigbeeRGBWWAApplianceInfo>;
  outputSequence: Array<number>;
}

// Edit both interface & schema when making changes to device structure
// Device interface for server
export interface IKeusDMZigbeeDevice {
  deviceId: string;
  minigatewayId?: string;
  shortAddr: number;
  deviceType: number;
  deviceCategory: number;
  firmwareVersion: number;
  registeredTimestamp: number;
  lastSentMsg: number;
  lastReceivedMsg: number;
  areaId: number;
  isAreaServer: boolean;
  areaMemberAddr: number;
  isDaliMaster: boolean;
  isFactoryNew: boolean;
  thirdPartyDevice?: boolean;
  deviceProperties:
    | IKeusDMZigbeeSmartConsoleInfo
    | IKeusDMZigbeeCurtainInfo
    | IKeusDMZigbeeFanInfo
    | IKeusDMZigbeeIRBlasterInfo
    | IKeusDMZigbeeEmbeddedInfo
    | IKeusDMZigbeeSceneWizardInfo
    | IKeusDMZigbeeEmbeddedSceneSwitchInfo
    | IKeusDMZigbeeRGBWWAInfo;
  fwInfo?: any;
  fwHealth?: Array<Object>;
  factoryInfo?: Object;
}

export const isDMDaliDevice = (
  device: DM_Device
): device is IKeusDMDaliDevice => {
  return "zigbeeBridgeId" in device;
};

export type DM_Device = IKeusDMDaliDevice | IKeusDMZigbeeDevice;
