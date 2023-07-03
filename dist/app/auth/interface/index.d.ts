export interface ITokenPayload {
    role?: string;
    user_id: string;
}
export interface IAuthResponse {
    accessToken: string;
    refreshToken?: string;
    data: {
        user_id: string;
        role: string;
    };
}
