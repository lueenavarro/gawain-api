import jwt from "jsonwebtoken";
import randToken from "rand-token";

const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, <string>process.env.TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const verifyAccessToken = (token: any) => {
  return jwt.verify(token, <string>process.env.TOKEN_SECRET);
}

const generateRefreshToken = () => {
  return randToken.uid(256)
}

export default {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken
}
