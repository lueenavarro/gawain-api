import { RequestHandler } from "express";
import token from "utils/token";

export const addRespondToResponse: RequestHandler = (_req, res, next) => {
  res.respond = (data): void => {
    res.status(200).send(data);
  };
  next();
};

export const addTokenHandler: RequestHandler = (_req, res, next) => {
  res.addAccessTokenToCookie = (user: any): void => {
    res.cookie(
      "accessToken",
      token.generateAccessToken({
        _id: user._id,
        email: user.email,
        verified: user.verified,
      }),
      {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 300000, // 5 minutes
        signed: true,
      }
    );
  };

  res.addRefreshTokenToCookie = (refreshToken: string): void => {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1296000000, // 15 days
      signed: true,
    });
  };

  next();
};
