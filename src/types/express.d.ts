declare namespace Express {
  export interface Response {
    respond: (data: any) => void;
    generateAccessToken: (user: any) => string;
    generateRefreshToken: () => string;
  }

  export interface Request {
    user: any;
  }
}
