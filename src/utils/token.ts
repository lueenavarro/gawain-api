import jwt from "jsonwebtoken";
import randToken from "rand-token";

const generateAccessToken = (token: any) => {
  return jwt.sign(token, <string>process.env.TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = () => {
  return randToken.uid(256)
}

export default {
    generateAccessToken,
    generateRefreshToken
}
