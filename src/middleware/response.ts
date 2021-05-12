import { CookieOptions, RequestHandler } from "express";
import { pick } from "lodash";
import token from "utils/token";

export const addRespondToResponse: RequestHandler = (_req, res, next) => {
  res.respond = (data) => {
    res.status(200).send(data);
  };
  next();
};

export const addTokenHandler =
  (origin: string, secure: boolean): RequestHandler =>
  (_req, res, next) => {
    const domain = new URL(origin).hostname
    const commonCookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: "none",
      signed: true,
      domain,
      secure,
    };

    res.generateAccessToken = (user: any) => {
      const accessToken = token.generateAccessToken(
        pick(user, ["_id", "email", "verified"])
      );
      res.cookie("accessToken", accessToken, {
        ...commonCookieOptions,
        maxAge: 300000, // 5 minutes
      });

      return accessToken;
    };

    res.generateRefreshToken = () => {
      const refreshToken = token.generateRefreshToken();
      res.cookie("refreshToken", refreshToken, {
        ...commonCookieOptions,
        maxAge: 1296000000, // 15 days
      });

      return refreshToken;
    };

    next();
  };
