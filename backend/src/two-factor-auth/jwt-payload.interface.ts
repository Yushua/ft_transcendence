export interface JwtPayload {
    userID: string;
    twoFactor: boolean;
    secretCode: string;
}
