export interface IKeusUser {
  phone: string;
  email: string;
  userName: string;
  location: string;
  gender: string;
  dateOfBirth: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  homesList: string; //Array of json objects with {gatewayId, accessLevel, roomsList[list of roomids]}
  favoriteHome: string;
  lastUpdatedTime: number;
  roomPreferences: string;
}
