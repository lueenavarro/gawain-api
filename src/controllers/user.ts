import { catchErrors } from "errors";
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

  res.status(201).send({
    accessToken: token.generateAccessToken({ email }),
    refreshToken: await getNewRefreshToken(user),
  });
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

  res.respond({
    accessToken: token.generateAccessToken({ email }),
    refreshToken: await getNewRefreshToken(user),
  });
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

const getNewRefreshToken = async (user: IUser) => {
  const refreshToken = token.generateRefreshToken();
  const refreshTokenData = new RefreshToken();
  refreshTokenData.refreshToken = refreshToken;
  refreshTokenData.user = user._id;
  await refreshTokenData.save();
  return refreshToken;
}
