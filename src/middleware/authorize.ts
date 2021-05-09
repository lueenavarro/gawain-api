import { catchErrors } from "errors"
import token from "utils/token"

export const authorize = catchErrors((req, _res, next) => {
    const user = token.verifyAccessToken(req.signedCookies.accessToken);
    req.user = user;
    next();
})