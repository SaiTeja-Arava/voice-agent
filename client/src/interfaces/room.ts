export interface IKeusSection {
  sectionId: string;
  sectionName: string;
  zigbeeSectionId: number;
}

export interface IKeusRoom {
  roomId: string;
  roomName: string;
  roomType: string;
  roomImageType: number;
  floorId: string;
  areaId: number;
  sectionList: Array<IKeusSection>;
  gatewayId: string;
  isDeepMediaEnabled?: boolean;
}
