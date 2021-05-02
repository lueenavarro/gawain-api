import { catchErrors, EntityNotFoundError, InvalidTokenError } from "errors";
import { RefreshToken } from "schemas/RefreshToken";
import { User } from "schemas/User";
import token from "utils/token";

export const getUserFromAccessToken = catchErrors((req, res) => {
  const accessToken = req.signedCookies.accessToken;
  if (!accessToken) {
    throw new InvalidTokenError();
  }
  console.log(accessToken);
  const user = token.verifyAccessToken(accessToken);
  res.respond(user);
});

export const refreshAccessToken = catchErrors(async (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;
  if (refreshToken) {
    const rtData = await RefreshToken.findOne({ refreshToken });
    if (rtData) {
      const user = await User.findOne({ _id: rtData.user });
      if (user) {
        res.generateAccessToken(user);
        res.send();
        return;
      }
      throw new EntityNotFoundError("user");
    }
  }
  res.clearCookie("refreshToken");
  await RefreshToken.deleteOne({ refreshToken });
  throw new InvalidTokenError();
});
