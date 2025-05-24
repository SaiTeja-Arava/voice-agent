import type { IKeusArea } from "./area.js";
import type { IKeusDevice } from "./device.js";
import { type DM_Device, isDMDaliDevice } from "./dm-device.js";
import { IKeusGateway } from "./gateway.js";
import { IKeusGMAppliance } from "./gm-appliance.js";
import { IKeusGMDevice } from "./gm-device.js";
import { IKeusGMGroup } from "./gm-group.js";
import { IKeusGroup } from "./group.js";
import { IKeusIRRemote } from "./ir-remote.js";
import { IKeusRoom } from "./room.js";
import { IKeusScene } from "./scene.js";
import { IKeusSchedule } from "./schedules.js";
import { IKeusUser } from "./user.js";

export enum COMMUNICATOR_METHOD_NAMES {
  GATEWAY_DETAILED_INFO = "DETAILED_INFO",
  GATEWAY_PING = "PING",
  GATEWAY_REBOOT = "REBOOT_SERVER",
  EXECUTE_CLUSTER_COMMAND = "ECC",
  DEPLOY_CODE = "DEPLOY_CODE"
}


export interface DetailedInfo {
  dmDevices: Array<DM_Device>;
  devices: Array<IKeusDevice>;
  areas: Array<IKeusArea>;
  scenes: Array<IKeusScene>;
  groups: Array<IKeusGroup>;
  schedules: Array<IKeusSchedule>;
  rooms: Array<IKeusRoom>;
  users: Array<IKeusUser>;
  irremotes: Array<IKeusIRRemote>;
  gateways: Array<IKeusGateway>;
  gmDevices: Array<IKeusGMDevice>;
  gmGroups: Array<IKeusGMGroup>;
  gmAppliances: Array<IKeusGMAppliance>;
  deviceSummary?: Record<string, number>;
}

export type {
  DM_Device,
  IKeusArea,
  IKeusDevice,
  IKeusGMAppliance,
  IKeusGMDevice,
  IKeusGMGroup,
  IKeusGateway,
  IKeusGroup,
  IKeusIRRemote,
  IKeusRoom,
  IKeusScene,
  IKeusSchedule,
  IKeusUser,
};

export { isDMDaliDevice };
