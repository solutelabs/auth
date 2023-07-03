export declare class UtilityService {
    generateRandomToken(): Promise<string>;
    isTokenPresentInAnotherUser(token: string): Promise<string>;
}
