export interface IKeusIRRemote {
  remoteId: string;
  irDevice: string;
  companyId: string;
  modelId: string;
  remoteName: string;
  remoteType: number;
  remoteProperties: object; //one of remote properties
  remoteState: object; //one of remote state
  lastUpdateTime: number;
  lastUpdateBy: string;
  lastUpdateUser: string;
  lastUpdateSource: string;
}
