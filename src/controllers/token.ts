import { catchErrors, EntityNotFoundError, InvalidTokenError } from "errors";
import { RefreshToken } from "schemas/RefreshToken";
import { User } from "schemas/User";
import token from "utils/token";

const getUserFromAccessToken = catchErrors((req, res) => {
  const accessToken = req.signedCookies.accessToken;
  if (!accessToken) {
    throw new InvalidTokenError();
  }
  const user = token.verifyAccessToken(accessToken);
  res.respond(user);
});

const refreshToken = catchErrors(async (req, res) => {
  const rt = req.signedCookies.refreshToken;
  if (rt) {
    const rtData = await RefreshToken.findOne({ refreshToken: rt });
    if (rtData) {
      const user = await User.findOne({ _id: rtData.user });
      if (user) {
        res.addAccessTokenToCookie({
          _id: user._id,
          email: user.email,
          verified: user.verified,
        });
      }

      throw new EntityNotFoundError("user");
    }
  }
  throw new InvalidTokenError();
});
