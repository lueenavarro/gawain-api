import { catchErrors } from "errors";
import { Request, Response } from "express";
import { RefreshToken } from "schemas/RefreshToken";
import { IUser, User } from "schemas/User";

import passwordUtil from "utils/password";
import token from "utils/token";

export const signup = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  const user = new User();
  user.email = email;
  user.password = await passwordUtil.hash(password);
  await user.save();

  await configureTokens(req, res, user);

  res.status(201).send(mapUser(user));
});

export const login = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).send();
    return;
  }

  const passWordMatched = await passwordUtil.compare(password, user.password);
  if (!passWordMatched) {
    res.status(401).send();
    return;
  }

  await configureTokens(req, res, user);

  res.respond(mapUser(user));
});

export const findUser = catchErrors(async (req, res) => {
  const user = await User.findOne({ email: <string>req.query.email });
  if (!user) {
    res.status(404).send();
    return;
  }
  res.respond(mapUser(user));
});

const mapUser = (user: IUser) => ({
  _id: user._id,
  email: user.email,
  verified: user.verified,
});

const configureTokens = async (req: Request, res: Response, user: IUser) => {
  res.addAccessTokenToCookie(user);
  const existingRefreshToken = await RefreshToken.findOne({
    refreshToken: req.signedCookies.refreshToken,
  });
  if (!existingRefreshToken) {
    const newRefreshToken = token.generateRefreshToken();
    const refreshToken = new RefreshToken();
    refreshToken.refreshToken = newRefreshToken;
    refreshToken.user = user._id;
    await refreshToken.save();
    res.addRefreshTokenToCookie(newRefreshToken);
  }
};
