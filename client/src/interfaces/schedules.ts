export interface IKeusSchedule {
  scheduleId: string;
  scheduleName: string;
  scheduleType: number;
  scheduleActionType: number;
  scheduleSection: string;
  scheduleRoom: string;
  startTime: number;
  endTime: number;
  repeat: Array<string>;
  createdBy: string;
  createdByName: string;
  scheduleAction: object;
  activeStatus: boolean;
  scheduleRunning: boolean;
  forceExecuteStatus: string;
  forceExecute: boolean;
  lastExecutedTime?: number;
  lastExecutionStatus?: number;
  lastExecutionStatusMessage?: string;
}
