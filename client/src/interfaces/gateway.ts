export interface IKeusMiniGatewayInfo {
  gatewayId: string;
  floor: string;
  name: string;
  location: string;
  ip: string;
  zigbeeChannel: number;
}

export enum HomeKitBridgeStatus {
  Paired = "paired",
  Unpaired = "unpaired",
  Started = "started",
  failedToStart = "failed to start",
}

export interface IHomekitBridgeInfo {
  bridgeId: number;
  username: string;
  port: number;
  displayName: string;
  status: HomeKitBridgeStatus;
}

export enum GatewayMode {
  MAIN_GATEWAY,
  MINI_GATEWAY,
}

//Edit both interface & schema when making changes to gateway structure
//Gateway interface for server
export interface IKeusGateway {
  gatewayMode: GatewayMode;
  gatewayId: string;
  seed: string;
  serviceUser: string;
  serviceUserPassword: string;
  gatewayKey: string;
  isRegisteredToCloud: boolean;
  zigbeeChannel: number;
  hubVersion: string;
  wronglyConfigured: boolean;
  googleLinked: boolean;
  googleLinkedUserList: Array<string>;
  alexaLinked: boolean;
  alexaLinkedUserList: Array<string>;
  siriLinked: boolean;
  homeKitPin?: string;
  homekitBridges: Array<IHomekitBridgeInfo>;
  siriLinkedUserList: Array<string>;
  isConfigured: boolean;
  miniGateways: Array<IKeusMiniGatewayInfo>;
  flags: Map<string, boolean>;
}
