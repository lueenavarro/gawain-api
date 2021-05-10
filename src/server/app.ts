import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { addRespondToResponse, addTokenHandler } from "middleware/response";
import { handleError } from "middleware/errors";
import { RouteNotFoundError } from "errors";
import { createDatabaseConnection } from "database/createConnection";
import { attachPrivateRoutes } from "server/routes";

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.log(error);
  }
};

let origin = "";
switch (process.env.SETTINGS) {
  case "development": {
    origin = "http://localhost:3000";
    break;
  }
  case "production": {
    origin = "https://onestep-client.netlify.app";
    break;
  }
}

const initializeExpress = (rootPath: string): void => {
  app.use(
    cors({
      origin,
      credentials: true,
    })
  );
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(addRespondToResponse);
  app.use(addTokenHandler);

  app.use(rootPath, attachPrivateRoutes());

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);
};

export const initializeApp = async (rootPath = "/"): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress(rootPath);
};

export const app = express();
