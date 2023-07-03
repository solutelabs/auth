import { AuthResponseData } from './auth-response-data.model';

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  data: AuthResponseData;
}