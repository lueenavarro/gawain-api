import "module-alias/register";
import "dotenv/config";

import express from "express";
import cors from "cors";

import { addRespondToResponse } from "middleware/response";
import { handleError } from "middleware/errors";
import { RouteNotFoundError } from "errors";

import { createDatabaseConnection } from "database/createConnection";

import { attachPrivateRoutes } from "./routes";

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.log(error);
  }
};

const initializeExpress = (): void => {
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(addRespondToResponse);

  attachPrivateRoutes(app);

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);

  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`listening to port ${port}`);
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

initializeApp();
