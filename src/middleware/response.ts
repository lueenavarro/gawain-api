import { RequestHandler } from "express";
import token from "utils/token";

export const addRespondToResponse: RequestHandler = (_req, res, next) => {
  res.respond = (data) => {
    res.status(200).send(data);
  };
  next();
};

export const addTokenHandler: RequestHandler = (_req, res, next) => {
  res.generateAccessToken = (user: any) => {
    const accessToken = token.generateAccessToken({
      _id: user._id,
      email: user.email,
      verified: user.verified,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 300000, // 5 minutes
      signed: true,
    });

    return accessToken;
  };

  res.generateRefreshToken = () => {
    const refreshToken = token.generateRefreshToken();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1296000000, // 15 days
      signed: true,
    });

    return refreshToken;
  };

  next();
};
