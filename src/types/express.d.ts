declare namespace Express {
  export interface Response {
    respond: (data: any) => void;
    addAccessTokenToCookie: (user: any) => void;
    addRefreshTokenToCookie: (refreshToken: string) => void;
  }
}
