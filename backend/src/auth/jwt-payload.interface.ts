export interface JwtPayload {
    userID: string;
    twoFactor: boolean;
    secretcode: string
}
