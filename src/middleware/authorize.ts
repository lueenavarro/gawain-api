import { catchErrors, InvalidTokenError } from "errors";
import token from "utils/token";

export const authorize = catchErrors((req, _res, next) => {
  try {
    const user = token.verifyAccessToken(req.signedCookies.accessToken);
    req.user = user;
    next();
  } catch (error) {
    throw new InvalidTokenError();
  }
});
